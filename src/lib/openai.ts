import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface GenerateSuggestionsInput {
  eventType: string;
  theme: string;
  hostName: string;
  additionalDetails?: string;
}

export async function generateEventContent({
  eventType,
  theme,
  hostName,
  additionalDetails,
}: GenerateSuggestionsInput) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      title: `${eventType} de ${hostName}`,
      welcomeMessage: `Sejam bem-vindos ao nosso site de ${eventType.toLowerCase()}! Estamos muito felizes em celebrar este momento com vocês.`,
      aboutUs: `Aqui compartilharemos todos os detalhes do nosso grande dia.`,
    };
  }

  const prompt = `Você é um redator profissional especialista em casamentos e eventos sociais.
  Gere textos persuasivos, emocionantes e acolhedores para o site de um evento.
  
  Dados do evento:
  - Tipo de evento: ${eventType} (ex: Casamento, Aniversário, Chá de Bebê)
  - Tema/Estilo: ${theme} (ex: Clássico, Rústico, Moderno, Minimalista)
  - Anfitrião(s): ${hostName}
  - Detalhes adicionais: ${additionalDetails || 'Nenhum'}

  Retorne EXCLUSIVAMENTE um objeto JSON válido (sem markdown ou blocos de código) contendo as seguintes propriedades:
  {
    "title": "Um título atraente para o site",
    "welcomeMessage": "Uma mensagem de boas-vindas calorosa para a página inicial",
    "aboutUs": "Um texto curto sobre a história do anfitrião ou o propósito do evento"
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Erro ao gerar conteúdo com OpenAI:', error);
  }

  return {
    title: `${eventType} de ${hostName}`,
    welcomeMessage: `Sejam bem-vindos ao nosso site de ${eventType.toLowerCase()}! Estamos muito felizes em celebrar este momento com vocês.`,
    aboutUs: `Aqui compartilharemos todos os detalhes do nosso grande dia.`,
  };
}
