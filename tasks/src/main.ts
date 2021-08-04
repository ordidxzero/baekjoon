import { DataAccesser } from './data';
import { getProblemIDs, getProblem, getProblemSubmits } from './problem';
import { convertSolvedProblemsToREADMEData, formatTemplateData, getReadmeTemplate, saveReadme } from './readme';

// data.ts와 problem.ts의 함수를 조합해서 만든 함수들을 모아놓은 파일

// src에 있는 문제들을 확인하고 solved.json을 업데이트하는 함수
const updateSolvedJson = async () => {
  const dataAccesser = new DataAccesser();
  const problemIDs = getProblemIDs();
  const { solvedIDs, newSolvedIDs, ghostSolvedIDs } = dataAccesser.checkSolvedProblemsByIds(problemIDs);
  const solvedProblems = dataAccesser.findProblemsByIds(solvedIDs).map(p => {
    const submit = getProblemSubmits(p.id);
    const metadata = dataAccesser.convertFilenameToMetaData(submit.languages);
    return { ...p, submits: metadata };
  });
  const promises = newSolvedIDs.map(getProblemSubmits).map(async problem => {
    const info = await getProblem(problem.id);
    const submits = dataAccesser.convertFilenameToMetaData(problem.languages);
    return info ? { ...problem, submits, title: info.titleKo, level: info.level } : null;
  });
  const newSolvedProblems = await Promise.all(promises);
  const ghostSolvedProblems = dataAccesser.resetSubmits(dataAccesser.findProblemsByIds(ghostSolvedIDs));
  const data = [...solvedProblems, ...newSolvedProblems, ...ghostSolvedProblems].flatMap(p => (!!p ? [p] : []));
  dataAccesser.saveSolvedProblems(data);
  return data;
};

const mainRoutine = async () => {
  const solvedProblems = await updateSolvedJson();
  const templateData = getReadmeTemplate();
  const data = convertSolvedProblemsToREADMEData(solvedProblems);
  const readme = formatTemplateData(templateData, data);
  saveReadme(readme);
};

mainRoutine();
