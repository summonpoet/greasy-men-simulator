import { NextResponse } from 'next/server';

export async function GET() {
  // 返回服务器端配置的环境变量（只返回是否配置，不返回敏感信息）
  const config = {
    hasApiKey: !!process.env.GREASY_API_KEY,
    hasApiUrl: !!process.env.GREASY_API_URL,
    apiUrl: process.env.GREASY_API_URL || '',
    model: process.env.GREASY_MODEL || 'gpt-4',
  };

  return NextResponse.json(config);
}
