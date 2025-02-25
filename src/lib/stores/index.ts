import { writable, derived, type Writable, type Readable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../../DatabaseDefinitions';

// Define store types
export type Pet = Database['public']['Tables']['pets']['Row'];
export type PetWithRelations = Pet & {
  pet_contacts?: Database['public']['Tables']['pet_contacts']['Row'][];
  pet_maintenance?: Database['public']['Tables']['pet_maintenance']['Row'][];
  pet_veterinarian?: Database['public']['Tables']['pet_veterinarian']['Row'][];
};
export type Profile = Database['public']['Tables']['profiles']['Row'];

// QR code type definition
export interface QRCode {
  id: string;
  code: string;
  pet_id?: string;
  is_active: boolean;
  created_at: string;
  linked_at?: string;
}