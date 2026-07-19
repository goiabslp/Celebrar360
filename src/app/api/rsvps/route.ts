import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { RSVPService } from '@/core/services/RSVPService';
import { sendEmail } from '@/lib/resend';

const rsvpSchema = z.object({
  eventId: z.string().uuid('ID do evento inválido'),
  name: z.string().min(2, 'O nome deve conter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().min(8, 'Telefone inválido').optional().or(z.literal('')),
  status: z.enum(['confirmed', 'declined', 'pending']),
  guestsCount: z.number().min(1, 'Quantidade de convidados mínima é 1').default(1),
  notes: z.string().max(300, 'A observação deve ter no máximo 300 caracteres').optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados de confirmação inválidos', details: result.error.format() },
        { status: 400 }
      );
    }

    const { eventId, name, email, phone, status, guestsCount, notes } = result.data;

    const supabase = await createClient();
    const rsvpService = new RSVPService(supabase);

    // Salvar confirmação no banco de dados
    const rsvp = await rsvpService.createRSVP({
      event_id: eventId,
      name,
      email: email || null,
      phone: phone || null,
      status,
      guests_count: guestsCount,
      notes: notes || null,
    });

    // Buscar dados do organizador do evento para envio de e-mail de notificação
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('title, user_id, profiles(email, name)')
      .eq('id', eventId)
      .single();

    if (!eventError && eventData?.profiles) {
      const hostEmail = (eventData.profiles as any).email;
      const hostName = (eventData.profiles as any).name || 'Organizador';

      if (hostEmail) {
        const subject = `Nova confirmação de presença: ${name}`;
        const html = `
          <h2>Olá, ${hostName}!</h2>
          <p>Você recebeu uma nova confirmação de presença para o seu evento <strong>${eventData.title}</strong>.</p>
          <ul>
            <li><strong>Nome do Convidado:</strong> ${name}</li>
            <li><strong>Presença:</strong> ${status === 'confirmed' ? 'Confirmada (Comparecerá)' : 'Recusada (Não comparecerá)'}</li>
            <li><strong>Total de Pessoas:</strong> ${guestsCount}</li>
            <li><strong>Notas/Mensagem:</strong> ${notes || 'Nenhuma'}</li>
          </ul>
          <p>Você pode gerenciar todos os seus convidados a qualquer momento acessando o seu Dashboard.</p>
          <br/>
          <p>Atenciosamente,<br/>Equipe Celebrar360</p>
        `;
        await sendEmail({ to: hostEmail, subject, html });
      }
    }

    return NextResponse.json({ success: true, rsvp });
  } catch (error: any) {
    console.error('Erro ao enviar RSVP:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar confirmação de presença' },
      { status: 500 }
    );
  }
}
