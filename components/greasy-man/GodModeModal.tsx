'use client';

import React from 'react';
import { GreasyManProfile } from '@/types/greasyMan';
import { X, GraduationCap, Briefcase, Home, Lightbulb, Quote, Heart } from 'lucide-react';

interface GodModeModalProps {
  profileA?: GreasyManProfile;
  profileB?: GreasyManProfile;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileCard: React.FC<{ profile: GreasyManProfile; colorClass: string }> = ({ profile, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 头部 */}
      <div className={`${colorClass} px-6 py-4`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl font-bold">
            {profile.name[0]}
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-white/80 text-sm">{profile.age}岁 · {profile.career.title}</p>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-6 space-y-6">
        {/* 教育背景 */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">教育背景</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{profile.education.school}</span>
              <span className="text-gray-500"> · {profile.education.degree}</span>
            </p>
            <p className="text-sm text-gray-600">专业: {profile.education.major}</p>
            {profile.education.studyAbroad && (
              <p className="text-sm text-blue-600">🌍 {profile.education.studyAbroad}</p>
            )}
          </div>
        </div>

        {/* 职业 */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">职业发展</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="text-sm text-gray-900 font-medium">{profile.career.title}</p>
            <p className="text-sm text-gray-600">{profile.career.company}</p>
            <p className="text-sm text-gray-600">行业: {profile.career.industry}</p>
            <p className="text-sm text-green-600 font-medium">💰 {profile.career.annualIncome}</p>
            <p className="text-sm text-gray-500">下属 {profile.career.subordinates} 人</p>
          </div>
        </div>

        {/* 家庭背景 */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Home className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">家庭背景</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="text-sm text-gray-600">父亲: {profile.familyBackground.fatherOccupation}</p>
            <p className="text-sm text-gray-600">母亲: {profile.familyBackground.motherOccupation}</p>
            <p className="text-sm text-gray-600">{profile.familyBackground.familyStatus}</p>
            <p className="text-sm text-gray-900 font-medium">
              房产: {profile.familyBackground.propertyCount}套 · 座驾: {profile.familyBackground.carBrand}
            </p>
          </div>
        </div>

        {/* 人生哲学 */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">人生哲学</span>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 space-y-2">
            <p className="text-sm">
              <span className="text-gray-500">座右铭:</span>
              <span className="text-purple-700 font-medium italic ml-1">&ldquo;{profile.philosophy.lifeMotto}&rdquo;</span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-gray-500">成功秘诀:</span> {profile.philosophy.successSecret}
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-gray-500">世界观:</span> {profile.philosophy.worldview}
            </p>
          </div>
        </div>

        {/* 口头禅 */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Quote className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">口头禅</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.catchphrases.map((phrase, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
              >
                「{phrase}」
              </span>
            ))}
          </div>
        </div>

        {/* 爱好 */}
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">爱好</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>

        {/* 性格标签 */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {profile.personalityTraits.map((trait, i) => (
              <span 
                key={i}
                className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-100"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GodModeModal({ profileA, profileB, isOpen, onClose }: GodModeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">👁️ 上帝视角</h1>
          <p className="text-white/80">查看油腻男的完整档案</p>
        </div>

        {/* 角色卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          {profileA && (
            <ProfileCard profile={profileA} colorClass="bg-gradient-to-br from-blue-500 to-blue-700" />
          )}
          {profileB && (
            <ProfileCard profile={profileB} colorClass="bg-gradient-to-br from-green-500 to-green-700" />
          )}
        </div>
      </div>
    </div>
  );
}
