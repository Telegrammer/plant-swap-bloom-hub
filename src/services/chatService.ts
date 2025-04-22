
import { get, post } from '@/api/client';

interface BotMessage {
  text: string;
  isUser: boolean;
}

export const getSuggestedQuestions = (): string[] => {
  return [
    "Как ухаживать за монстерой?",
    "Какие растения подходят для темных помещений?",
    "Как часто нужно поливать суккуленты?",
    "Что делать, если желтеют листья?",
  ];
};

export const generateBotResponse = async (message: string): Promise<string> => {
  try {
    const response = await post<{ response: string }>('/chat/generate', { message });
    return response.response;
  } catch (error) {
    console.error('Error generating bot response:', error);
    return "Извините, произошла ошибка при обработке вашего запроса. Попробуйте позже.";
  }
};

