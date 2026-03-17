<?php

namespace App\Enums;

/**
 * スニペットで使用可能なプログラミング言語を表す
 */
enum Language: string
{
    case Php = 'php';
    case Javascript = 'javascript';
    case Typescript = 'typescript';
    case Python = 'python';
    case Java = 'java';
    case Go = 'go';
    case Rust = 'rust';
    case Ruby = 'ruby';
    case C = 'c';
    case Cpp = 'cpp';
    case Csharp = 'csharp';
    case Swift = 'swift';
    case Kotlin = 'kotlin';
    case Html = 'html';
    case Css = 'css';
    case Sql = 'sql';
    case Bash = 'bash';
    case Json = 'json';
    case Yaml = 'yaml';
    case Xml = 'xml';
    case Markdown = 'markdown';
    case Plaintext = 'plaintext';
}
