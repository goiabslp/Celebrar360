import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { GiftService } from '@/core/services/GiftService';
import { getPaymentStatus } from '@/lib/mercadopago';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Obter dados do pagamento
    let paymentId = searchParams.get('data.id') || searchParams.get('id');
    let action = searchParams.get('type') || searchParams.get('topic') || searchParams.get('action');

    // Tentar ler do body
    if (!paymentId) {
      try {
        const body = await req.json();
        paymentId = body?.data?.id || body?.id || body?.resource;
        action = body?.type || body?.action || action;
      } catch (_) {}
    }

    if (!paymentId) {
      return NextResponse.json({ error: 'Identificador do pagamento não fornecido' }, { status: 400 });
    }

    // IP de origem para auditoria
    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Apenas processa tópicos de pagamento válidos (INSTRUÇÃO 12)
    const validActions = [
      'payment',
      'payment.created',
      'payment.pending',
      'payment.approved',
      'payment.cancelled',
      'payment.refunded'
    ];

    if (action && (validActions.includes(action) || action.startsWith('payment.'))) {
      // Obter detalhes completos do gateway (Mercado Pago)
      const paymentInfo = await getPaymentStatus(paymentId);
      const externalReference = paymentInfo.external_reference;
      const status = paymentInfo.status; // approved, pending, cancelled, etc.

      if (externalReference) {
        const supabaseAdmin = createAdminClient();
        const giftService = new GiftService(supabaseAdmin);
        
        // Executar transações e auditorias internas no banco de dados
        await giftService.handlePaymentWebhook(externalReference, paymentId, status, ipAddress);

        return NextResponse.json({ success: true, processed: true, status });
      }
    }

    return NextResponse.json({ success: true, processed: false });
  } catch (error: any) {
    console.error('Erro de processamento no webhook Mercado Pago:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no processamento do webhook' },
      { status: 500 }
    );
  }
}
