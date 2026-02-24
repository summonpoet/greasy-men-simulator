'use client';

import React, { useState, useEffect } from 'react';
import { Settings, ChevronDown, ChevronUp, Key, Link2, Bot } from 'lucide-react';

export interface ApiConfigData {
  apiKey: string;
  apiUrl: string;
  model: string;
}

interface ApiConfigProps {
  config: ApiConfigData;
  onConfigChange: (config: ApiConfigData) => void;
}

const PRESET_MODELS = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'custom', label: '自定义模型' },
];

export default function ApiConfig({ config, onConfigChange }: ApiConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localConfig, setLocalConfig] = useState<ApiConfigData>(config);

  useEffect(() => {
    // 从localStorage加载配置
    const saved = localStorage.getItem('greasyManApiConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocalConfig(parsed);
        // 使用setTimeout避免在effect中同步调用setState
        setTimeout(() => onConfigChange(parsed), 0);
      } catch {
        console.error('加载API配置失败');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    localStorage.setItem('greasyManApiConfig', JSON.stringify(localConfig));
    onConfigChange(localConfig);
    setIsExpanded(false);
  };

  const isConfigured = config.apiKey && config.apiUrl;

  return (
    <div className="bg-white border-b border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className={`w-5 h-5 ${isConfigured ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-sm font-medium text-gray-700">API 配置</span>
          {isConfigured && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              已配置
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Link2 className="w-4 h-4" />
              API 地址
            </label>
            <input
              type="text"
              value={localConfig.apiUrl}
              onChange={(e) => setLocalConfig({ ...localConfig, apiUrl: e.target.value })}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              支持 OpenAI 格式或兼容的 API 端点
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Key className="w-4 h-4" />
              API Key
            </label>
            <input
              type="password"
              value={localConfig.apiKey}
              onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Bot className="w-4 h-4" />
              模型
            </label>
            <select
              value={localConfig.model}
              onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PRESET_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            保存配置
          </button>
        </div>
      )}
    </div>
  );
}
