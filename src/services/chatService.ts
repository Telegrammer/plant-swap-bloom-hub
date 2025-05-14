
import { supabase } from '@/integrations/supabase/client';

interface BotMessage {
  text: string;
  isUser: boolean;
}

// Здесь можно указать ключ API для OpenAI или другой модели
// В реальном приложении лучше хранить в переменных окружения или в Supabase
let AI_API_KEY = '';
let AI_API_URL = 'https://api.openai.com/v1/chat/completions';
let AI_MODEL = 'gpt-4o-mini'; // Модель по умолчанию

export const setApiKey = (key: string) => {
  AI_API_KEY = key;
};

export const setApiUrl = (url: string) => {
  AI_API_URL = url;
};

export const setAiModel = (model: string) => {
  AI_MODEL = model;
};

export const getSuggestedQuestions = (): string[] => {
  return [
    "Как ухаживать за монстерой?",
    "Какие растения подходят для темных помещений?",
    "Как часто нужно поливать суккуленты?",
    "Что делать, если желтеют листья?",
  ];
};

// Функция для запроса к API ИИ
async function requestAiResponse(message: string): Promise<string> {
  try {
    if (!AI_API_KEY) {
      console.log('API ключ не указан');
      return "Пожалуйста, укажите API ключ для взаимодействия с ИИ.";
    }

    // Настройка запроса для OpenAI
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Ты - помощник по комнатным растениям. Давай краткие, но полезные советы по уходу за растениями. Отвечай только на вопросы, связанные с растениями. На другие темы говори, что ты специализируешься только на растениях.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Ошибка API:', error);
      return "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Ошибка при запросе к API:', error);
    return "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.";
  }
}

// Функция для получения ответа от бота с проверкой на заранее определенные ответы
export const generateBotResponse = async (message: string): Promise<string> => {
  try {
    // Проверка на предопределенные ответы
    const predefinedResponses = {
      "Как ухаживать за монстерой?": "Монстера любит яркий рассеянный свет, но не прямые солнечные лучи. Поливайте ее, когда верхний слой почвы подсохнет. Регулярно опрыскивайте листья для поддержания влажности.",
      "Какие растения подходят для темных помещений?": "Для темных помещений хорошо подходят: сансевиерия, замиокулькас, аглаонема, спатифиллум и потос. Они могут выживать при минимальном освещении.",
      "Как часто нужно поливать суккуленты?": "Суккуленты следует поливать только когда почва полностью высохнет. Обычно это раз в 10-14 дней летом и раз в месяц зимой.",
      "Что делать, если желтеют листья?": "Желтеющие листья могут быть признаком переувлажнения, недостатка света или питательных веществ. Проверьте режим полива, освещение и при необходимости внесите удобрения."
    };
    
    // Проверяем, есть ли предопределенный ответ
    for (const [question, answer] of Object.entries(predefinedResponses)) {
      if (message.toLowerCase().includes(question.toLowerCase())) {
        return answer;
      }
    }
    
    // Если нет предопределенного ответа и API ключ указан, используем API ИИ
    if (AI_API_KEY) {
      return await requestAiResponse(message);
    }
    
    // Если API ключ не указан, возвращаем сообщение
    return "Извините, я пока не могу ответить на этот вопрос. Попробуйте задать другой вопрос о растениях или настройте интеграцию с API.";
  } catch (error) {
    console.error('Ошибка генерации ответа бота:', error);
    return "Извините, произошла ошибка при обработке вашего запроса. Попробуйте позже.";
  }
};
