import React, { useState, useEffect } from "react";
import { marked } from "marked";
import "../styles/Preview.css";

const Preview = ({ code, language }) => {
  const [output, setOutput] = useState("");

  useEffect(() => {
    executeCode();
  }, [language, code]);

  const executeCode = () => {
    switch (language) {
      case "javascript":
        executeJavaScript();
        break;
      case "html":
        setOutput(code);
        break;
      case "css":
        applyCSS(code);
        setOutput("CSS applied!");
        break;
      case "markdown":
        renderMarkdown();
        break;
      default:
        setOutput("Unsupported language");
    }
  };

  const executeJavaScript = () => {
    try {
      let logs = [];
      const customLog = (...args) => logs.push(args.join(" "));

      const wrappedCode = `
        (function() {
          const originalLog = console.log;
          console.log = customLog;
          try {
            ${code}
          } catch (err) {
            customLog('Error:', err.message);
          }
          console.log = originalLog;
        })();
      `;

      new Function("customLog", wrappedCode)(customLog);
      setOutput(logs.join("\n") || "No output");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const applyCSS = (cssCode) => {
    let existingStyle = document.getElementById("dynamic-style");
    if (existingStyle) document.head.removeChild(existingStyle);
    let styleElement = document.createElement("style");
    styleElement.id = "dynamic-style";
    styleElement.innerHTML = cssCode;
    document.head.appendChild(styleElement);
  };

  const renderMarkdown = () => {
    setOutput(marked.parse(code));
  };

  return (
    <div className="preview-container">
      <div className="preview-content">
        <h3>Output:</h3>
        {language === "html" ? (
          <iframe
            title="html-preview"
            srcDoc={output}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : language === "markdown" ? (
          <div
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        ) : (
          <pre>{output}</pre>
        )}
      </div>
    </div>
  );
};

export default Preview;
