import { SupabaseClient } from '@supabase/supabase-js';
import { RSVP, RSVPStatus } from '../types';

export class RSVPService {
  constructor(private supabase: SupabaseClient) {}

  async getRSVPsByEvent(eventId: string): Promise<RSVP[]> {
    const { data, error } = await this.supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createRSVP(rsvpData: Omit<RSVP, 'id' | 'created_at' | 'updated_at'>): Promise<RSVP> {
    const { data, error } = await this.supabase
      .from('rsvps')
      .insert(rsvpData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRSVPStatus(id: string, status: RSVPStatus): Promise<RSVP> {
    const { data, error } = await this.supabase
      .from('rsvps')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteRSVP(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('rsvps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getRSVPAnalytics(eventId: string) {
    const rsvps = await this.getRSVPsByEvent(eventId);
    
    let confirmedCount = 0;
    let declinedCount = 0;
    let pendingCount = 0;
    let totalGuests = 0;

    rsvps.forEach((rsvp) => {
      if (rsvp.status === 'confirmed') {
        confirmedCount++;
        totalGuests += rsvp.guests_count;
      } else if (rsvp.status === 'declined') {
        declinedCount++;
      } else {
        pendingCount++;
      }
    });

    return {
      totalRSVPs: rsvps.length,
      confirmedCount,
      declinedCount,
      pendingCount,
      totalGuestsConfirmed: totalGuests,
    };
  }
}
