import React, { useState } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Header from "./components/Header";
import "./styles/App.css";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("html");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="app">
      <Header />
      <div className="editor-preview-container">
        <Editor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
        />
        <Preview
          code={code}
          language={language}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      </div>
    </div>
  );
}

export default App;
