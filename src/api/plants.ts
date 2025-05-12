import { supabase } from '@/integrations/supabase/client';
import { Plant as SupabasePlant, Profile } from '@/types/supabase-types';

export interface Plant {
  id: string; // Changed from number to string to match Supabase
  name: string;
  description?: string;
  imageUrl: string | null;
  waterDemand: string;
  sunDemand: string;
  size: string;
  isIndoor: boolean;
  types?: string[];
  owner: string;
  ownerName?: string; // Add this property to fix the type error
}

// Helper function to convert Supabase Plant to our Plant interface
const plantToInterface = (plant: SupabasePlant, ownerName?: string): Plant => ({
  id: plant.id,
  name: plant.name,
  description: plant.description || undefined,
  imageUrl: plant.image_url,
  waterDemand: plant.water_demand,
  sunDemand: plant.sun_demand,
  size: plant.size,
  isIndoor: plant.is_indoor || false,
  types: [], // Supabase doesn't have a types field, so defaulting to empty array
  owner: ownerName || '',
});

// Helper function to validate enum values
const validateEnumValue = (value: string, allowedValues: string[]): string => {
  if (allowedValues.includes(value)) {
    return value;
  }
  return allowedValues[1]; // Return default value (medium)
};

export async function getPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from('plants')
    .select(`
      *,
      profiles:owner_id (name)
    `);
  
  if (error) throw error;
  
  return (data || []).map(plant => {
    const owner = plant.profiles as unknown as Profile;
    return plantToInterface(plant, owner?.name);
  });
}

export async function getPlantById(id: string): Promise<Plant> {
  const { data, error } = await supabase
    .from('plants')
    .select(`
      *,
      profiles:owner_id (name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  const owner = data.profiles as unknown as Profile;
  return plantToInterface(data, owner?.name);
}

export async function getUserPlants(userId: string): Promise<Plant[]> {
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .single();

  if (userError) throw userError;
  
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('owner_id', userId);
  
  if (error) throw error;
  
  return (data || []).map(plant => plantToInterface(plant, userData.name));
}

export async function createPlant(plantData: Omit<Plant, 'id' | 'owner'>): Promise<Plant> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Get user name
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single();
  
  if (userError) throw userError;
  
  // Validate enum values to match Supabase's expected types
  const validWaterDemand = validateEnumValue(plantData.waterDemand, ['low', 'medium', 'high']) as 'low' | 'medium' | 'high';
  const validSunDemand = validateEnumValue(plantData.sunDemand, ['low', 'medium', 'high']) as 'low' | 'medium' | 'high';
  const validSize = validateEnumValue(plantData.size, ['small', 'medium', 'large']) as 'small' | 'medium' | 'large';
  
  // Convert our Plant interface to Supabase Plant structure
  const supabasePlantData = {
    name: plantData.name,
    description: plantData.description || null,
    image_url: plantData.imageUrl,
    water_demand: validWaterDemand,
    sun_demand: validSunDemand,
    size: validSize,
    is_indoor: plantData.isIndoor,
    owner_id: user.id
  };
  
  console.log('Sending to Supabase:', supabasePlantData);
  
  const { data, error } = await supabase
    .from('plants')
    .insert(supabasePlantData)
    .select()
    .single();
  
  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  
  return plantToInterface(data, userData.name);
}

export async function updatePlant(id: string, plantData: Partial<Plant>): Promise<Plant> {
  // Validate enum values to match Supabase's expected types
  let validatedData: Partial<SupabasePlant> = {
    name: plantData.name,
    description: plantData.description || null,
    image_url: plantData.imageUrl,
    is_indoor: plantData.isIndoor
  };

  // Only add validated enum values if they exist in the update data
  if (plantData.waterDemand) {
    validatedData.water_demand = validateEnumValue(plantData.waterDemand, ['low', 'medium', 'high']) as 'low' | 'medium' | 'high';
  }

  if (plantData.sunDemand) {
    validatedData.sun_demand = validateEnumValue(plantData.sunDemand, ['low', 'medium', 'high']) as 'low' | 'medium' | 'high';
  }

  if (plantData.size) {
    validatedData.size = validateEnumValue(plantData.size, ['small', 'medium', 'large']) as 'small' | 'medium' | 'large';
  }
  
  const { data, error } = await supabase
    .from('plants')
    .update(validatedData)
    .eq('id', id)
    .select(`
      *,
      profiles:owner_id (name)
    `)
    .single();
  
  if (error) throw error;
  
  const owner = data.profiles as unknown as Profile;
  return plantToInterface(data, owner?.name);
}

export async function deletePlant(id: string): Promise<void> {
  const { error } = await supabase
    .from('plants')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
