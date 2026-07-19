import { SupabaseClient } from '@supabase/supabase-js';
import { Gift, Transaction } from '../types';
import { createPaymentPreference } from '../../lib/mercadopago';

export class GiftService {
  constructor(private supabase: SupabaseClient) {}

  async getGiftsByEvent(eventId: string): Promise<Gift[]> {
    const { data, error } = await this.supabase
      .from('gifts')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

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

  async createGift(giftData: Omit<Gift, 'id' | 'created_at' | 'updated_at' | 'is_purchased'>): Promise<Gift> {
    const { data, error } = await this.supabase
      .from('gifts')
      .insert({ ...giftData, is_purchased: false })
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

  async initiateGiftPurchase(
    giftId: string,
    buyerName: string,
    buyerEmail: string,
    buyerMessage: string,
    backUrl: string
  ): Promise<{ transaction: Transaction; checkoutUrl: string }> {
    const gift = await this.getGiftById(giftId);
    if (!gift) throw new Error('Presente não encontrado.');

    // 1. Criar transação pendente no banco
    const feePercent = 0.03; // Taxa fictícia da plataforma de 3%
    const feeAmount = parseFloat((gift.price * feePercent).toFixed(2));
    const netAmount = parseFloat((gift.price - feeAmount).toFixed(2));

    const { data: transaction, error: txError } = await this.supabase
      .from('transactions')
      .insert({
        event_id: gift.event_id,
        gift_id: gift.id,
        payer_name: buyerName,
        payer_email: buyerEmail,
        payer_message: buyerMessage,
        amount: gift.price,
        fee_amount: feeAmount,
        net_amount: netAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (txError) throw txError;

    // 2. Criar preferência de pagamento no Mercado Pago
    const preference = await createPaymentPreference({
      externalReference: transaction.id,
      title: `Presente: ${gift.name}`,
      price: gift.price,
      payer: {
        name: buyerName,
        email: buyerEmail,
      },
      backUrl,
    });

    return {
      transaction,
      checkoutUrl: preference.sandbox_init_point || preference.init_point,
    };
  }

  async getTransactionsByEvent(eventId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async handlePaymentWebhook(externalReference: string, mpPaymentId: string, status: string): Promise<void> {
    const dbStatus = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending';

    // 1. Atualizar transação
    const { data: transaction, error: txError } = await this.supabase
      .from('transactions')
      .update({
        status: dbStatus,
        mp_payment_id: mpPaymentId,
      })
      .eq('id', externalReference)
      .select()
      .single();

    if (txError) throw txError;

    // 2. Se aprovado, marcar presente como comprado
    if (dbStatus === 'approved' && transaction.gift_id) {
      await this.supabase
        .from('gifts')
        .update({ is_purchased: true })
        .eq('id', transaction.gift_id);
    }
  }
}
