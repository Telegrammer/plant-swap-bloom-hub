
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase-types';

export interface User {
  id: string;
  name: string;
  email: string;
  location: string | null;
  bio: string | null;
  dateCreated: string;
  profileImageUrl: string | null;
}

// Helper function to convert Profile to User
const profileToUser = (profile: Profile): User => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  location: profile.location || '',
  bio: profile.bio || '',
  dateCreated: profile.created_at,
  profileImageUrl: profile.profile_image_url || '',
});

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) throw error;
  return (data || []).map(profileToUser);
}

export async function getUserById(id: string): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return profileToUser(data);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) throw error;
  return profileToUser(data);
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  // Convert User structure to Profile structure
  const profileData: Partial<Profile> = {
    name: userData.name,
    email: userData.email,
    location: userData.location || null,
    bio: userData.bio || null,
    profile_image_url: userData.profileImageUrl || null,
  };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return profileToUser(data);
}
