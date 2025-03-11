import React, { useEffect } from "react";
import MonacoEditor from "react-monaco-editor";
import "../styles/Editor.css";

const languages = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "markdown", label: "Markdown" },
];

const defaultCodeSnippets = {
  html: "<h1>Hello, HTML!</h1>",
  css: "body { background-color: #f4f4f9; }",
  javascript: "console.log('Hello, JavaScript!');",
  markdown: "# Hello, Markdown!\n\nThis is **bold** text.",
};

const Editor = ({ code, setCode, language, setLanguage }) => {
  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: false },
  };

  useEffect(() => {
    setCode(defaultCodeSnippets[language]);
  }, [language]);

  return (
    <div className="editor-container">
      <div className="language-selector">
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <MonacoEditor
        language={language === "markdown" ? "plaintext" : language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={setCode}
      />
    </div>
  );
};

export default Editor;
