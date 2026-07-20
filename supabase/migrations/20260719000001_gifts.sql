-- Migração para Módulo de Lista de Presentes e Pagamentos Avançado (Funcionalidade 12)

-- 1. Categorias de Presentes
CREATE TABLE public.gift_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.gift_categories IS 'Categorias criadas pelo organizador do evento para agrupar presentes.';

-- 2. Recriar/Modificar tabela de presentes (gifts)
-- Caso a tabela gifts já exista da migração anterior, vamos ajustá-la
DROP TABLE IF EXISTS public.gifts CASCADE;

CREATE TABLE public.gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.gift_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    gift_type TEXT NOT NULL CHECK (gift_type IN ('unico', 'cotas', 'livre')),
    total_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_value >= 0.00),
    collected_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (collected_value >= 0.00),
    quota_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (quota_value >= 0.00),
    total_quotas INTEGER NOT NULL DEFAULT 0 CHECK (total_quotas >= 0),
    sold_quotas INTEGER NOT NULL DEFAULT 0 CHECK (sold_quotas >= 0),
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    hide_when_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.gifts IS 'Presentes cadastrados no site do evento com controle de valor total e cotas.';

-- 3. Tabela de Pagamento de Presentes (gift_payments)
DROP TABLE IF EXISTS public.gift_payments CASCADE;

CREATE TABLE public.gift_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_id UUID REFERENCES public.gifts(id) ON DELETE SET NULL,
    guest_id UUID, -- Rastreamento opcional do convidado
    external_reference TEXT UNIQUE NOT NULL,
    gateway_payment_id TEXT,
    gateway TEXT NOT NULL DEFAULT 'mercado_pago',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'debit_card')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0.00),
    quotas_purchased INTEGER NOT NULL DEFAULT 1 CHECK (quotas_purchased >= 1),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.gift_payments IS 'Histórico de transações financeiras de presentes pagas com Mercado Pago.';

-- 4. Tabela de Logs de Pagamento (payment_logs)
CREATE TABLE public.payment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.gift_payments(id) ON DELETE SET NULL,
    payload_received JSONB NOT NULL DEFAULT '{}'::jsonb,
    gateway_response JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payment_logs IS 'Logs de auditoria e webhook para rastreabilidade de pagamentos.';

-- =========================================================================
-- ÍNDICES
-- =========================================================================

CREATE INDEX idx_gift_categories_event_id ON public.gift_categories(event_id);
CREATE INDEX idx_gifts_category_id ON public.gifts(category_id);
CREATE INDEX idx_gift_payments_gift_id ON public.gift_payments(gift_id);
CREATE INDEX idx_gift_payments_external_ref ON public.gift_payments(external_reference);

-- =========================================================================
-- TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- =========================================================================

CREATE TRIGGER tr_gift_categories_updated_at BEFORE UPDATE ON public.gift_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_gifts_updated_at BEFORE UPDATE ON public.gifts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_gift_payments_updated_at BEFORE UPDATE ON public.gift_payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) & POLÍTICAS
-- =========================================================================

ALTER TABLE public.gift_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- 1. Políticas de Categorias
CREATE POLICY "Leitura pública de categorias de eventos ativos" ON public.gift_categories
    FOR SELECT USING (true);

CREATE POLICY "Dono do evento gerencia categorias" ON public.gift_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gift_categories.event_id AND events.user_id = auth.uid()
        )
    );

-- 2. Políticas de Presentes
CREATE POLICY "Leitura pública de presentes de eventos ativos" ON public.gifts
    FOR SELECT USING (
        status = 'active' AND 
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gifts.event_id AND (events.status = 'published' OR events.user_id = auth.uid())
        )
    );

CREATE POLICY "Dono do evento gerencia presentes" ON public.gifts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gifts.event_id AND events.user_id = auth.uid()
        )
    );

-- 3. Políticas de Pagamentos
CREATE POLICY "Dono do evento vê pagamentos de presentes" ON public.gift_payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.gifts
            JOIN public.events ON events.id = gifts.event_id
            WHERE gifts.id = gift_payments.gift_id AND events.user_id = auth.uid()
        )
    );

-- As inserções de pagamentos e logs são realizadas pelo backend administrativo (service_role)
