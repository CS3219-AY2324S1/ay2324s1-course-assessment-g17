// copied from frontend/src/types/code/languages.ts

export enum EditorLanguageEnum {
  javascript = "javascript",
  typescript = "typescript",
  python = "python",
  java = "java",
  c = "c",
  cpp = "cpp",
  clojure = "clojure",
  csharp = "csharp",
  dart = "dart",
  elixir = "elixir",
  fsharp = "fsharp",
  go = "go",
  julia = "julia",
  kotlin = "kotlin",
  lua = "lua",
  mips = "mips",
  mysql = "mysql",
  objectivec = "objective-c",
  pascal = "pascal",
  perl = "perl",
  php = "php",
  text = "text",
  pgsql = "pgsql",
  r = "r",
  ruby = "ruby",
  rust = "rust",
  scala = "scala",
  sql = "sql",
  swift = "swift",
}

export const EditorLanguageOptions: ReadonlyArray<{
  label: string;
  value: EditorLanguageEnum;
}> = Object.freeze([
  {
    label: "JavaScript",
    value: EditorLanguageEnum.javascript,
  },
  {
    label: "TypeScript",
    value: EditorLanguageEnum.typescript,
  },
  {
    label: "Python",
    value: EditorLanguageEnum.python,
  },
  {
    label: "Java",
    value: EditorLanguageEnum.java,
  },
  {
    label: "C",
    value: EditorLanguageEnum.c,
  },
  {
    label: "C++",
    value: EditorLanguageEnum.cpp,
  },
  {
    label: "Clojure",
    value: EditorLanguageEnum.clojure,
  },
  {
    label: "C#",
    value: EditorLanguageEnum.csharp,
  },
  {
    label: "Dart",
    value: EditorLanguageEnum.dart,
  },
  {
    label: "Elixir",
    value: EditorLanguageEnum.elixir,
  },
  {
    label: "F#",
    value: EditorLanguageEnum.fsharp,
  },
  {
    label: "Go",
    value: EditorLanguageEnum.go,
  },
  {
    label: "Julia",
    value: EditorLanguageEnum.julia,
  },
  {
    label: "Kotlin",
    value: EditorLanguageEnum.kotlin,
  },
  {
    label: "Lua",
    value: EditorLanguageEnum.lua,
  },
  {
    label: "MIPS",
    value: EditorLanguageEnum.mips,
  },
  {
    label: "MySQL",
    value: EditorLanguageEnum.mysql,
  },
  {
    label: "Objective-C",
    value: EditorLanguageEnum.objectivec,
  },
  {
    label: "Pascal",
    value: EditorLanguageEnum.pascal,
  },
  {
    label: "Perl",
    value: EditorLanguageEnum.perl,
  },
  {
    label: "PHP",
    value: EditorLanguageEnum.php,
  },
  {
    label: "Plain Text",
    value: EditorLanguageEnum.text,
  },
  {
    label: "PostgreSQL",
    value: EditorLanguageEnum.pgsql,
  },
  {
    label: "R",
    value: EditorLanguageEnum.r,
  },
  {
    label: "Ruby",
    value: EditorLanguageEnum.ruby,
  },
  {
    label: "Rust",
    value: EditorLanguageEnum.rust,
  },
  {
    label: "Scala",
    value: EditorLanguageEnum.scala,
  },
  {
    label: "SQL",
    value: EditorLanguageEnum.sql,
  },
  {
    label: "Swift",
    value: EditorLanguageEnum.swift,
  },
]);
