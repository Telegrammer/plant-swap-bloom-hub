
import { supabase } from '@/integrations/supabase/client';
import { Exchange as SupabaseExchange, Profile, Plant as SupabasePlant, ExchangeStatus } from '@/types/supabase-types';
import { Exchange } from '@/types/exchange';
import { Plant } from './plants';

// Helper function to convert Supabase exchange to our format
const exchangeToInterface = async (exchange: SupabaseExchange, senderName?: string, receiverName?: string): Promise<Exchange> => {
  // Get sender plants
  const { data: senderPlants, error: senderError } = await supabase
    .from('exchange_compositions')
    .select(`
      plants!plant_id (
        *,
        profiles:owner_id (name)
      )
    `)
    .eq('exchange_id', exchange.id)
    .eq('direction', 'sent');

  if (senderError) throw senderError;
  
  // Get receiver plants
  const { data: receiverPlants, error: receiverError } = await supabase
    .from('exchange_compositions')
    .select(`
      plants!plant_id (
        *,
        profiles:owner_id (name)
      )
    `)
    .eq('exchange_id', exchange.id)
    .eq('direction', 'received');
    
  if (receiverError) throw receiverError;
  
  // Convert plants to our interface
  const convertedSenderPlants = senderPlants.map(item => {
    const plant = item.plants as unknown as SupabasePlant & { profiles: Profile };
    return {
      id: plant.id,
      name: plant.name,
      imageUrl: plant.image_url,
      direction: 'sent' as const
    };
  });
  
  const convertedReceiverPlants = receiverPlants.map(item => {
    const plant = item.plants as unknown as SupabasePlant & { profiles: Profile };
    return {
      id: plant.id,
      name: plant.name,
      imageUrl: plant.image_url,
      direction: 'received' as const
    };
  });
  
  return {
    id: exchange.id,
    senderId: exchange.sender_id,
    senderName: senderName || '',
    receiverId: exchange.receiver_id,
    receiverName: receiverName || '',
    status: exchange.status,
    startDate: exchange.start_date,
    endDate: exchange.end_date || null,
    senderPlants: convertedSenderPlants,
    receiverPlants: convertedReceiverPlants
  };
};

export async function getExchanges(): Promise<Exchange[]> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Get exchanges where user is sender or receiver
  const { data, error } = await supabase
    .from('exchanges')
    .select(`
      *,
      sender:sender_id (name),
      receiver:receiver_id (name)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
  
  if (error) throw error;
  
  // Convert each exchange
  const exchanges = await Promise.all(data.map(async (item) => {
    const sender = item.sender as unknown as Profile;
    const receiver = item.receiver as unknown as Profile;
    return await exchangeToInterface(item, sender?.name, receiver?.name);
  }));
  
  return exchanges;
}

export async function getExchangeById(id: string): Promise<Exchange> {
  const { data, error } = await supabase
    .from('exchanges')
    .select(`
      *,
      sender:sender_id (name),
      receiver:receiver_id (name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  const sender = data.sender as unknown as Profile;
  const receiver = data.receiver as unknown as Profile;
  return await exchangeToInterface(data, sender?.name, receiver?.name);
}

export async function createExchange(exchangeData: Omit<Exchange, 'id'>): Promise<Exchange> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Create the exchange
  const exchangeInsert = {
    sender_id: user.id,
    receiver_id: exchangeData.receiverId,
    status: exchangeData.status as ExchangeStatus,
    start_date: exchangeData.startDate,
    end_date: exchangeData.endDate || null
  };
  
  const { data: exchangeData_, error: exchangeError } = await supabase
    .from('exchanges')
    .insert([exchangeInsert])
    .select()
    .single();
  
  if (exchangeError) throw exchangeError;
  
  // Add sender plants to exchange
  const senderPlantPromises = exchangeData.senderPlants.map(plant => {
    return supabase
      .from('exchange_compositions')
      .insert({
        plant_id: plant.id,
        exchange_id: exchangeData_.id,
        direction: 'sent'
      });
  });
  
  // Add receiver plants to exchange
  const receiverPlantPromises = exchangeData.receiverPlants.map(plant => {
    return supabase
      .from('exchange_compositions')
      .insert({
        plant_id: plant.id,
        exchange_id: exchangeData_.id,
        direction: 'received'
      });
  });
  
  await Promise.all([...senderPlantPromises, ...receiverPlantPromises]);
  
  // Get the created exchange with all details
  return await getExchangeById(exchangeData_.id);
}

export async function updateExchange(id: string, exchangeData: Partial<Exchange>): Promise<Exchange> {
  const updateData: Partial<SupabaseExchange> = {};
  
  if (exchangeData.status) {
    updateData.status = exchangeData.status as ExchangeStatus;
  }
  
  if (exchangeData.endDate) {
    updateData.end_date = exchangeData.endDate;
  }
  
  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('exchanges')
      .update(updateData)
      .eq('id', id);
      
    if (error) throw error;
  }
  
  // Handle plant changes if present
  if (exchangeData.senderPlants) {
    // Delete existing sender plants
    await supabase
      .from('exchange_compositions')
      .delete()
      .eq('exchange_id', id)
      .eq('direction', 'sent');
      
    // Insert new sender plants
    const senderPlantPromises = exchangeData.senderPlants.map(plant => {
      return supabase
        .from('exchange_compositions')
        .insert({
          plant_id: plant.id,
          exchange_id: id,
          direction: 'sent'
        });
    });
    
    await Promise.all(senderPlantPromises);
  }
  
  if (exchangeData.receiverPlants) {
    // Delete existing receiver plants
    await supabase
      .from('exchange_compositions')
      .delete()
      .eq('exchange_id', id)
      .eq('direction', 'received');
      
    // Insert new receiver plants
    const receiverPlantPromises = exchangeData.receiverPlants.map(plant => {
      return supabase
        .from('exchange_compositions')
        .insert({
          plant_id: plant.id,
          exchange_id: id,
          direction: 'received'
        });
    });
    
    await Promise.all(receiverPlantPromises);
  }
  
  // Get the updated exchange with all details
  return await getExchangeById(id);
}

export async function deleteExchange(id: string): Promise<void> {
  // Delete the exchange (cascade will handle compositions)
  const { error } = await supabase
    .from('exchanges')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function updateExchangeStatus(id: string, status: 'pending' | 'completed' | 'canceled'): Promise<Exchange> {
  const { error } = await supabase
    .from('exchanges')
    .update({ status })
    .eq('id', id);
  
  if (error) throw error;
  
  return await getExchangeById(id);
}
