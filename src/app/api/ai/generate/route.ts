import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { generateEventContent } from '@/lib/openai';

const generateSchema = z.object({
  eventType: z.string().min(2, 'Tipo de evento é obrigatório'),
  theme: z.string().min(2, 'Estilo/Tema é obrigatório'),
  hostName: z.string().min(2, 'Nome do anfitrião é obrigatório'),
  additionalDetails: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar autenticação
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 2. Validar body
    const body = await req.json();
    const result = generateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.format() },
        { status: 400 }
      );
    }

    const { eventType, theme, hostName, additionalDetails } = result.data;

    // 3. Chamar serviço OpenAI
    const suggestions = await generateEventContent({
      eventType,
      theme,
      hostName,
      additionalDetails,
    });

    // 4. Salvar log de auditoria
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'AI_CONTENT_GENERATION',
      entity: 'events',
      details: { eventType, theme, hostName },
    });

    return NextResponse.json({ success: true, ...suggestions });
  } catch (error: any) {
    console.error('Erro na geração de conteúdo por IA:', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao processar requisição de IA' },
      { status: 500 }
    );
  }
}
