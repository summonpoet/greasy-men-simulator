'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Message, ChatType, GreasyManProfile } from '@/types/greasyMan';
import ChatInterface from '@/components/greasy-man/ChatInterface';
import ChatList from '@/components/greasy-man/ChatList';
import ApiConfig, { ApiConfigData } from '@/components/greasy-man/ApiConfig';
import GodModeModal from '@/components/greasy-man/GodModeModal';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// 默认API配置
const DEFAULT_API_CONFIG: ApiConfigData = {
  apiKey: '',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4',
};

export default function GreasyManPage() {
  // API配置
  const [apiConfig, setApiConfig] = useState<ApiConfigData>(DEFAULT_API_CONFIG);
  
  // 角色档案
  const [profileA, setProfileA] = useState<GreasyManProfile | undefined>();
  const [profileB, setProfileB] = useState<GreasyManProfile | undefined>();
  
  // 聊天记录
  const [messagesA, setMessagesA] = useState<Message[]>([]);
  const [messagesB, setMessagesB] = useState<Message[]>([]);
  const [messagesGroup, setMessagesGroup] = useState<Message[]>([]);
  
  // 当前聊天
  const [currentChat, setCurrentChat] = useState<ChatType>('group');
  
  // 状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [godMode, setGodMode] = useState(false);
  const [showGodModal, setShowGodModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 加载保存的数据
  useEffect(() => {
    const savedProfileA = localStorage.getItem('greasyProfileA');
    const savedProfileB = localStorage.getItem('greasyProfileB');
    const savedMessagesA = localStorage.getItem('greasyMessagesA');
    const savedMessagesB = localStorage.getItem('greasyMessagesB');
    const savedMessagesGroup = localStorage.getItem('greasyMessagesGroup');
    
    if (savedProfileA) setProfileA(JSON.parse(savedProfileA));
    if (savedProfileB) setProfileB(JSON.parse(savedProfileB));
    if (savedMessagesA) setMessagesA(JSON.parse(savedMessagesA));
    if (savedMessagesB) setMessagesB(JSON.parse(savedMessagesB));
    if (savedMessagesGroup) setMessagesGroup(JSON.parse(savedMessagesGroup));
    
    setIsInitialized(true);
  }, []);

  // 保存数据
  useEffect(() => {
    if (!isInitialized) return;
    
    if (profileA) localStorage.setItem('greasyProfileA', JSON.stringify(profileA));
    if (profileB) localStorage.setItem('greasyProfileB', JSON.stringify(profileB));
    localStorage.setItem('greasyMessagesA', JSON.stringify(messagesA));
    localStorage.setItem('greasyMessagesB', JSON.stringify(messagesB));
    localStorage.setItem('greasyMessagesGroup', JSON.stringify(messagesGroup));
  }, [profileA, profileB, messagesA, messagesB, messagesGroup, isInitialized]);

  // 生成新角色
  const generateCharacters = useCallback(async () => {
    if (!apiConfig.apiKey || !apiConfig.apiUrl) {
      setError('请先配置API信息');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 生成角色A
      const resA = await fetch('/api/greasy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiConfig),
      });
      
      if (!resA.ok) throw new Error('生成角色A失败');
      const dataA = await resA.json();
      setProfileA(dataA.profile);

      // 生成角色B
      const resB = await fetch('/api/greasy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiConfig),
      });
      
      if (!resB.ok) throw new Error('生成角色B失败');
      const dataB = await resB.json();
      setProfileB(dataB.profile);

      // 清空聊天记录
      setMessagesA([]);
      setMessagesB([]);
      setMessagesGroup([]);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '生成角色失败');
    } finally {
      setIsGenerating(false);
    }
  }, [apiConfig]);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!apiConfig.apiKey || !apiConfig.apiUrl) {
      setError('请先配置API信息');
      return;
    }

    if (!profileA || !profileB) {
      setError('角色尚未生成');
      return;
    }

    // 创建用户消息
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      senderId: 'user',
      content,
      timestamp: Date.now(),
      type: 'text',
    };

    // 更新对应聊天记录
    let currentMessages: Message[];
    if (currentChat === 'privateA') {
      currentMessages = [...messagesA, userMessage];
      setMessagesA(currentMessages);
    } else if (currentChat === 'privateB') {
      currentMessages = [...messagesB, userMessage];
      setMessagesB(currentMessages);
    } else {
      currentMessages = [...messagesGroup, userMessage];
      setMessagesGroup(currentMessages);
    }

    setIsLoading(true);
    setError(null);

    try {
      // 根据聊天类型决定谁回复
      if (currentChat === 'privateA') {
        // 私聊A，只有A回复
        const res = await fetch('/api/greasy/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...apiConfig,
            profile: profileA,
            messages: currentMessages,
            chatType: 'private',
            senderType: 'greasyA',
          }),
        });
        
        if (!res.ok) throw new Error('获取回复失败');
        const data = await res.json();
        setMessagesA(prev => [...prev, data.message]);
        
      } else if (currentChat === 'privateB') {
        // 私聊B，只有B回复
        const res = await fetch('/api/greasy/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...apiConfig,
            profile: profileB,
            messages: currentMessages,
            chatType: 'private',
            senderType: 'greasyB',
          }),
        });
        
        if (!res.ok) throw new Error('获取回复失败');
        const data = await res.json();
        setMessagesB(prev => [...prev, data.message]);
        
      } else {
        // 群聊，A和B都回复（竞争关系）
        // 先让A回复
        const resA = await fetch('/api/greasy/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...apiConfig,
            profile: profileA,
            otherProfile: profileB,
            messages: currentMessages,
            chatType: 'group',
            senderType: 'greasyA',
          }),
        });
        
        if (!resA.ok) throw new Error('获取回复失败');
        const dataA = await resA.json();
        
        // 更新消息列表（包含A的回复）
        const messagesWithA = [...currentMessages, dataA.message];
        setMessagesGroup(messagesWithA);
        
        // 延迟后让B回复（模拟竞争）
        setTimeout(async () => {
          try {
            const resB = await fetch('/api/greasy/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...apiConfig,
                profile: profileB,
                otherProfile: profileA,
                messages: messagesWithA,
                chatType: 'group',
                senderType: 'greasyB',
              }),
            });
            
            if (!resB.ok) throw new Error('获取回复失败');
            const dataB = await resB.json();
            setMessagesGroup(prev => [...prev, dataB.message]);
          } catch (err: any) {
            console.error('B回复失败:', err);
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || '发送消息失败');
    } finally {
      setIsLoading(false);
    }
  }, [apiConfig, currentChat, profileA, profileB, messagesA, messagesB, messagesGroup]);

  // 获取当前聊天的消息
  const getCurrentMessages = () => {
    switch (currentChat) {
      case 'privateA': return messagesA;
      case 'privateB': return messagesB;
      case 'group': return messagesGroup;
      default: return [];
    }
  };

  // 如果没有角色，显示初始界面
  if (!profileA || !profileB) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl">
              🍷
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">油腻男模拟器</h1>
            <p className="text-gray-600">体验与两个油腻男&quot;愉快&quot;聊天的感觉</p>
          </div>

          <ApiConfig config={apiConfig} onConfigChange={setApiConfig} />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={generateCharacters}
            disabled={isGenerating || !apiConfig.apiKey}
            className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在熬油...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                生成油腻男
              </>
            )}
          </button>

          <p className="mt-4 text-xs text-gray-400 text-center">
            点击按钮生成两个随机的油腻男角色<br/>
            他们会陪你聊天，记得开启上帝视角查看他们的真面目
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* 左侧聊天列表 */}
      <div className="w-full max-w-sm h-full border-r border-gray-300 flex flex-col">
        <ApiConfig config={apiConfig} onConfigChange={setApiConfig} />
        <div className="flex-1 overflow-hidden">
          <ChatList
            currentChat={currentChat}
            onSelectChat={setCurrentChat}
            profileA={profileA}
            profileB={profileB}
            messagesA={messagesA}
            messagesB={messagesB}
            messagesGroup={messagesGroup}
            godMode={godMode}
            onToggleGodMode={() => {
              setGodMode(!godMode);
              if (!godMode) setShowGodModal(true);
            }}
            onGenerateNew={generateCharacters}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* 右侧聊天界面 */}
      <div className="flex-1 h-full">
        <ChatInterface
          chatType={currentChat}
          profileA={profileA}
          profileB={profileB}
          messages={getCurrentMessages()}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          godMode={godMode}
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="fixed top-4 right-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg flex items-center gap-2 text-red-600 z-50">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* 上帝视角弹窗 */}
      <GodModeModal
        profileA={profileA}
        profileB={profileB}
        isOpen={showGodModal}
        onClose={() => setShowGodModal(false)}
      />
    </div>
  );
}
