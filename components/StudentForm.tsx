
import React, { useState, useEffect } from 'react';
import { UserPlus, X, Users, Trash2, CheckCircle } from 'lucide-react';
import { Student } from '../types';
import { APP_THEME } from '../constants';

const ANIMAL_CHARACTERS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', 
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
  '🦄', '🦒', '🐘', '🦏', '🦓', '🐿️', '🦔', '🦦', '🦥', '🦭'
];

interface StudentFormProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ students, setStudents }) => {
  const [inputValue, setInputValue] = useState('');
  const [saveMessage, setSaveMessage] = useState(false);

  // 자동 저장
  useEffect(() => {
    localStorage.setItem('classroom_students', JSON.stringify(students));
  }, [students]);

  const addStudent = () => {
    if (!inputValue.trim()) return;
    const names = inputValue.split(/[,\s\n]+/).filter(n => n.trim());
    const newStudents = names.map(name => {
      const randomAvatar = ANIMAL_CHARACTERS[Math.floor(Math.random() * ANIMAL_CHARACTERS.length)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        avatar: randomAvatar
      };
    });
    setStudents([...students, ...newStudents]);
    setInputValue('');
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleManualSave = () => {
    localStorage.setItem('classroom_students', JSON.stringify(students));
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2000);
  };

  const clearAll = () => {
    if (confirm('모든 학생 명단을 삭제할까요?')) {
      setStudents([]);
    }
  };

  return (
    <div className={APP_THEME.card + " p-6 h-full flex flex-col min-h-[550px] relative"}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-green-700">
          <Users className="w-8 h-8" /> 학생 명단 ({students.length}명)
        </h2>
        <button onClick={clearAll} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 font-bold">
          <Trash2 className="w-4 h-4" /> 전체 삭제
        </button>
      </div>
      
      <div className="flex flex-col gap-3 mb-6">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="학생 이름을 입력하세요 (여러 명 가능)"
          className="w-full p-5 border-2 border-green-100 rounded-3xl focus:outline-none focus:border-green-400 min-h-[140px] text-xl resize-none shadow-inner bg-gray-50/30 transition-all"
        />
        <button 
          onClick={addStudent}
          className={`${APP_THEME.primary} w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg font-bold text-2xl transform active:scale-95 transition-all`}
        >
          <UserPlus className="w-7 h-7" /> 학생 추가하기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-1 mb-4">
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-300 border-2 border-dashed border-gray-100 rounded-3xl">
            <Users className="w-16 h-16 opacity-10 mb-3" />
            <p className="text-xl">명단이 비어있어요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {students.map((student) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between bg-white p-4 rounded-3xl border-2 border-green-50 shadow-md hover:border-green-400 transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-3xl flex-shrink-0">{student.avatar}</span>
                  <span className="text-green-900 font-bold text-2xl truncate tracking-wider">{student.name}</span>
                </div>
                <button onClick={() => removeStudent(student.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {students.length > 0 && (
        <button 
          onClick={handleManualSave}
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg font-bold text-2xl transition-all transform hover:-translate-y-1 active:scale-95"
        >
          {saveMessage ? (
            <><CheckCircle className="w-7 h-7" /> 명단 저장 완료!</>
          ) : (
            <><CheckCircle className="w-7 h-7" /> 명단 확정 및 저장</>
          )}
        </button>
      )}
    </div>
  );
};

export default StudentForm;
