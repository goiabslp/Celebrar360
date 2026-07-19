-- Migração Inicial para Celebrar360
-- Define o esquema de banco de dados, enums, funções, triggers e políticas RLS.

-- Habilitar a extensão uuid-ossp se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- ENUMS
-- =========================================================================

CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete');
CREATE TYPE subscription_plan AS ENUM ('free', 'premium', 'vip');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'finished');
CREATE TYPE rsvp_status AS ENUM ('confirmed', 'declined', 'pending');
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'rejected', 'refunded');
CREATE TYPE media_type AS ENUM ('image', 'video');

-- =========================================================================
-- TABELAS
-- =========================================================================

-- 1. perfis (Sincronizado com auth.users do Supabase)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Perfil do organizador do evento, associado à conta auth.users.';

-- 2. assinaturas (Planos SaaS de cada organizador)
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    plan_type subscription_plan NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'active',
    mp_subscription_id TEXT, -- ID do plano ou assinatura no Mercado Pago
    mp_preapproval_id TEXT, -- Preapproval ID do assinante
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.subscriptions IS 'Status da assinatura e plano contratado do usuário no SaaS.';

-- 3. eventos
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    location_name TEXT,
    location_address TEXT,
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    status event_status NOT NULL DEFAULT 'draft',
    custom_domain TEXT UNIQUE,
    theme_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.events IS 'Eventos criados pelos organizadores.';

-- 4. paginas (Criação de abas/páginas personalizadas no site do evento)
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    layout TEXT NOT NULL DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (event_id, slug)
);

COMMENT ON TABLE public.pages IS 'Páginas que compõem o site do evento (Ex: Home, Lista de Presentes, RSVP).';

-- 5. blocos (Componentes visuais dentro de cada página)
CREATE TABLE public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'hero', 'rsvp_form', 'gift_list', 'gallery', 'map', 'text'
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.blocks IS 'Blocos de conteúdo de uma página (seções editáveis pelo criador de sites).';

-- 6. rsvps (Confirmações de Presença)
CREATE TABLE public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    status rsvp_status NOT NULL DEFAULT 'pending',
    guests_count INTEGER NOT NULL DEFAULT 1 CHECK (guests_count >= 1),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.rsvps IS 'Confirmações de presença preenchidas pelos convidados.';

-- 7. presentes (Lista de Presentes do Evento)
CREATE TABLE public.gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0.00),
    image_url TEXT,
    is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.gifts IS 'Itens da lista de presentes criados pelo organizador para conversão em dinheiro.';

-- 8. transações (Compras de presentes via Mercado Pago)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    gift_id UUID REFERENCES public.gifts(id) ON DELETE SET NULL,
    payer_name TEXT NOT NULL,
    payer_email TEXT NOT NULL,
    payer_message TEXT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0.00),
    fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (fee_amount >= 0.00),
    net_amount NUMERIC(10, 2) NOT NULL CHECK (net_amount >= 0.00),
    status transaction_status NOT NULL DEFAULT 'pending',
    mp_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.transactions IS 'Histórico de transações financeiras de presentes pagas com Mercado Pago.';

-- 9. galeria_midia (Fotos e vídeos pós-evento)
CREATE TABLE public.gallery_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type media_type NOT NULL DEFAULT 'image',
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.gallery_media IS 'Mídias da galeria pós-evento enviadas pelos organizadores ou convidados.';

-- 10. audit_logs (Logs de auditoria interna)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Registro histórico de eventos e ações críticas realizadas na plataforma.';

-- =========================================================================
-- ÍNDICES
-- =========================================================================

CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_pages_event_id ON public.pages(event_id);
CREATE INDEX idx_blocks_page_id ON public.blocks(page_id);
CREATE INDEX idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX idx_gifts_event_id ON public.gifts(event_id);
CREATE INDEX idx_transactions_event_id ON public.transactions(event_id);
CREATE INDEX idx_gallery_media_event_id ON public.gallery_media(event_id);

-- =========================================================================
-- TRIGGERS E FUNÇÕES AUTOMÁTICAS
-- =========================================================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionando triggers de atualização de timestamp
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_blocks_updated_at BEFORE UPDATE ON public.blocks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_rsvps_updated_at BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_gifts_updated_at BEFORE UPDATE ON public.gifts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para sincronizar auth.users com profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        'user'
    );
    
    -- Criar assinatura gratuita inicial automaticamente
    INSERT INTO public.subscriptions (user_id, plan_type, status)
    VALUES (NEW.id, 'free', 'active');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) & POLÍTICAS
