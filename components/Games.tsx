
import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Student, Role, Assignment } from '../types';
import { APP_THEME } from '../constants';

interface GameProps {
  students: Student[];
  roles: Role[];
  onComplete: (assignments: Assignment[]) => void;
}

// 공통 헬퍼: 섞기
const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

// --- 랜덤 섞기 게임 전용 ---
export const RandomShuffle: React.FC<GameProps> = ({ students, roles, onComplete }) => {
  const [animating, setAnimating] = useState(false);

  const handleStart = () => {
    setAnimating(true);
    setTimeout(() => {
      const shuffledStudents: Student[] = shuffleArray<Student>(students);
      const assignments: Assignment[] = [];
      let studentIndex = 0;

      roles.forEach(role => {
        for (let i = 0; i < role.count; i++) {
          if (studentIndex < shuffledStudents.length) {
            assignments.push({
              studentName: shuffledStudents[studentIndex].name,
              studentAvatar: shuffledStudents[studentIndex].avatar,
              roleName: role.name
            });
            studentIndex++;
          }
        }
      });
      
      while (studentIndex < shuffledStudents.length) {
          assignments.push({
              studentName: shuffledStudents[studentIndex].name,
              studentAvatar: shuffledStudents[studentIndex].avatar,
              roleName: '자유'
          });
          studentIndex++;
      }

      onComplete(assignments);
    }, 2000);
  };

  return (
    <div className="text-center space-y-12 py-16">
      <div className="flex justify-center">
        <div className={`p-12 bg-green-100 rounded-full border-4 border-green-500 shadow-2xl ${animating ? 'animate-bounce' : ''}`}>
          <Shuffle className={`w-32 h-32 text-green-600 ${animating ? 'animate-spin' : ''}`} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-4xl font-black text-green-800">모두 섞어서 뽑아볼까요?</h3>
        <p className="text-xl text-gray-500">버튼을 누르면 공정하게 역할이 배정됩니다!</p>
      </div>
      <button 
        onClick={handleStart}
        disabled={animating}
        className={`${APP_THEME.primary} px-20 py-8 rounded-[3rem] text-4xl font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50`}
      >
        {animating ? '휘리릭 섞는 중...' : '운명의 주사위 던지기!'}
      </button>
    </div>
  );
};
