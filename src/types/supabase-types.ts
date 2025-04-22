
import { Database } from '@/integrations/supabase/types';

// Database row types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Plant = Database['public']['Tables']['plants']['Row'];
export type Exchange = Database['public']['Tables']['exchanges']['Row'];
export type ExchangeComposition = Database['public']['Tables']['exchange_compositions']['Row'];

// Enum types
export type ExchangeStatus = Database['public']['Enums']['exchange_status'];
export type PlantSize = Database['public']['Enums']['plant_size'];
export type LightDemand = Database['public']['Enums']['light_demand'];
export type WaterDemand = Database['public']['Enums']['water_demand'];

// Enhanced types with joins
export interface PlantWithOwner extends Plant {
  profiles?: Profile;
}

export interface ExchangeWithDetails extends Exchange {
  sender?: Profile;
  receiver?: Profile;
  plants?: PlantWithExchange[];
}

export interface PlantWithExchange extends Plant {
  exchange_compositions?: ExchangeComposition[];
}
