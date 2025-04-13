
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Leaf } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <div className={cn(
      "flex items-start gap-2 mb-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {isUser ? (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-8 w-8 bg-green-100">
          <AvatarFallback className="bg-green-100 text-green-700">
            <Leaf className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "py-2 px-3 rounded-lg max-w-[80%]",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-gray-100 text-gray-800"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};
