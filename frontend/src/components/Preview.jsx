import React, { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import axios from "axios";
import "../styles/Preview.css";
import "github-markdown-css";

const Preview = ({ code, language }) => {
  const [output, setOutput] = useState("");

  const handlePreview = async () => {
    try {
      await axios.post(
        "https://markdown-editor-yb16.onrender.com/api/code/save",
        {
          language,
          code,
        }
      );
      const response = await axios.get(
        `https://markdown-editor-yb16.onrender.com/api/code/get/${language}`
      );
      setOutput(
        response.data.code ? processCode(response.data.code) : "No code found."
      );
    } catch (error) {
      setOutput("Error processing code.", error);
    }
  };

  const processCode = (savedCode) => {
    if (language === "javascript") return executeJavaScript(savedCode);
    if (language === "html") return savedCode;
    if (language === "css") return applyCSS(savedCode);
    if (language === "markdown") return renderMarkdown(savedCode);
    return "Unsupported language";
  };

  const executeJavaScript = (jsCode) => {
    try {
      let logs = [];
      const customLog = (...args) => logs.push(args.join(" "));

      const wrappedCode = `
      (function() {
        const originalLog = console.log;
        console.log = (...args) => customLog(args.join(" "));
        try {
          ${jsCode}
        } catch (err) {
          customLog('Error:', err.message);
        }
        console.log = originalLog;
      })();
    `;

      new Function("customLog", wrappedCode)(customLog); // Passing customLog as an argument
      return logs.join("\n") || "No output";
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const applyCSS = (cssCode) => {
    let styleElement =
      document.getElementById("dynamic-style") ||
      document.createElement("style");
    styleElement.id = "dynamic-style";
    document.head.appendChild(styleElement);
    styleElement.innerHTML = cssCode;
    return "CSS applied!";
  };

  const renderMarkdown = (mdCode) => DOMPurify.sanitize(marked.parse(mdCode));

  return (
    <div className="preview-container">
      <button onClick={handlePreview} className="preview-btn">
        Preview
      </button>
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
            className="markdown-preview markdown-body"
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
