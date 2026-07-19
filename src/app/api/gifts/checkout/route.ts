import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { GiftService } from '@/core/services/GiftService';

const checkoutSchema = z.object({
  giftId: z.string().uuid('ID do presente inválido'),
  buyerName: z.string().min(2, 'Nome deve conter pelo menos 2 caracteres'),
  buyerEmail: z.string().email('E-mail inválido'),
  buyerMessage: z.string().max(500, 'Mensagem deve ter no máximo 500 caracteres').optional(),
  backUrl: z.string().url('URL de retorno inválida'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados de validação incorretos', details: result.error.format() },
        { status: 400 }
      );
    }

    const { giftId, buyerName, buyerEmail, buyerMessage, backUrl } = result.data;

    // Conexão com o Supabase usando o cliente de servidor
    const supabase = await createClient();
    const giftService = new GiftService(supabase);

    const purchaseDetails = await giftService.initiateGiftPurchase(
      giftId,
      buyerName,
      buyerEmail,
      buyerMessage || '',
      backUrl
    );

    return NextResponse.json({
      success: true,
      checkoutUrl: purchaseDetails.checkoutUrl,
      transactionId: purchaseDetails.transaction.id,
    });
  } catch (error: any) {
    console.error('Erro na rota de checkout de presentes:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar compra de presente' },
      { status: 500 }
    );
  }
}
