import { NextRequest, NextResponse } from 'next/server';
import { GENERATE_GREASY_MAN_PROMPT, GreasyManProfile } from '@/types/greasyMan';

export async function POST(req: NextRequest) {
  try {
    // 优先从请求体获取配置，否则使用环境变量
    const body = await req.json();
    const apiKey = body.apiKey || process.env.GREASY_API_KEY;
    const apiUrl = body.apiUrl || process.env.GREASY_API_URL;
    const model = body.model || process.env.GREASY_MODEL || 'gpt-4';

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: '缺少API配置，请在环境变量或前端配置中设置' },
        { status: 400 }
      );
    }

    // 调用用户提供的API生成油腻男角色
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个角色设定生成器，专门生成有趣的虚拟角色。请严格按照JSON格式返回，不要包含任何其他文字。'
          },
          {
            role: 'user',
            content: GENERATE_GREASY_MAN_PROMPT
          }
        ],
        temperature: 0.9,
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

    // 解析JSON响应
    let profile: GreasyManProfile;
    try {
      // 尝试提取JSON内容（处理可能的markdown代码块）
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                        content.match(/```\n?([\s\S]*?)\n?```/) ||
                        [null, content];
      const jsonStr = jsonMatch[1] || content;
      const parsed = JSON.parse(jsonStr.trim());
      
      profile = {
        id: `greasy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...parsed,
      };
    } catch (e) {
      console.error('JSON解析失败:', content);
      return NextResponse.json(
        { error: '角色生成失败，无法解析返回数据' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('生成角色失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
