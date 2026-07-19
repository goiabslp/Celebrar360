interface CreatePreferenceInput {
  externalReference: string; // ID da nossa transação no banco
  title: string;
  price: number;
  payer: {
    name: string;
    email: string;
  };
  backUrl: string;
}

export async function createPaymentPreference({
  externalReference,
  title,
  price,
  payer,
  backUrl,
}: CreatePreferenceInput) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!token) {
    // Retorna URL fictícia para testes em ambiente de desenvolvimento
    console.log('[Mercado Pago Mock] Criando preferência para:', title, 'R$', price);
    return {
      id: 'mock-preference-id',
      init_point: `${backUrl}?status=approved&payment_id=mock-payment-123&preference_id=mock-preference-id`,
      sandbox_init_point: `${backUrl}?status=approved&payment_id=mock-payment-123&preference_id=mock-preference-id`,
    };
  }

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [
          {
            title,
            quantity: 1,
            unit_price: price,
            currency_id: 'BRL',
          },
        ],
        payer: {
          name: payer.name,
          email: payer.email,
        },
        back_urls: {
          success: backUrl,
          pending: backUrl,
          failure: backUrl,
        },
        auto_return: 'approved',
        external_reference: externalReference,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro API Mercado Pago: ${errText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    };
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
}

export async function getPaymentStatus(paymentId: string) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    return { status: 'approved', transaction_amount: 100 };
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao obter status do pagamento.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao consultar pagamento:', error);
    throw error;
  }
}
