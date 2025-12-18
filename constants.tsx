
import React from 'react';
import { Trash2, Wind, Droplets, BookOpen, Layout, Sparkles } from 'lucide-react';

export const DEFAULT_ROLES = [
  { name: '칠판 지우기', icon: <Layout className="w-5 h-5" /> },
  { name: '바닥 쓸기', icon: <Trash2 className="w-5 h-5" /> },
  { name: '창틀 닦기', icon: <Wind className="w-5 h-5" /> },
  { name: '분리수거', icon: <Droplets className="w-5 h-5" /> },
  { name: '책상 정돈', icon: <BookOpen className="w-5 h-5" /> },
  { name: '사물함 정리', icon: <Sparkles className="w-5 h-5" /> },
];

export const APP_THEME = {
  primary: 'bg-green-500 hover:bg-green-600 text-white',
  secondary: 'bg-yellow-400 hover:bg-yellow-500 text-white',
  accent: 'bg-blue-400 hover:bg-blue-500 text-white',
  card: 'bg-white rounded-2xl shadow-lg border-2 border-green-100',
};
