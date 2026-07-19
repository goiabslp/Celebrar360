export type UserRole = 'admin' | 'user';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete';
export type SubscriptionPlan = 'free' | 'premium' | 'vip';
export type EventStatus = 'draft' | 'published' | 'finished';
export type RSVPStatus = 'confirmed' | 'declined' | 'pending';
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'refunded';
export type MediaType = 'image' | 'video';

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: SubscriptionPlan;
  status: SubscriptionStatus;
  mp_subscription_id: string | null;
  mp_preapproval_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string;
  slug: string;
  location_name: string | null;
  location_address: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
  status: EventStatus;
  custom_domain: string | null;
  theme_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  event_id: string;
  title: string;
  slug: string;
  is_published: boolean;
  layout: string;
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  page_id: string;
  type: string; // 'hero' | 'rsvp_form' | 'gift_list' | 'gallery' | 'map' | 'text'
  content: Record<string, any>;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RSVP {
  id: string;
  event_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: RSVPStatus;
  guests_count: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Gift {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_purchased: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  event_id: string;
  gift_id: string | null;
  payer_name: string;
  payer_email: string;
  payer_message: string | null;
  amount: number;
  fee_amount: number;
  net_amount: number;
  status: TransactionStatus;
  mp_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryMedia {
  id: string;
  event_id: string;
  url: string;
  type: MediaType;
  is_approved: boolean;
  created_at: string;
}
