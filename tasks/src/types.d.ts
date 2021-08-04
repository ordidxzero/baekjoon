export interface MetaData {
  language: string;
  filename: string;
}
export interface ISolvedProblem {
  id: number;
  title: string;
  baekjoonUrl: string;
  level: number;
  submits: MetaData[];
}

export interface IProblemSubmit {
  id: number;
  baekjoonUrl: string;
  languages: string[];
}

export interface ThreeKindOfProblem {
  solvedIDs: number[];
  newSolvedIDs: number[];
  ghostSolvedIDs: number[];
}

export interface IProblem {
  problemId: number;
  titleKo: string;
  isSolvable: boolean;
  isPartial: boolean;
  acceptedUserCount: number;
  level: number;
  votedUserCount: number;
  isLevelLocked: boolean;
  averageTries: number;
  tags: {
    key: string;
    isMeta: boolean;
    bojTagId: number;
    problemCount: number;
    displayNames: {
      language: string;
      name: string;
      short: string;
    }[];
  }[];
}
