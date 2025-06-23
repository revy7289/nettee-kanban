export enum E_Team {
  all = '전체',
  lead = 'Lead',
  pl = 'PL',
  fe = 'FE',
  be = 'BE',
  ux = 'UXUI',
}

export const netteeRepo = {
  Blolet: {
    [E_Team.lead]: [],
    [E_Team.pl]: [],
    [E_Team.ux]: [],
    [E_Team.fe]: [],
    [E_Team.be]: [],
  },
  Kanban: {
    [E_Team.lead]: [],
    [E_Team.pl]: [],
    [E_Team.ux]: [],
    [E_Team.fe]: ['test-repo', 'nettee-kanban'],
    [E_Team.be]: ['backend-sample-multi-module'],
  },
  Demo: {
    [E_Team.lead]: [],
    [E_Team.pl]: [],
    [E_Team.ux]: [],
    [E_Team.fe]: ['frontend-sample-monorepo-simple-crud'],
    [E_Team.be]: ['backend-sample-hexagonal-simple-crud'],
  },
} as const;

export const netteeMembers = {
  [E_Team.lead]: ['강민성'],
  [E_Team.pl]: ['권기혁'],
  [E_Team.ux]: ['최원비', '신정연', '장은영', '박지성'],
  [E_Team.fe]: [
    '나선오',
    '유상협',
    '김병제',
    '최원오',
    '김정아',
    '오태훈',
    '임거정',
    '김혁준',
    '이하성',
    '이재상',
    '송문혁',
    '김동구',
  ],
  [E_Team.be]: [
    '박경우',
    '신인수',
    '신진규',
    '전상은',
    '정정용',
    '노기훈',
    '문선호',
    '김태우',
    '김수용',
    '이성훈',
  ],
} as const;

export const kanbanStyleMap = {
  TODO: {
    bg: 'bg-[#FFFBDE]',
    text: 'text-[#F9AA01]',
  },
  DOING: {
    bg: 'bg-[#E7F3FE]',
    text: 'text-[#1E85E4]',
  },
  DONE: {
    bg: 'bg-[#EEFBE6]',
    text: 'text-[#58BE1A]',
  },
  DEFAULT: {
    bg: 'bg-[#f5f5f5]',
    text: 'text-[#767676]',
  },
} as const;
