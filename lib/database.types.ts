export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      turfs: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string
          city: string
          state: string
          price_per_hour: number
          sport_type: 'cricket' | 'football' | 'badminton' | 'multi'
          amenities: string[]
          images: string[]
          rating: number
          total_reviews: number
          is_active: boolean
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location: string
          city: string
          state: string
          price_per_hour: number
          sport_type: 'cricket' | 'football' | 'badminton' | 'multi'
          amenities?: string[]
          images?: string[]
          rating?: number
          total_reviews?: number
          is_active?: boolean
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string
          city?: string
          state?: string
          price_per_hour?: number
          sport_type?: 'cricket' | 'football' | 'badminton' | 'multi'
          amenities?: string[]
          images?: string[]
          rating?: number
          total_reviews?: number
          is_active?: boolean
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          turf_id: string
          booking_date: string
          start_time: string
          end_time: string
          total_amount: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          turf_id: string
          booking_date: string
          start_time: string
          end_time: string
          total_amount: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          turf_id?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          turf_id: string
          booking_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          turf_id: string
          booking_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          turf_id?: string
          booking_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      sport_type: 'cricket' | 'football' | 'badminton' | 'multi'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    }
  }
}