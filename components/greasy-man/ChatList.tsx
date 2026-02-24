'use client';

import React from 'react';
import { ChatType, GreasyManProfile, Message } from '@/types/greasyMan';
import { Eye, Plus } from 'lucide-react';

interface ChatListProps {
  currentChat: ChatType;
  onSelectChat: (chatType: ChatType) => void;
  profileA?: GreasyManProfile;
  profileB?: GreasyManProfile;
  messagesA: Message[];
  messagesB: Message[];
  messagesGroup: Message[];
  godMode: boolean;
  onToggleGodMode: () => void;
  onGenerateNew: () => void;
  isGenerating: boolean;
}

const formatTime = (timestamp?: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const getLastMessage = (messages: Message[]): string => {
  if (messages.length === 0) return '还没有消息';
  const lastMsg = messages[messages.length - 1];
  const prefix = lastMsg.senderId === 'user' ? '我: ' : '';
  return prefix + lastMsg.content.slice(0, 20) + (lastMsg.content.length > 20 ? '...' : '');
};

export default function ChatList({
  currentChat,
  onSelectChat,
  profileA,
  profileB,
  messagesA,
  messagesB,
  messagesGroup,
  godMode,
  onToggleGodMode,
  onGenerateNew,
  isGenerating,
}: ChatListProps) {
  const chats: { type: ChatType; name: string; messages: Message[]; color: string }[] = [
    { type: 'privateA', name: profileA?.name || '油腻男A', messages: messagesA, color: 'from-blue-400 to-blue-600' },
    { type: 'privateB', name: profileB?.name || '油腻男B', messages: messagesB, color: 'from-green-400 to-green-600' },
    { type: 'group', name: '三人小群', messages: messagesGroup, color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5]">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#ededed] border-b border-gray-300">
        <h1 className="text-lg font-semibold text-gray-900">油腻男模拟器</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={onGenerateNew}
            disabled={isGenerating}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
            title="重新生成角色"
          >
            <Plus className={`w-5 h-5 text-gray-600 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={onToggleGodMode}
            className={`p-2 rounded-full transition-colors ${godMode ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200 text-gray-600'}`}
            title="上帝视角"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 角色信息卡片（仅在上帝模式下显示） */}
      {godMode && (profileA || profileB) && (
        <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <p className="text-xs text-purple-600 font-medium mb-2">👁️ 上帝视角 - 角色档案</p>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {profileA && (
              <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {profileA.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{profileA.name}</p>
                    <p className="text-xs text-gray-500">{profileA.career.title} · {profileA.age}岁</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="text-gray-400">学历:</span> {profileA.education.school} {profileA.education.degree}</p>
                  <p><span className="text-gray-400">收入:</span> {profileA.career.annualIncome}</p>
                  <p><span className="text-gray-400">座驾:</span> {profileA.familyBackground.carBrand}</p>
                  <p><span className="text-gray-400">座右铭:</span> <span className="italic text-purple-600">&ldquo;{profileA.philosophy.lifeMotto}&rdquo;</span></p>
                  <p><span className="text-gray-400">口头禅:</span> {profileA.catchphrases.slice(0, 2).join('、')}</p>
                </div>
              </div>
            )}
            {profileB && (
              <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                    {profileB.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{profileB.name}</p>
                    <p className="text-xs text-gray-500">{profileB.career.title} · {profileB.age}岁</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="text-gray-400">学历:</span> {profileB.education.school} {profileB.education.degree}</p>
                  <p><span className="text-gray-400">收入:</span> {profileB.career.annualIncome}</p>
                  <p><span className="text-gray-400">座驾:</span> {profileB.familyBackground.carBrand}</p>
                  <p><span className="text-gray-400">座右铭:</span> <span className="italic text-purple-600">&ldquo;{profileB.philosophy.lifeMotto}&rdquo;</span></p>
                  <p><span className="text-gray-400">口头禅:</span> {profileB.catchphrases.slice(0, 2).join('、')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 聊天列表 */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const isActive = currentChat === chat.type;
          const unreadCount = chat.messages.filter(m => m.senderId !== 'user').length; // 简化处理
          
          return (
            <button
              key={chat.type}
              onClick={() => onSelectChat(chat.type)}
              className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                isActive ? 'bg-gray-100' : ''
              }`}
            >
              {/* 头像 */}
              {chat.type === 'group' ? (
                <div className="relative">
                  <div className="flex -space-x-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium border-2 border-white">
                      {profileA?.name?.[0] || 'A'}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-medium border-2 border-white">
                      {profileB?.name?.[0] || 'B'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${chat.color} flex items-center justify-center text-white font-medium`}>
                  {chat.name[0]}
                </div>
              )}

              {/* 信息 */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                  {chat.messages.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {formatTime(chat.messages[chat.messages.length - 1]?.timestamp)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {getLastMessage(chat.messages)}
                </p>
              </div>

              {/* 未读数 */}
              {unreadCount > 0 && (
                <div className="min-w-[20px] h-5 px-1.5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{unreadCount > 99 ? '99+' : unreadCount}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div className="px-4 py-3 bg-[#ededed] border-t border-gray-300">
        <p className="text-xs text-gray-500 text-center">
          点击 👁️ 开启上帝视角查看角色档案
        </p>
      </div>
    </div>
  );
}
