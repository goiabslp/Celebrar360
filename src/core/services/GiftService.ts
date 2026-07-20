import { SupabaseClient } from '@supabase/supabase-js';
import { Gift, GiftCategory, GiftPayment, GiftType, PaymentMethod } from '../types';
import { createPaymentPreference } from '../../lib/mercadopago';

export class GiftService {
  constructor(private supabase: SupabaseClient) {}

  // =========================================================================
  // CATEGORIAS DE PRESENTES (Melhoria Proativa)
  // =========================================================================

  async getCategoriesByEvent(eventId: string): Promise<GiftCategory[]> {
    const { data, error } = await this.supabase
      .from('gift_categories')
      .select('*')
      .eq('event_id', eventId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createCategory(eventId: string, name: string): Promise<GiftCategory> {
    const { data, error } = await this.supabase
      .from('gift_categories')
      .insert({ event_id: eventId, name })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('gift_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =========================================================================
  // PRESENTES (GIFTS)
  // =========================================================================

  async getGiftsByEvent(eventId: string): Promise<Gift[]> {
    const { data, error } = await this.supabase
      .from('gifts')
      .select('*')
      .eq('event_id', eventId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getGiftById(id: string): Promise<Gift | null> {
    const { data, error } = await this.supabase
      .from('gifts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createGift(giftData: Omit<Gift, 'id' | 'created_at' | 'updated_at' | 'collected_value' | 'sold_quotas'>): Promise<Gift> {
    const { data, error } = await this.supabase
      .from('gifts')
      .insert({
        ...giftData,
        collected_value: 0.00,
        sold_quotas: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateGift(id: string, giftData: Partial<Omit<Gift, 'id' | 'event_id' | 'created_at' | 'updated_at'>>): Promise<Gift> {
    const { data, error } = await this.supabase
      .from('gifts')
      .update(giftData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteGift(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('gifts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // =========================================================================
  // PROCESSAMENTO DE COMPRAS & CHECKOUT (Mercado Pago)
  // =========================================================================

  async initiateGiftPurchase(
    giftId: string,
    buyerName: string,
    buyerEmail: string,
    buyerMessage: string,
    paymentMethod: PaymentMethod,
    quotasToBuy: number,
    customAmount: number, // Utilizado no Tipo 3 (Valor Livre)
    backUrl: string
  ): Promise<{ payment: GiftPayment; checkoutUrl: string }> {
    const gift = await this.getGiftById(giftId);
    if (!gift) throw new Error('Presente não encontrado.');
    if (gift.status !== 'active') throw new Error('Este presente não está mais ativo.');

    let amount = 0;

    // Validações por tipo de presente (INSTRUÇÃO 12)
    if (gift.gift_type === 'unico') {
      if (gift.collected_value >= gift.total_value) {
        throw new Error('Este presente já foi adquirido por outro convidado.');
      }
      amount = gift.total_value;
      quotasToBuy = 1;
    } else if (gift.gift_type === 'cotas') {
      const remainingQuotas = gift.total_quotas - gift.sold_quotas;
      if (quotasToBuy > remainingQuotas) {
        throw new Error(`Quantidade de cotas indisponível. Restam apenas ${remainingQuotas} cotas.`);
      }
      amount = gift.quota_value * quotasToBuy;
    } else if (gift.gift_type === 'livre') {
      if (customAmount <= 0) {
        throw new Error('O valor de contribuição livre deve ser maior do que R$ 0,00.');
      }
      amount = customAmount;
      quotasToBuy = 1;
    }

    // Identificador estruturado único para a transação
    const purchaseId = `${Date.now()}`;
    const externalReference = `EVENTO_${gift.event_id.substring(0, 8)}_PRESENTE_${gift.id.substring(0, 8)}_COMPRA_${purchaseId}`;

    // 1. Registrar pagamento pendente no banco
    const { data: payment, error: pyError } = await this.supabase
      .from('gift_payments')
      .insert({
        gift_id: gift.id,
        external_reference: externalReference,
        gateway: 'mercado_pago',
        payment_method: paymentMethod,
        amount: amount,
        quotas_purchased: quotasToBuy,
        status: 'pending',
      })
      .select()
      .single();

    if (pyError) throw pyError;

    // 2. Criar preferência de checkout Mercado Pago
    const preference = await createPaymentPreference({
      externalReference: externalReference,
      title: `${gift.gift_type === 'cotas' ? `Cotas (${quotasToBuy}x)` : 'Presente'}: ${gift.title}`,
      price: amount,
      payer: {
        name: buyerName,
        email: buyerEmail,
      },
      backUrl,
    });

    return {
      payment,
      checkoutUrl: preference.sandbox_init_point || preference.init_point,
    };
  }

  // =========================================================================
  // WEBHOOK DE ATUALIZAÇÃO (Supabase Realtime & Transação de Segurança)
  // =========================================================================

  async handlePaymentWebhook(
    externalReference: string,
    gatewayPaymentId: string,
    gatewayStatus: string,
    ipAddress?: string
  ): Promise<void> {
    const statusMap: Record<string, GiftPayment['status']> = {
      approved: 'approved',
      rejected: 'cancelled',
      cancelled: 'cancelled',
      refunded: 'refunded',
      pending: 'pending',
    };

    const status = statusMap[gatewayStatus] || 'pending';

    // 1. Buscar a transação existente
    const { data: payment, error: payError } = await this.supabase
      .from('gift_payments')
      .select('*')
      .eq('external_reference', externalReference)
      .single();

    if (payError || !payment) {
      throw new Error(`Transação externa ${externalReference} não localizada.`);
    }

    // Prevenir dupla confirmação
    if (payment.status === 'approved') {
      console.log(`Transação ${externalReference} já está aprovada. Ignorando.`);
      return;
    }

    // 2. Registrar log de webhook para auditoria
    await this.supabase.from('payment_logs').insert({
      payment_id: payment.id,
      payload_received: { externalReference, gatewayPaymentId, gatewayStatus },
      gateway_response: { status },
      ip_address: ipAddress || '127.0.0.1',
      status: status,
    });

    // 3. Atualizar o pagamento
    const { data: updatedPayment, error: updatePayErr } = await this.supabase
      .from('gift_payments')
      .update({
        status,
        gateway_payment_id: gatewayPaymentId,
      })
      .eq('id', payment.id)
      .select()
      .single();

    if (updatePayErr) throw updatePayErr;

    // 4. Se o pagamento foi aprovado, atualiza o presente
    if (status === 'approved' && payment.gift_id) {
      const gift = await this.getGiftById(payment.gift_id);
      if (gift) {
        const newCollected = Number(gift.collected_value) + Number(payment.amount);
        const newSoldQuotas = Number(gift.sold_quotas) + Number(payment.quotas_purchased);

        let giftStatus = gift.status;
        
        // Se for presente Único, fica inativo imediatamente
        if (gift.gift_type === 'unico' && newCollected >= gift.total_value) {
          giftStatus = 'inactive';
        }

        // Atualizar o presente no banco
        const { data: updatedGift, error: updateGiftErr } = await this.supabase
          .from('gifts')
          .update({
            collected_value: newCollected,
            sold_quotas: newSoldQuotas,
            status: giftStatus,
          })
          .eq('id', gift.id)
          .select()
          .single();

        if (updateGiftErr) throw updateGiftErr;

        // 5. Emitir atualização em tempo real via Supabase Realtime (INSTRUÇÃO 12)
        await this.supabase.channel(`gifts-event-${gift.event_id}`).send({
          type: 'broadcast',
          event: 'gift_updated',
          payload: {
            giftId: gift.id,
            collectedValue: newCollected,
            soldQuotas: newSoldQuotas,
            percentage: Math.min(Math.round((newCollected / gift.total_value) * 100), 100),
            status: giftStatus,
          },
        });
      }
    }
  }

  // =========================================================================
  // RELATÓRIOS DO DASHBOARD
  // =========================================================================

  async getGiftsDashboardMetrics(eventId: string) {
    const gifts = await this.getGiftsByEvent(eventId);
    
    // Obter todos os pagamentos aprovados do evento
    const { data: payments } = await this.supabase
      .from('gift_payments')
      .select('*, gifts!inner(event_id)')
      .eq('gifts.event_id', eventId)
      .eq('status', 'approved');

    const approvedPayments = payments || [];

    const totalCollected = approvedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalGiftsCount = gifts.length;
    const soldGiftsCount = gifts.filter(g => g.gift_type === 'unico' && g.status === 'inactive').length;
    const pendingGiftsCount = gifts.filter(g => g.gift_type === 'unico' && g.status === 'active').length;

    return {
      totalCollected,
      totalGiftsCount,
      soldGiftsCount,
      pendingGiftsCount,
      recentPayments: approvedPayments.slice(0, 5),
    };
  }
}
