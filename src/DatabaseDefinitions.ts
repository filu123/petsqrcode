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
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          home_phone: string | null
          mobile_phone: string
          email: string
          country: string
          address: string
          avatar_url: string | null
          updated_at: string | null
          unsubscribed: boolean
          has_completed_onboarding: boolean
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          home_phone?: string | null
          mobile_phone: string
          email: string
          country: string
          address: string
          avatar_url?: string | null
          updated_at?: Date | null
          unsubscribed?: boolean
          has_completed_onboarding?: boolean
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          home_phone?: string | null
          mobile_phone?: string
          email?: string
          country?: string
          address?: string
          avatar_url?: string | null
          updated_at?: Date | null
          unsubscribed?: boolean
          has_completed_onboarding?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pets: {
        Row: {
          id: string
          profile_id: string
          name: string
          second_name: string | null
          date_of_birth: string
          gender: string
          pet_type: string
          temperament: string | null
          food: string | null
          favourite_treats: string | null
          allergies: string | null
          breed: string
          profile_url: string | null
          bio: string | null
          created_at: string
          updated_at: string | null
          avatar_url: string | null  // Add 
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          second_name?: string | null
          date_of_birth: string
          gender: string
          pet_type: string
          temperament?: string | null
          food?: string | null
          favourite_treats?: string | null
          allergies?: string | null
          breed: string
          profile_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null  // Add 
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          second_name?: string | null
          date_of_birth?: string
          gender?: string
          pet_type?: string
          temperament?: string | null
          food?: string | null
          favourite_treats?: string | null
          allergies?: string | null
          breed?: string
          profile_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null  // Add
        }
        Relationships: [
          {
            foreignKeyName: "pets_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      // Keep existing tables (stripe_customers, contact_requests)
      stripe_customers: {
        Row: {
          stripe_customer_id: string
          updated_at: Date | null
          user_id: string
        }
        Insert: {
          stripe_customer_id: string
          updated_at?: Date | null
          user_id: string
        }
        Update: {
          stripe_customer_id?: string
          updated_at?: Date | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_requests: {
        Row: {
          company_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          message_body: string | null
          phone: string | null
          updated_at: Date | null
        }
        Insert: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: Date | null
        }
        Update: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          message_body?: string | null
          phone?: string | null
          updated_at?: Date | null
        }
        Relationships: []
      }
      pet_contacts: {
        Row: {
          id: string
          pet_id: string
          full_name: string
          address: string
          email: string
          phone_number: string
          is_primary: boolean
          is_public: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          pet_id: string
          full_name: string
          address: string
          email: string
          phone_number: string
          is_primary?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          pet_id?: string
          full_name?: string
          address?: string
          email?: string
          phone_number?: string
          is_primary?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_contacts_pet_id_fkey"
            columns: ["pet_id"]
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
      pet_maintenance: {
        Row: {
          id: string
          pet_id: string
          name: string
          frequency: string
          start_date: string
          is_public: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          pet_id: string
          name: string
          frequency: string
          start_date: string
          is_public?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          pet_id?: string
          name?: string
          frequency?: string
          start_date?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_maintenance_pet_id_fkey"
            columns: ["pet_id"]
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
      pet_veterinarian: {
        Row: {
          id: string
          pet_id: string
          country: string
          address: string
          email: string
          phone_number: string
          is_public: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          pet_id: string
          country: string
          address: string
          email: string
          phone_number: string
          is_public?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          pet_id?: string
          country?: string
          address?: string
          email?: string
          phone_number?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_veterinarian_pet_id_fkey"
            columns: ["pet_id"]
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
      account_deletions: {
        Row: {
          id: string
          user_id: string
          reason: string
          deleted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reason: string
          deleted_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reason?: string
          deleted_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_deletions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
