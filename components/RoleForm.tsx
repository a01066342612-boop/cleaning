
import React, { useState, useEffect } from 'react';
import { Plus, X, Library, ClipboardList, Trash2, Save, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { Role } from '../types';
import { APP_THEME, DEFAULT_ROLES } from '../constants';
import { generateCreativeRoles } from '../services/geminiService';

interface RoleFormProps {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  totalStudents: number;
}

const RoleForm: React.FC<RoleFormProps> = ({ roles, setRoles, totalStudents }) => {
  const [roleNameInput, setRoleNameInput] = useState('');
  const [customPresets, setCustomPresets] = useState<{name: string}[]>([]);
  const [saveStatus, setSaveStatus] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const savedPresets = localStorage.getItem('classroom_custom_presets');
    if (savedPresets) {
      try {
        setCustomPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error("Failed to parse custom presets", e);
      }
    }
  }, []);

  // 저장소(Presets) 자동 저장
  useEffect(() => {
    localStorage.setItem('classroom_custom_presets', JSON.stringify(customPresets));
  }, [customPresets]);

  // 오늘의 배정 목록 자동 저장
  useEffect(() => {
    localStorage.setItem('classroom_roles', JSON.stringify(roles));
  }, [roles]);

  const saveToLibrary = (nameStr?: string) => {
    const name = (nameStr || roleNameInput).trim();
    if (!name) return;
    
    if (!DEFAULT_ROLES.some(r => r.name === name) && !customPresets.some(p => p.name === name)) {
      setCustomPresets(prev => [...prev, { name }]);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 1500);
    }
    setRoleNameInput('');
  };

  const handleAiRecommend = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    try {
      const recommended = await generateCreativeRoles(5);
      const newPresets = recommended.map(name => ({ name }));
      // 기존 프리셋과 중복 제거 후 합치기
      const filtered = newPresets.filter(p => !customPresets.some(cp => cp.name === p.name));
      setCustomPresets(prev => [...prev, ...filtered]);
    } catch (err) {
      alert('AI 추천을 가져오는데 실패했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const addRoleToSession = (name: string) => {
    if (roles.some(r => r.name === name)) {
      setRoles(roles.map(r => r.name === name ? { ...r, count: r.count + 1 } : r));
    } else {
      setRoles([...roles, {
        id: Math.random().toString(36).substr(2, 9),
        name,
        count: 1
      }]);
    }
  };

  const removePreset = (name: string) => {
    if (confirm(`'${name}' 역할을 저장소에서 삭제할까요?`)) {
      setCustomPresets(customPresets.filter(p => p.name !== name));
    }
  };

  const removeRoleFromSession = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const updateRoleCount = (id: string, delta: number) => {
    setRoles(roles.map(r => r.id === id ? { ...r, count: Math.max(1, r.count + delta) } : r));
  };

  const totalAssigned = roles.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* 1. 역할 저장소 */}
      <div className={APP_THEME.card + " p-6 flex flex-col bg-blue-50/10 border-blue-100"}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
            <Library className="w-8 h-8" /> 역할 저장소
          </h2>
          <button 
            onClick={handleAiRecommend}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI 창의적 추천
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={roleNameInput}
            onChange={(e) => setRoleNameInput(e.target.value)}
            placeholder="새 역할 등록"
            onKeyPress={(e) => e.key === 'Enter' && saveToLibrary()}
            className="flex-1 px-5 py-3 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-blue-400 text-xl shadow-inner bg-white"
          />
          <button 
            onClick={() => saveToLibrary()}
            className="bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-600 transition-all font-bold flex items-center gap-2 shadow-lg text-2xl active:scale-95"
          >
            <Save className="w-6 h-6" /> 저장
          </button>
        </div>

        <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1 custom-scrollbar">
          {DEFAULT_ROLES.map((r) => (
            <button
              key={r.name}
              onClick={() => addRoleToSession(r.name)}
              className="text-lg font-bold bg-white border-2 border-blue-100 px-4 py-2 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-sm text-blue-600"
            >
              {r.name}
            </button>
          ))}
          {customPresets.map((r) => (
            <div key={r.name} className="flex items-center bg-yellow-100 border-2 border-yellow-200 rounded-2xl pl-4 pr-2 py-1.5 shadow-md group">
              <button
                onClick={() => addRoleToSession(r.name)}
                className="text-lg text-yellow-900 font-bold mr-3"
              >
                {r.name}
              </button>
              <button 
                onClick={() => removePreset(r.name)}
                className="p-1.5 text-yellow-700 hover:text-white hover:bg-red-500 transition-all rounded-full"
                title="삭제하기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 오늘의 역할 배정 */}
      <div className={APP_THEME.card + " p-6 flex-1 flex flex-col border-green-100 min-h-[360px]"}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-green-700">
            <ClipboardList className="w-8 h-8" /> 오늘의 배정 목록
          </h2>
          <span className={`text-lg font-bold px-4 py-2 rounded-2xl shadow-inner ${totalAssigned === totalStudents ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
             {totalAssigned} / {totalStudents} 명
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 p-1">
          {roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-300 border-2 border-dashed border-gray-100 rounded-3xl">
               <ClipboardList className="w-16 h-16 opacity-10 mb-3" />
               <p className="text-xl">역할을 선택하여 추가하세요.</p>
            </div>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-green-50 shadow-md hover:border-green-300 transition-all">
                <span className="font-bold text-gray-800 text-2xl tracking-wide">{role.name}</span>
                <div className="flex items-center gap-5">
                  <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
                    <button onClick={() => updateRoleCount(role.id, -1)} className="px-4 py-2 hover:bg-white transition-colors text-gray-600 font-bold text-xl">-</button>
                    <span className="px-5 font-bold text-green-700 bg-white min-w-[50px] text-center text-2xl">{role.count}</span>
                    <button onClick={() => updateRoleCount(role.id, 1)} className="px-4 py-2 hover:bg-white transition-colors text-gray-600 font-bold text-xl">+</button>
                  </div>
                  <button onClick={() => removeRoleFromSession(role.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                    <X className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleForm;
