
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, ChevronDown, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChatMessage } from './ChatMessage';
import { getSuggestedQuestions, generateBotResponse, setApiKey, setApiUrl, setAiModel } from '@/services/chatService';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean; id: string}>>([
    {id: '1', text: "Привет! Я бот BloomHub. Чем могу помочь?", isUser: false}
  ]);
  const [inputValue, setInputValue] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(getSuggestedQuestions());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  
  // Настройки API
  const [apiKey, setApiKeyValue] = useState('');
  const [apiUrl, setApiUrlValue] = useState('https://api.openai.com/v1/chat/completions');
  const [apiModel, setApiModelValue] = useState('gpt-4o-mini');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, {text, isUser: true, id: userMessageId}]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await generateBotResponse(text);
      setMessages(prev => [...prev, {text: response, isUser: false, id: Date.now().toString()}]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      setMessages(prev => [...prev, {
        text: "Извините, произошла ошибка при обработке вашего запроса.", 
        isUser: false,
        id: Date.now().toString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
  };
  
  const handleSaveSettings = () => {
    setApiKey(apiKey);
    setApiUrl(apiUrl);
    setAiModel(apiModel);
    setIsSettingsOpen(false);
    
    // Добавляем системное сообщение о настройке API
    if (apiKey) {
      setMessages(prev => [...prev, {
        text: "API настройки сохранены. Теперь я могу отвечать на ваши вопросы с помощью нейросети.", 
        isUser: false,
        id: Date.now().toString()
      }]);
    }
  };

  const ChatTrigger = (
    <Button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 h-14 w-14 p-0">
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
  
  const SettingsDialog = (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Настройки API нейросети</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API ключ</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKeyValue(e.target.value)}
              placeholder="sk-..." 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiUrl">URL API</Label>
            <Input
              id="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrlValue(e.target.value)}
              placeholder="https://api.openai.com/v1/chat/completions"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiModel">Модель</Label>
            <Input
              id="apiModel"
              value={apiModel}
              onChange={(e) => setApiModelValue(e.target.value)}
              placeholder="gpt-4o-mini"
            />
          </div>
          <Button onClick={handleSaveSettings} className="mt-2">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ChatContent = (
    <div className="flex flex-col h-full">
      <SheetHeader className="border-b p-4">
        <SheetTitle className="flex items-center justify-between">
          <span>Чат с BloomBot</span>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg.text} isUser={msg.isUser} />
        ))}
        {isTyping && (
          <div className="flex items-center text-sm text-gray-500 my-2 ml-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {suggestedQuestions.length > 0 && (
        <div className="p-2 border-t">
          <p className="text-xs text-gray-500 mb-2">Популярные вопросы:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={handleOpen}>
          <DrawerTrigger asChild>
            {ChatTrigger}
          </DrawerTrigger>
          <DrawerContent className="h-[80vh]">
            {ChatContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={isOpen} onOpenChange={handleOpen}>
          <SheetTrigger asChild>
            {ChatTrigger}
          </SheetTrigger>
          <SheetContent className="w-[380px] sm:w-[440px] p-0" side="right">
            {ChatContent}
            {SettingsDialog}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
