import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { GiftService } from '@/core/services/GiftService';
import { getPaymentStatus } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Mercado Pago pode enviar ID via query string ou body
    let paymentId = searchParams.get('data.id') || searchParams.get('id');
    let type = searchParams.get('type') || searchParams.get('topic');

    // Tentar ler do body se não vier nos parâmetros de URL
    if (!paymentId) {
      try {
        const body = await req.json();
        paymentId = body?.data?.id || body?.id;
        type = body?.type || body?.action;
      } catch (_) {}
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'ID do pagamento não fornecido' }, { status: 400 });
    }

    // Apenas processa se for relacionado a pagamento
    if (type === 'payment' || type === 'payment.created' || type === 'payment.updated') {
      const paymentInfo = await getPaymentStatus(paymentId);
      const externalReference = paymentInfo.external_reference;
      const status = paymentInfo.status; // approved, rejected, pending, etc.

      if (externalReference) {
        const supabaseAdmin = createAdminClient();
        const giftService = new GiftService(supabaseAdmin);
        
        await giftService.handlePaymentWebhook(externalReference, paymentId, status);
        
        // Logar auditoria
        await supabaseAdmin.from('audit_logs').insert({
          action: 'PAYMENT_WEBHOOK_RECEIVED',
          entity: 'transactions',
          entity_id: externalReference,
          details: { paymentId, status, type },
        });

        return NextResponse.json({ success: true, processed: true });
      }
    }

    return NextResponse.json({ success: true, processed: false });
  } catch (error: any) {
    console.error('Erro no webhook do Mercado Pago:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no processamento do webhook' },
      { status: 500 }
    );
  }
}
