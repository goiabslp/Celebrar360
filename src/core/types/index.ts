export type UserRole = 'admin' | 'user';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete';
export type SubscriptionPlan = 'free' | 'premium' | 'vip';
export type EventStatus = 'draft' | 'published' | 'finished';
export type RSVPStatus = 'confirmed' | 'declined' | 'pending';
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'refunded';
export type MediaType = 'image' | 'video';
export type GiftType = 'unico' | 'cotas' | 'livre';
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card';

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
  type: string; // 'hero' | 'rsvp_form' | 'gift_list' | 'gallery' | 'map' | 'text' | 'dress_code'
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

export interface GiftCategory {
  id: string;
  event_id: string;
  name: string;
  created_at: string;
}

export interface Gift {
  id: string;
  event_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  gift_type: GiftType;
  total_value: number;
  collected_value: number;
  quota_value: number;
  total_quotas: number;
  sold_quotas: number;
  display_order: number;
  status: 'active' | 'inactive';
  hide_when_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GiftPayment {
  id: string;
  gift_id: string | null;
  guest_id: string | null;
  external_reference: string;
  gateway_payment_id: string | null;
  gateway: string;
  payment_method: PaymentMethod;
  amount: number;
  quotas_purchased: number;
  status: 'pending' | 'approved' | 'cancelled' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface PaymentLog {
  id: string;
  payment_id: string | null;
  payload_received: Record<string, any>;
  gateway_response: Record<string, any>;
  ip_address: string | null;
  status: string | null;
  created_at: string;
}

export interface GalleryMedia {
  id: string;
  event_id: string;
  url: string;
  type: MediaType;
  is_approved: boolean;
  created_at: string;
}
