import fs from 'fs-extra';
import fetch from 'node-fetch';
import path from 'path';
import { IProblem, IProblemSubmit } from './types';

const SOLVED_AC_BASE_URL = 'https://solved.ac/api/v3/problem/show';
const BAEKJOON_HOST = 'https://www.acmicpc.net/problem';
const SRC_DIR = path.resolve(__dirname, '../../src');

// src에 있는 문제들에 접근하는 함수들을 모아놓은 파일

const sleep = (milliseconds: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });

// src 폴더에 있는 문제 번호들을 가져오는 함수
export const getProblemIDs = (): number[] => {
  const stringIDs = fs.readdirSync(SRC_DIR);
  return stringIDs.map(id => parseInt(id));
};

// solved.ac에서 특정 문제의 정보를 가져오는 함수
export const getProblem = async (id: number): Promise<IProblem | null> => {
  console.log(`${id}번 문제 정보를 가져오고 있습니다...`);
  const result = await fetch(`${SOLVED_AC_BASE_URL}?problemId=${id}`)
    .then(res => res.json())
    .catch(() => null);
  await sleep(750);
  return result;
};

// 백준 문제 상세페이지의 URL을 생성하는 함수
export const generateBaekjoonURL = (id: number): string => `${BAEKJOON_HOST}/${id}`;

// 특정 문제의 제출한 답들을 가져오는 함수
export const getProblemSubmits = (id: number): IProblemSubmit => {
  const filenames = fs.readdirSync(path.join(SRC_DIR, id.toString()));
  const fileURLs = filenames.map(filename => `src/${id}/${filename}`);
  return { id, languages: fileURLs, baekjoonUrl: generateBaekjoonURL(id) };
};
