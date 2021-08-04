import fs from 'fs-extra';
import path from 'path';
import { ISolvedProblem, MetaData } from './types';

const TEMPLATE_DIR = path.join(__dirname, 'README.template.md'); // README.template.md 파일 경로

const README_DIR = path.resolve(__dirname, '../../README.md'); // README.md 파일 경로

// README template 데이터를 읽는 함수
export const getReadmeTemplate = (): string => fs.readFileSync(TEMPLATE_DIR, { encoding: 'utf-8' });

// README.md에 데이터를 저장하는 함수
export const saveReadme = (data: string): void => fs.writeFileSync(README_DIR, data, { encoding: 'utf-8' });

// 문제 솔루션으로 이동하는 태그를 생성하는 함수
export const generateAtagOfSolution = ({ filename, language }: MetaData): string => {
  return `<a href="${filename}">${language}</a>`;
};

// ISolvedProblem 데이터를 README.md에 맞게 변환하는 함수
export const convertSolvedProblemsToREADMEData = (data: ISolvedProblem[]): { problemCount: number; solutions: string } => {
  const solvedProblems = data.filter(d => d.submits.length > 0);
  const problemCount = solvedProblems.length;
  const solutions = solvedProblems.map(problem => {
    return `<tr>
      <td>
        <a href="${problem.baekjoonUrl}">${problem.id}. ${problem.title}</a>
      </td>
      <td style="text-align:center">${problem.submits.map(generateAtagOfSolution).join('<br />')}
      </td>
      <td style="text-align:center">
        <img src="https://static.solved.ac/tier_small/${problem.level}.svg" height="14">
      </td>
    </tr>
    `;
  });
  return { problemCount, solutions: solutions.join('\n') };
};

// Template Data에 data를 주입하는 함수
export const formatTemplateData = (templateData: string, data: any): string => {
  let readmeData = templateData;
  const keys = Object.keys(data);
  keys.forEach(key => {
    const regex = new RegExp(`\\$\\{\\{${key}\\}\\}`, 'g');
    readmeData = readmeData.replace(regex, data[key]);
  });
  return readmeData;
};
