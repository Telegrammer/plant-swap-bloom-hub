
// Preset questions and answers
const presetQA: Record<string, string> = {
  "Как обменять растение?": "Чтобы обменять растение, перейдите в раздел \"Обмены\" и создайте новый обмен, выбрав свое растение и указав, какое растение вы хотели бы получить взамен.",
  "Как ухаживать за суккулентами?": "Суккуленты нуждаются в минимальном уходе. Поливайте их только когда почва полностью высохнет. Они любят солнечный свет, но могут получить ожоги при прямых солнечных лучах. Используйте хорошо дренированную почву.",
  "Почему желтеют листья у моих растений?": "Пожелтение листьев может быть вызвано несколькими причинами: переполив, недостаток света, нехватка питательных веществ или вредители. Проверьте условия содержания вашего растения и скорректируйте уход.",
  "Что делать, если на растении появились вредители?": "При обнаружении вредителей, изолируйте растение от других. Обработайте его мыльным раствором или специальным инсектицидом. Регулярно осматривайте листья и стебли на наличие вредителей.",
  "Как добавить новое растение?": "Чтобы добавить новое растение, перейдите в свой профиль и нажмите кнопку \"Добавить растение\". Заполните информацию о растении и загрузите фотографию.",
};

export const getSuggestedQuestions = (): string[] => {
  return Object.keys(presetQA);
};

export const generateBotResponse = async (question: string): Promise<string> => {
  // Check if we have a preset answer for this question
  const exactMatch = presetQA[question];
  if (exactMatch) {
    // Simulate network delay for a more natural feel
    await new Promise(resolve => setTimeout(resolve, 500));
    return exactMatch;
  }

  // For similar questions, check if the question includes any of our keywords
  for (const [key, value] of Object.entries(presetQA)) {
    if (question.toLowerCase().includes(key.toLowerCase().split(' ')[1])) {
      await new Promise(resolve => setTimeout(resolve, 700));
      return value;
    }
  }

  // For other questions, generate a response
  // In a real app, this would call an AI service API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple fallback responses
  const fallbackResponses = [
    "Спасибо за ваш вопрос! В настоящее время я могу отвечать только на основные вопросы о растениях и функциях BloomHub. Скоро я стану умнее!",
    "Интересный вопрос! В будущих обновлениях я смогу отвечать на более сложные вопросы о растениях.",
    "Я только учусь, поэтому пока не могу ответить на этот вопрос. Попробуйте спросить о базовом уходе за растениями или функциях нашего сервиса.",
    "В настоящее время я могу помочь вам с основными вопросами об обмене растениями и базовом уходе. Для более детальной информации, возможно, стоит обратиться к сообществу любителей растений.",
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};
