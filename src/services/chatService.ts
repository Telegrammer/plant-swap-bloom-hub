
import { supabase } from '@/integrations/supabase/client';

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
    // In a real implementation, we would use Supabase Edge Functions or similar
    // For now, we'll simulate a response
    const responses = {
      "Как ухаживать за монстерой?": "Монстера любит яркий рассеянный свет, но не прямые солнечные лучи. Поливайте ее, когда верхний слой почвы подсохнет. Регулярно опрыскивайте листья для поддержания влажности.",
      "Какие растения подходят для темных помещений?": "Для темных помещений хорошо подходят: сансевиерия, замиокулькас, аглаонема, спатифиллум и потос. Они могут выживать при минимальном освещении.",
      "Как часто нужно поливать суккуленты?": "Суккуленты следует поливать только когда почва полностью высохнет. Обычно это раз в 10-14 дней летом и раз в месяц зимой.",
      "Что делать, если желтеют листья?": "Желтеющие листья могут быть признаком переувлажнения, недостатка света или питательных веществ. Проверьте режим полива, освещение и при необходимости внесите удобрения."
    };
    
    // Find a matching response or provide a default
    for (const [question, answer] of Object.entries(responses)) {
      if (message.toLowerCase().includes(question.toLowerCase())) {
        return answer;
      }
    }
    
    return "Извините, я пока не могу ответить на этот вопрос. Попробуйте задать другой вопрос о растениях.";
  } catch (error) {
    console.error('Error generating bot response:', error);
    return "Извините, произошла ошибка при обработке вашего запроса. Попробуйте позже.";
  }
};
