import { NextRequest, NextResponse } from 'next/server';
import { GREASY_MAN_SYSTEM_PROMPT, Message, GreasyManProfile } from '@/types/greasyMan';

interface ChatRequest {
  apiKey?: string;
  apiUrl?: string;
  model?: string;
  profile: GreasyManProfile;
  otherProfile?: GreasyManProfile;
  messages: Message[];
  chatType: 'private' | 'group';
  senderType: 'greasyA' | 'greasyB';
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    
    // 优先从请求体获取配置，否则使用环境变量
    const apiKey = body.apiKey || process.env.GREASY_API_KEY;
    const apiUrl = body.apiUrl || process.env.GREASY_API_URL;
    const model = body.model || process.env.GREASY_MODEL || 'gpt-4';
    const { profile, otherProfile, messages, chatType, senderType } = body;

    if (!apiKey || !apiUrl || !profile) {
      return NextResponse.json(
        { error: '缺少必要参数，请在环境变量或前端配置中设置API' },
        { status: 400 }
      );
    }

    // 构建系统提示词
    const systemPrompt = GREASY_MAN_SYSTEM_PROMPT(profile, chatType, otherProfile);

    // 转换消息格式
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.senderId === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    ];

    // 调用API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        temperature: 0.85,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `API调用失败: ${error}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'API返回数据格式错误' },
        { status: 500 }
      );
    }

    // 创建新消息
    const newMessage: Message = {
      id: `${senderType}_${Date.now()}`,
      senderId: senderType,
      content: content.trim(),
      timestamp: Date.now(),
      type: 'text',
    };

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('聊天API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
