import fs from 'fs-extra';
import path from 'path';
import { ISolvedProblem, MetaData, ThreeKindOfProblem } from './types';

const DATA_DIR = path.resolve(__dirname, '../data');

const LANGUAGE_JSON = path.join(DATA_DIR, 'languages.json');
const SOLVED_PROBLEM_JSON = path.join(DATA_DIR, 'solved.json');

// tasks/data 폴더에 접근하는 권한을 가진 클래스
export class DataAccesser {
  #languages: { [key: string]: string };
  #solvedProblems: ISolvedProblem[];
  #solvedProblemIDs: number[];

  constructor() {
    const languageRaw = fs.readFileSync(LANGUAGE_JSON, 'utf-8');
    const problemRaw = fs.readFileSync(SOLVED_PROBLEM_JSON, 'utf-8');
    this.#languages = JSON.parse(languageRaw);
    this.#solvedProblems = JSON.parse(problemRaw);
    this.#solvedProblemIDs = this.#solvedProblems.map(sp => sp.id);
  }

  // filename에서 language를 추출하는 함수
  extractLanguageFromFilename = (filename: string): MetaData => {
    const splittedFilename = filename.split('.');
    const ext = splittedFilename[splittedFilename.length - 1];
    return { language: this.#languages[ext], filename };
  };

  // filename을 metadata로 변환하는 함수
  convertFilenameToMetaData = (filenames: string[]): MetaData[] => filenames.map(this.extractLanguageFromFilename);

  // solved.json에 등록된 문제들을 필터링하는 함수
  findProblemsByIds = (ids: number[]): ISolvedProblem[] => {
    return this.#solvedProblems.filter(problem => ids.includes(problem.id));
  };

  // solved.json에 등록된 문제들인지 체크하는 함수
  checkSolvedProblemsByIds = (ids: number[]): ThreeKindOfProblem => {
    const idSet = new Set(this.#solvedProblemIDs);
    // solved.json에 이미 등록된 문제들
    const solvedIDs = ids.filter(id => {
      if (!this.#solvedProblemIDs.includes(id)) return false;
      idSet.delete(id);
      return true;
    });
    // solved.json에 등록되지 않은 문제들
    const newSolvedIDs = ids.filter(id => {
      if (this.#solvedProblemIDs.includes(id)) return false;
      idSet.delete(id);
      return true;
    });
    // solved.json에 등록되어 있으나, submits에는 없는 문제들
    const ghostSolvedIDs = [...idSet];
    return { solvedIDs, newSolvedIDs, ghostSolvedIDs };
  };

  // solved.json에 등록된 문제들만 필터링하는 함수
  findSolvedProblemsByIds = (ids: number[]): ISolvedProblem[] => {
    return this.#solvedProblems.filter(problem => ids.includes(problem.id));
  };

  // solved.json에는 등록되어있으나, src에는 submit이 없는 문제의 submits을 비우는 함수
  resetSubmits = (problems: ISolvedProblem[]): ISolvedProblem[] => {
    return problems.map(problem => ({ ...problem, submits: [] }));
  };

  // solved.json에 데이터를 저장하는 함수
  saveSolvedProblems = (data: ISolvedProblem[]): void => {
    const sortedData = data.sort((prev, cur) => prev.id - cur.id);
    fs.writeFileSync(SOLVED_PROBLEM_JSON, JSON.stringify(sortedData, null, 2), { encoding: 'utf-8' });
    return;
  };
}
