import { SupabaseClient } from '@supabase/supabase-js';
import { Event, Page, Block, EventStatus } from '../types';

export class EventService {
  constructor(private supabase: SupabaseClient) {}

  async getEventsByUser(userId: string): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    // Insere o evento
    const { data: event, error: eventError } = await this.supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (eventError) throw eventError;

    // Criar as páginas padrão automaticamente (Home, Lista de Presentes, RSVP, Galeria)
    const defaultPages = [
      { title: 'Início', slug: 'home', layout: 'default' },
      { title: 'Lista de Presentes', slug: 'presentes', layout: 'default' },
      { title: 'Confirmar Presença (RSVP)', slug: 'rsvp', layout: 'default' },
      { title: 'Álbum de Fotos', slug: 'galeria', layout: 'default' },
    ];

    for (const page of defaultPages) {
      const { data: pageData, error: pageError } = await this.supabase
        .from('pages')
        .insert({
          event_id: event.id,
          title: page.title,
          slug: page.slug,
          is_published: true,
          layout: page.layout,
        })
        .select()
        .single();

      if (pageError) continue;

      // Criar blocos padrão para a página Home
      if (page.slug === 'home') {
        const defaultBlocks = [
          {
            type: 'hero',
            sort_order: 0,
            content: {
              title: event.title,
              subtitle: 'Sejam bem-vindos ao site do nosso evento!',
              imageUrl: '',
              theme: 'classic',
            },
          },
          {
            type: 'text',
            sort_order: 1,
            content: {
              title: 'Sobre Nós',
              body: 'Compartilhamos com vocês a alegria de celebrar este grande dia. Aqui você encontrará todas as informações importantes.',
            },
          },
          {
            type: 'map',
            sort_order: 2,
            content: {
              title: 'Localização',
              address: event.location_address || 'A definir',
              latitude: event.location_latitude || -23.55052,
              longitude: event.location_longitude || -46.633308,
            },
          },
        ];

        for (const block of defaultBlocks) {
          await this.supabase.from('blocks').insert({
            page_id: pageData.id,
            type: block.type,
            content: block.content,
            sort_order: block.sort_order,
          });
        }
      }

      // Bloco padrão da página de Presentes
      if (page.slug === 'presentes') {
        await this.supabase.from('blocks').insert({
          page_id: pageData.id,
          type: 'gift_list',
          content: {
            title: 'Lista de Presentes Virtuais',
            description: 'Escolha um presente fictício da nossa lista. O valor correspondente será convertido em dinheiro para nossa comemoração.',
          },
          sort_order: 0,
        });
      }

      // Bloco padrão de RSVP
      if (page.slug === 'rsvp') {
        await this.supabase.from('blocks').insert({
          page_id: pageData.id,
          type: 'rsvp_form',
          content: {
            title: 'Confirme sua Presença',
            description: 'Por favor, confirme se você comparecerá ao evento até a data limite.',
          },
          sort_order: 0,
        });
      }

      // Bloco padrão de Galeria
      if (page.slug === 'galeria') {
        await this.supabase.from('blocks').insert({
          page_id: pageData.id,
          type: 'gallery',
          content: {
            title: 'Galeria do Pós-Evento',
            description: 'Aqui você poderá conferir e enviar fotos registradas durante o evento.',
            allowGuestUpload: true,
          },
          sort_order: 0,
        });
      }
    }

    return event;
  }

  async updateEvent(id: string, eventData: Partial<Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Event> {
    const { data, error } = await this.supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getPagesByEvent(eventId: string): Promise<Page[]> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getBlocksByPage(pageId: string): Promise<Block[]> {
    const { data, error } = await this.supabase
      .from('blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateBlock(id: string, content: Record<string, any>, sortOrder?: number): Promise<Block> {
    const updateData: Record<string, any> = { content };
    if (sortOrder !== undefined) updateData.sort_order = sortOrder;

    const { data, error } = await this.supabase
      .from('blocks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addBlock(pageId: string, type: string, content: Record<string, any>, sortOrder: number): Promise<Block> {
    const { data, error } = await this.supabase
      .from('blocks')
      .insert({
        page_id: pageId,
        type,
        content,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBlock(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('blocks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
