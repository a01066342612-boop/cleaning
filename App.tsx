
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RefreshCcw, Trophy, Printer, Type, Settings, Shuffle } from 'lucide-react';
import { Student, Role, Assignment, Step, GameMethod } from './types';
import { APP_THEME } from './constants';
import StudentForm from './components/StudentForm';
import RoleForm from './components/RoleForm';
import { RandomShuffle } from './components/Games';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('INPUT');
  const [students, setStudents] = useState<Student[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  const [fontFamily, setFontFamily] = useState('font-sunflower');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedStudents = localStorage.getItem('classroom_students');
    if (savedStudents) setStudents(JSON.parse(savedStudents));

    const savedRoles = localStorage.getItem('classroom_roles');
    if (savedRoles) setRoles(JSON.parse(savedRoles));

    const savedFont = localStorage.getItem('classroom_font_family');
    if (savedFont) setFontFamily(savedFont);
  }, []);

  useEffect(() => {
    localStorage.setItem('classroom_font_family', fontFamily);
  }, [fontFamily]);

  const startShuffle = () => {
    if (students.length === 0) {
      alert('학생 명단을 입력해주세요!');
      return;
    }
    if (roles.length === 0) {
      alert('최소 하나 이상의 청소 역할을 입력해주세요!');
      return;
    }
    setStep('GAME');
  };

  const handleGameComplete = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    setStep('RESULT');
  };

  const resetAll = () => {
    if (confirm('모든 내용을 초기화하고 처음으로 돌아갈까요?')) {
      setStep('INPUT');
      setStudents([]);
      setRoles([]);
      setAssignments([]);
      localStorage.removeItem('classroom_students');
      localStorage.removeItem('classroom_roles');
    }
  };

  const fontOptions = [
    { id: 'font-gaegu', name: '개구체' },
    { id: 'font-jua', name: '주아체' },
    { id: 'font-dohyeon', name: '도현체' },
    { id: 'font-nanum', name: '고딕체' },
    { id: 'font-yeonsung', name: '연성체' },
    { id: 'font-blackhansans', name: '검은고딕' },
    { id: 'font-dongle', name: '동글체' },
    { id: 'font-gowunbatang', name: '고운바탕' },
    { id: 'font-sunflower', name: '해바라기' },
  ];

  return (
    <div className={`min-h-screen pb-20 bg-[#f8fff9] ${fontFamily} transition-all duration-300`}>
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 print:hidden">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-white border-2 border-green-200 rounded-full shadow-lg hover:bg-green-50 transition-all"
        >
          <Settings className={`w-6 h-6 text-green-600 ${showSettings ? 'rotate-90' : ''} transition-transform`} />
        </button>
        
        {showSettings && (
          <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-green-100 min-w-[320px] animate-in slide-in-from-top-2">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
              <Type className="w-5 h-5" /> 화면 글씨체 설정
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setFontFamily(font.id)}
                    className={`py-3 px-2 rounded-xl text-sm border-2 transition-all ${fontFamily === font.id ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-gray-100 hover:border-green-200 text-gray-600'} ${font.id}`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full mt-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all text-lg">확인</button>
          </div>
        )}
      </div>

      <section className="pt-12 pb-8 px-6 text-center print:pt-4 print:pb-2">
        <div className="max-w-4xl mx-auto relative">
          <button onClick={resetAll} className="absolute -top-4 -left-4 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all print:hidden" title="전체 초기화">
            <RefreshCcw className="w-6 h-6" />
          </button>
          <div className="inline-block animate-bounce mb-2">
             <span className="text-5xl">✨</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 drop-shadow-sm mb-4">
            🧼 쓱싹쓱싹! 청소 대장 뽑기 🧹
          </h1>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-4">
        {step === 'INPUT' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudentForm students={students} setStudents={setStudents} />
              <RoleForm roles={roles} setRoles={setRoles} totalStudents={students.length} />
            </div>
            <div className="flex justify-center mt-10">
              <button 
                onClick={startShuffle}
                className={`${APP_THEME.primary} px-14 py-6 rounded-full text-3xl font-bold flex items-center gap-4 shadow-xl hover:shadow-2xl transition-all group transform hover:-translate-y-2 active:scale-95`}
              >
                청소 대장 정하기! <ArrowRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 'GAME' && (
          <div className={`${APP_THEME.card} p-10 max-w-4xl mx-auto border-4 animate-in zoom-in duration-300`}>
            <div className="flex justify-between items-center mb-8">
                 <button onClick={() => setStep('INPUT')} className="text-lg font-bold text-gray-400 hover:text-green-600 flex items-center gap-1">&larr; 명단 수정하러 가기</button>
                 <span className="text-lg font-bold bg-green-100 text-green-700 px-6 py-2 rounded-full shadow-sm flex items-center gap-2">
                   <Shuffle className="w-5 h-5" /> 랜덤 섞기 모드
                 </span>
            </div>
            <RandomShuffle students={students} roles={roles} onComplete={handleGameComplete} />
          </div>
        )}

        {step === 'RESULT' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-10 print:mb-4">
              <div className="inline-block p-6 bg-yellow-100 rounded-full mb-4 shadow-inner print:hidden">
                <Trophy className="w-20 h-20 text-yellow-500 animate-pulse" />
              </div>
              <h2 className="text-6xl font-bold text-green-800 mb-2">✨ 청소 명단 완성! ✨</h2>
              <p className="text-2xl text-gray-600">오늘의 청소 대장들, 우리 교실을 부탁해!</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2">
              {assignments.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center p-6 bg-white rounded-[2rem] border-2 border-green-100 shadow-lg hover:border-green-400 transition-all transform hover:-translate-y-1 hover:shadow-xl">
                  <span className="text-6xl mb-3">{item.studentAvatar}</span>
                  <span className="text-2xl font-bold text-gray-800 mb-1 tracking-wider">{item.studentName}</span>
                  <div className="w-full h-0.5 bg-green-50 my-2 rounded-full" />
                  <span className="text-base font-bold text-white bg-green-500 px-4 py-1.5 rounded-full shadow-md">{item.roleName}</span>
                </div>
              ))}
            </div>

            <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6 print:hidden">
              <button onClick={() => setStep('INPUT')} className={`${APP_THEME.primary} px-10 py-5 rounded-full font-bold text-2xl shadow-lg flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 transition-all`}>
                <RefreshCcw className="w-8 h-8" /> 처음부터 다시 하기
              </button>
              <button onClick={() => window.print()} className="bg-gray-800 text-white px-10 py-5 rounded-full font-bold text-2xl shadow-lg flex items-center justify-center gap-3 hover:bg-black transform hover:scale-105 transition-all">
                <Printer className="w-8 h-8" /> 명단 출력하기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
