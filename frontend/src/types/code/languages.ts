export enum EditorLanguageEnum {
  javascript = 'javascript',
  typescript = 'typescript',
  python = 'python',
  java = 'java',
  c = 'c',
  cpp = 'cpp',
  clojure = 'clojure',
  csharp = 'csharp',
  dart = 'dart',
  elixir = 'elixir',
  fsharp = 'fsharp',
  go = 'go',
  kotlin = 'kotlin',
  lua = 'lua',
  objectivec = 'objective-c',
  pascal = 'pascal',
  perl = 'perl',
  php = 'php',
  text = 'text',
  r = 'r',
  ruby = 'ruby',
  rust = 'rust',
  scala = 'scala',
  sql = 'sql',
  swift = 'swift',
}

export const EditorLanguageEnumToLabelMap: Record<EditorLanguageEnum, string> = Object.freeze({
  [EditorLanguageEnum.javascript]: 'Javascript',
  [EditorLanguageEnum.typescript]: 'Typescript',
  [EditorLanguageEnum.python]: 'Python',
  [EditorLanguageEnum.java]: 'Java',
  [EditorLanguageEnum.c]: 'C',
  [EditorLanguageEnum.cpp]: 'C++',
  [EditorLanguageEnum.clojure]: 'Clojure',
  [EditorLanguageEnum.csharp]: 'C#',
  [EditorLanguageEnum.dart]: 'Dart',
  [EditorLanguageEnum.elixir]: 'Elixir',
  [EditorLanguageEnum.fsharp]: 'F#',
  [EditorLanguageEnum.go]: 'Go',
  [EditorLanguageEnum.kotlin]: 'Kotlin',
  [EditorLanguageEnum.lua]: 'Lua',
  [EditorLanguageEnum.objectivec]: 'Objective-C',
  [EditorLanguageEnum.pascal]: 'Pascal',
  [EditorLanguageEnum.perl]: 'Perl',
  [EditorLanguageEnum.php]: 'PHP',
  [EditorLanguageEnum.text]: 'Plain Text',
  [EditorLanguageEnum.r]: 'R',
  [EditorLanguageEnum.ruby]: 'Ruby',
  [EditorLanguageEnum.rust]: 'Rust',
  [EditorLanguageEnum.scala]: 'Scala',
  [EditorLanguageEnum.sql]: 'SQL',
  [EditorLanguageEnum.swift]: 'Swift',
});

export const EditorLanguageOptions: ReadonlyArray<{ label: string; value: EditorLanguageEnum }> = Object.freeze([
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.javascript],
    value: EditorLanguageEnum.javascript,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.typescript],
    value: EditorLanguageEnum.typescript,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.python],
    value: EditorLanguageEnum.python,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.java],
    value: EditorLanguageEnum.java,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.c],
    value: EditorLanguageEnum.c,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.cpp],
    value: EditorLanguageEnum.cpp,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.clojure],
    value: EditorLanguageEnum.clojure,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.csharp],
    value: EditorLanguageEnum.csharp,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.dart],
    value: EditorLanguageEnum.dart,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.elixir],
    value: EditorLanguageEnum.elixir,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.fsharp],
    value: EditorLanguageEnum.fsharp,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.go],
    value: EditorLanguageEnum.go,
  },
  {
    label: 'Kotlin',
    value: EditorLanguageEnum.kotlin,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.lua],
    value: EditorLanguageEnum.lua,
  },
  {
    label: 'Objective-C',
    value: EditorLanguageEnum.objectivec,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.pascal],
    value: EditorLanguageEnum.pascal,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.perl],
    value: EditorLanguageEnum.perl,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.php],
    value: EditorLanguageEnum.php,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.text],
    value: EditorLanguageEnum.text,
  },
  {
    label: 'R',
    value: EditorLanguageEnum.r,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.ruby],
    value: EditorLanguageEnum.ruby,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.rust],
    value: EditorLanguageEnum.rust,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.scala],
    value: EditorLanguageEnum.scala,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.sql],
    value: EditorLanguageEnum.sql,
  },
  {
    label: EditorLanguageEnumToLabelMap[EditorLanguageEnum.swift],
    value: EditorLanguageEnum.swift,
  },
]);
