import { EditorLanguageEnum } from './languages';

export interface ExecutorSubmissionPostData {
  language_id: number;
  source_code: string;
  stdin: string;
}

export interface ExecutorLanguage {
  id: number;
  name: string;
}

export const EditorLanguageToExecutorLanguagesMap: Record<EditorLanguageEnum, ExecutorLanguage> = Object.freeze({
  [EditorLanguageEnum.javascript]: {
    id: 93,
    name: 'JavaScript (Node.js 18.15.0)',
  },
  [EditorLanguageEnum.typescript]: {
    id: 94,
    name: 'TypeScript (5.0.3)',
  },
  [EditorLanguageEnum.python]: {
    id: 71,
    name: 'Python (3.8.1)',
  },
  [EditorLanguageEnum.java]: {
    id: 62,
    name: 'Java (OpenJDK 13.0.1)',
  },
  [EditorLanguageEnum.c]: {
    id: 50,
    name: 'C (GCC 9.2.0)',
  },
  [EditorLanguageEnum.cpp]: {
    id: 76,
    name: 'C++ (Clang 7.0.1)',
  },
  [EditorLanguageEnum.clojure]: {
    id: 86,
    name: 'Clojure (1.10.1)',
  },
  [EditorLanguageEnum.csharp]: {
    id: 51,
    name: 'C# (Mono 6.6.0.161)',
  },
  [EditorLanguageEnum.dart]: {
    id: 90,
    name: 'Dart (2.19.2)',
  },
  [EditorLanguageEnum.elixir]: {
    id: 57,
    name: 'Elixir (1.9.4)',
  },
  [EditorLanguageEnum.fsharp]: {
    id: 87,
    name: 'F# (.NET Core SDK 3.1.202)',
  },
  [EditorLanguageEnum.go]: {
    id: 95,
    name: 'Go (1.18.5)',
  },
  [EditorLanguageEnum.kotlin]: {
    id: 78,
    name: 'Kotlin (1.3.70)',
  },
  [EditorLanguageEnum.lua]: {
    id: 64,
    name: 'Lua (5.3.5)',
  },
  [EditorLanguageEnum.objectivec]: {
    id: 79,
    name: 'Objective-C (Clang 7.0.1)',
  },
  [EditorLanguageEnum.pascal]: {
    id: 67,
    name: 'Pascal (FPC 3.0.4)',
  },
  [EditorLanguageEnum.perl]: {
    id: 85,
    name: 'Perl (5.28.1)',
  },
  [EditorLanguageEnum.php]: {
    id: 68,
    name: 'PHP (7.4.1)',
  },
  [EditorLanguageEnum.text]: {
    id: 43,
    name: 'Plain Text',
  },
  [EditorLanguageEnum.r]: {
    id: 80,
    name: 'R (4.0.0)',
  },
  [EditorLanguageEnum.ruby]: {
    id: 72,
    name: 'Ruby (2.7.0)',
  },
  [EditorLanguageEnum.rust]: {
    id: 73,
    name: 'Rust (1.40.0)',
  },
  [EditorLanguageEnum.scala]: {
    id: 81,
    name: 'Scala (2.13.2)',
  },
  [EditorLanguageEnum.sql]: {
    id: 82,
    name: 'SQL (SQLite 3.27.2)',
  },
  [EditorLanguageEnum.swift]: {
    id: 83,
    name: 'Swift (5.2.3)',
  },
});

export interface ExecutorStatusData {
  stdout?: string;
  time?: string;
  memory?: string;
  stderr?: string;
  token?: string;
  compile_output?: string;
  message?: string;
  status?: {
    id?: ExecutorStatus;
    description?: string;
  };
  error?: string;
}

export enum ExecutorStatus {
  IN_QUEUE = 1,
  PROCESSING = 2,
  ACCEPTED = 3,
  WRONG_ANSWER = 4,
  TLE = 5,
  COMPILATION_ERROR = 6,
  RUNTIME_SIGSEGV = 7,
  RUNTIME_SIGXFSZ = 8,
  RUNTIME_SIGFPE = 9,
  RUNTIME_SIGABRT = 10,
  RUNTIME_NZEC = 11,
  RUNTIME_OTHER = 12,
  INTERNAL_ERR = 13,
  EXEC_FORMAT_ERR = 14,
}

export const ExecutorStatusToLabelMap: Record<ExecutorStatus, string> = Object.freeze({
  [ExecutorStatus.IN_QUEUE]: 'In Queue',
  [ExecutorStatus.PROCESSING]: 'Processing',
  [ExecutorStatus.ACCEPTED]: 'Accepted',
  [ExecutorStatus.WRONG_ANSWER]: 'Wrong Answer',
  [ExecutorStatus.TLE]: 'Time Limit Exceeded',
  [ExecutorStatus.COMPILATION_ERROR]: 'Compilation Error',
  [ExecutorStatus.RUNTIME_SIGSEGV]: 'Runtime Error (SIGSEGV)',
  [ExecutorStatus.RUNTIME_SIGXFSZ]: 'Runtime Error (SIGXFSZ)',
  [ExecutorStatus.RUNTIME_SIGFPE]: 'Runtime Error (SIGFPE)',
  [ExecutorStatus.RUNTIME_SIGABRT]: 'Runtime Error (SIGABRT)',
  [ExecutorStatus.RUNTIME_NZEC]: 'Runtime Error (NZEC)',
  [ExecutorStatus.RUNTIME_OTHER]: 'Runtime Error (Other)',
  [ExecutorStatus.INTERNAL_ERR]: 'Internal Error',
  [ExecutorStatus.EXEC_FORMAT_ERR]: 'Exec Format Error',
});