-- =========================================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Políticas de Perfis (Profiles)
CREATE POLICY "Permitir leitura pública de perfis" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Políticas de Assinaturas (Subscriptions)
CREATE POLICY "Usuários podem visualizar sua própria assinatura" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- 3. Políticas de Eventos (Events)
CREATE POLICY "Eventos públicos podem ser visualizados por qualquer um" ON public.events
    FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios eventos" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios eventos" ON public.events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios eventos" ON public.events
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Políticas de Páginas (Pages)
CREATE POLICY "Qualquer um pode ver páginas de eventos publicados" ON public.pages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = pages.event_id AND (events.status = 'published' OR events.user_id = auth.uid())
        )
    );

CREATE POLICY "Donos de eventos podem gerenciar páginas" ON public.pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = pages.event_id AND events.user_id = auth.uid()
        )
    );

-- 5. Políticas de Blocos (Blocks)
CREATE POLICY "Qualquer um pode ver blocos de páginas ativas" ON public.blocks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pages
            JOIN public.events ON events.id = pages.event_id
            WHERE pages.id = blocks.page_id AND (events.status = 'published' OR events.user_id = auth.uid())
        )
    );

CREATE POLICY "Donos de eventos podem gerenciar blocos" ON public.blocks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.pages
            JOIN public.events ON events.id = pages.event_id
            WHERE pages.id = blocks.page_id AND events.user_id = auth.uid()
        )
    );

-- 6. Políticas de RSVPs (Confirmações de Presença)
CREATE POLICY "Qualquer um pode enviar RSVPs para eventos publicados" ON public.rsvps
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = rsvps.event_id AND events.status = 'published'
        )
    );

CREATE POLICY "Donos de eventos podem gerenciar RSVPs" ON public.rsvps
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = rsvps.event_id AND events.user_id = auth.uid()
        )
    );

-- 7. Políticas de Presentes (Gifts)
CREATE POLICY "Qualquer um pode visualizar presentes de eventos publicados" ON public.gifts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gifts.event_id AND (events.status = 'published' OR events.user_id = auth.uid())
        )
    );

CREATE POLICY "Donos de eventos podem gerenciar presentes" ON public.gifts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gifts.event_id AND events.user_id = auth.uid()
        )
    );

-- 8. Políticas de Transações (Transactions)
CREATE POLICY "Donos de eventos podem ver suas transações" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = transactions.event_id AND events.user_id = auth.uid()
        )
    );

-- As inserções de transações serão feitas pelo backend via service_role após aprovação do Mercado Pago.

-- 9. Políticas de Galeria (Gallery Media)
CREATE POLICY "Qualquer um pode ver mídias aprovadas" ON public.gallery_media
    FOR SELECT USING (
        is_approved = true OR 
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gallery_media.event_id AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Qualquer um pode enviar mídias para a galeria" ON public.gallery_media
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gallery_media.event_id AND events.status = 'published'
        )
    );

CREATE POLICY "Donos de eventos podem gerenciar mídias da galeria" ON public.gallery_media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = gallery_media.event_id AND events.user_id = auth.uid()
        )
    );

-- 10. Políticas de Logs (Audit Logs)
CREATE POLICY "Apenas administradores ou o próprio usuário podem ver logs de auditoria" ON public.audit_logs
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- =========================================================================
-- CONFIGURAÇÃO DE ARMAZENAMENTO (STORAGE BUCKETS & POLICIES)
-- =========================================================================

-- Criar buckets se não existirem
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gifts', 'gifts', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso público para leitura de arquivos dos buckets
CREATE POLICY "Leitura pública de fotos da galeria" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Leitura pública de fotos de presentes" ON storage.objects
    FOR SELECT USING (bucket_id = 'gifts');

-- Políticas para usuários autenticados realizarem uploads nos buckets
CREATE POLICY "Usuários autenticados podem enviar fotos para a galeria" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem enviar fotos de presentes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'gifts' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários podem apagar seus próprios arquivos na galeria" ON storage.objects
    FOR DELETE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

