
export interface Student {
  id: string;
  name: string;
  avatar: string;
}

export interface Role {
  id: string;
  name: string;
  count: number;
}

export interface Assignment {
  studentName: string;
  studentAvatar: string;
  roleName: string;
}

export enum GameMethod {
  RANDOM = 'RANDOM'
}

export type Step = 'INPUT' | 'GAME' | 'RESULT';
