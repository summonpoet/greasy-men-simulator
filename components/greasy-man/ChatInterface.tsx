'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatType, GreasyManProfile } from '@/types/greasyMan';
import { Send, ChevronLeft, MoreHorizontal, User } from 'lucide-react';

interface ChatInterfaceProps {
  chatType: ChatType;
  profileA?: GreasyManProfile;
  profileB?: GreasyManProfile;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
  godMode?: boolean;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getChatTitle = (chatType: ChatType, profileA?: GreasyManProfile, profileB?: GreasyManProfile): string => {
  switch (chatType) {
    case 'privateA':
      return profileA?.name || '油腻男A';
    case 'privateB':
      return profileB?.name || '油腻男B';
    case 'group':
      return `群聊 (${profileA?.name || 'A'}, ${profileB?.name || 'B'})`;
    default:
      return '聊天';
  }
};

const getSenderName = (senderId: string, profileA?: GreasyManProfile, profileB?: GreasyManProfile): string => {
  switch (senderId) {
    case 'greasyA':
      return profileA?.name || '油腻男A';
    case 'greasyB':
      return profileB?.name || '油腻男B';
    case 'user':
      return '我';
    default:
      return '';
  }
};

export default function ChatInterface({
  chatType,
  profileA,
  profileB,
  messages,
  onSendMessage,
  onBack,
  isLoading,
  godMode = false,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatType]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5]">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#ededed] border-b border-gray-300">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          <div className="flex items-center gap-2">
            {chatType === 'group' ? (
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  {profileA?.name?.[0] || 'A'}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  {profileB?.name?.[0] || 'B'}
                </div>
              </div>
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                ${chatType === 'privateA' 
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                  : 'bg-gradient-to-br from-green-400 to-green-600'
                }`}>
                {chatType === 'privateA' 
                  ? (profileA?.name?.[0] || 'A')
                  : (profileB?.name?.[0] || 'B')
                }
              </div>
            )}
            <span className="font-medium text-gray-900">
              {getChatTitle(chatType, profileA, profileB)}
            </span>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 上帝视角提示 */}
      {godMode && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-4 py-2 text-center">
          👁️ 上帝视角已开启 - 你可以看到油腻男的隐藏信息
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm">还没有消息</p>
            <p className="text-xs mt-1">开始聊天吧~</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isUser = message.senderId === 'user';
            const showTime = index === 0 || 
              message.timestamp - messages[index - 1].timestamp > 5 * 60 * 1000;
            
            const showName = chatType === 'group' && !isUser;

            return (
              <React.Fragment key={message.id}>
                {showTime && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                  {/* 头像 */}
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium
                    ${isUser 
                      ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                      : message.senderId === 'greasyA'
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                        : 'bg-gradient-to-br from-green-400 to-green-600'
                    }`}>
                    {isUser 
                      ? '我' 
                      : (message.senderId === 'greasyA' ? (profileA?.name?.[0] || 'A') : (profileB?.name?.[0] || 'B'))
                    }
                  </div>
                  
                  {/* 消息内容 */}
                  <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    {showName && (
                      <span className="text-xs text-gray-500 mb-1">
                        {getSenderName(message.senderId, profileA, profileB)}
                      </span>
                    )}
                    <div className={`px-4 py-2.5 rounded-lg text-[15px] leading-relaxed break-words
                      ${isUser 
                        ? 'bg-[#95ec69] text-gray-900 rounded-br-sm' 
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                      }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-center py-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框区域 */}
      <div className="bg-[#f7f7f7] border-t border-gray-300 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white rounded-full px-4 py-2 border border-gray-200">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="发送消息..."
              className="w-full bg-transparent outline-none text-[15px] text-gray-900 placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full transition-all duration-200 ${
              inputValue.trim() && !isLoading
                ? 'bg-[#07c160] hover:bg-[#06ad56] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
