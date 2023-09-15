export enum EditorLanguageEnum {
  javascript = 'javascript',
  typescript = 'typescript',
  python = 'python',
  java = 'java',
  c = 'c',
  cpp = 'cpp',
  bat = 'bat',
  clojure = 'clojure',
  css = 'css',
  csharp = 'csharp',
  dart = 'dart',
  dockerfile = 'dockerfile',
  elixir = 'elixir',
  fsharp = 'fsharp',
  go = 'go',
  graphql = 'graphql',
  json = 'json',
  julia = 'julia',
  kotlin = 'kotlin',
  lua = 'lua',
  markdown = 'markdown',
  mysql = 'mysql',
  objectivec = 'objective-c',
  pascal = 'pascal',
  perl = 'perl',
  php = 'php',
  text = 'text',
  pgsql = 'pgsql',
  powerquery = 'powerquery',
  powershell = 'powershell',
  r = 'r',
  ruby = 'ruby',
  rust = 'rust',
  scala = 'scala',
  sql = 'sql',
  swift = 'swift',
}

export const EditorLanguageOptions: ReadonlyArray<{ label: string; value: EditorLanguageEnum }> = Object.freeze([
  {
    label: 'JavaScript',
    value: EditorLanguageEnum.javascript,
  },
  {
    label: 'TypeScript',
    value: EditorLanguageEnum.typescript,
  },
  {
    label: 'Python',
    value: EditorLanguageEnum.python,
  },
  {
    label: 'Java',
    value: EditorLanguageEnum.java,
  },
  {
    label: 'C',
    value: EditorLanguageEnum.c,
  },
  {
    label: 'C++',
    value: EditorLanguageEnum.cpp,
  },
  {
    label: 'Batch Script',
    value: EditorLanguageEnum.bat,
  },
  {
    label: 'Clojure',
    value: EditorLanguageEnum.clojure,
  },
  {
    label: 'CSS',
    value: EditorLanguageEnum.css,
  },
  {
    label: 'C#',
    value: EditorLanguageEnum.csharp,
  },
  {
    label: 'Dart',
    value: EditorLanguageEnum.dart,
  },
  {
    label: 'Dockerfile',
    value: EditorLanguageEnum.dockerfile,
  },
  {
    label: 'Elixir',
    value: EditorLanguageEnum.elixir,
  },
  {
    label: 'F#',
    value: EditorLanguageEnum.fsharp,
  },
  {
    label: 'Go',
    value: EditorLanguageEnum.go,
  },
  {
    label: 'Graphql',
    value: EditorLanguageEnum.graphql,
  },
  {
    label: 'JSON',
    value: EditorLanguageEnum.json,
  },
  {
    label: 'Julia',
    value: EditorLanguageEnum.julia,
  },
  {
    label: 'Kotlin',
    value: EditorLanguageEnum.kotlin,
  },
  {
    label: 'Lua',
    value: EditorLanguageEnum.lua,
  },
  {
    label: 'Markdown',
    value: EditorLanguageEnum.markdown,
  },
  {
    label: 'MySQL',
    value: EditorLanguageEnum.mysql,
  },
  {
    label: 'Objective-C',
    value: EditorLanguageEnum.objectivec,
  },
  {
    label: 'Pascal',
    value: EditorLanguageEnum.pascal,
  },
  {
    label: 'Perl',
    value: EditorLanguageEnum.perl,
  },
  {
    label: 'PHP',
    value: EditorLanguageEnum.php,
  },
  {
    label: 'Plain Text',
    value: EditorLanguageEnum.text,
  },
  {
    label: 'PostgreSQL',
    value: EditorLanguageEnum.pgsql,
  },
  {
    label: 'Power Query',
    value: EditorLanguageEnum.powerquery,
  },
  {
    label: 'PowerShell',
    value: EditorLanguageEnum.powershell,
  },
  {
    label: 'R',
    value: EditorLanguageEnum.r,
  },
  {
    label: 'Ruby',
    value: EditorLanguageEnum.ruby,
  },
  {
    label: 'Rust',
    value: EditorLanguageEnum.rust,
  },
  {
    label: 'Scala',
    value: EditorLanguageEnum.scala,
  },
  {
    label: 'SQL',
    value: EditorLanguageEnum.sql,
  },
  {
    label: 'Swift',
    value: EditorLanguageEnum.swift,
  },
]);
