# 油腻男模拟器

体验与两个油腻男"愉快"聊天的感觉。

## 功能特性

- 微信风格聊天界面
- 两个独立油腻男角色（分开的 context window）
- 私聊 + 群聊模式
- 群聊中 A/B 存在竞争关系
- 上帝视角查看角色档案
- 支持多种 AI API 提供商

## 环境变量

在 Vercel 中配置以下环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `GREASY_API_KEY` | AI API Key | `sk-xxxxx` |
| `GREASY_API_URL` | API 端点 | `https://api.openai.com/v1/chat/completions` |
| `GREASY_MODEL` | 模型名称 | `gpt-4` |

## 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
