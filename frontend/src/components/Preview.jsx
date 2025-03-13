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
      // Save code to MongoDB
      await axios.post("http://localhost:5000/api/code/save", {
        language,
        code,
      });

      // Fetch the saved code and execute it
      const response = await axios.get(
        `http://localhost:5000/api/code/get/${language}`
      );

      if (response.data.code) {
        executeCode(response.data.code);
      } else {
        setOutput("No code found.");
      }
    } catch (error) {
      console.error("Error processing code:", error);
      setOutput("Error processing code.");
    }
  };

  const executeCode = (savedCode) => {
    switch (language) {
      case "javascript":
        executeJavaScript(savedCode);
        break;
      case "html":
        setOutput(savedCode);
        break;
      case "css":
        applyCSS(savedCode);
        setOutput("CSS applied!");
        break;
      case "markdown":
        renderMarkdown(savedCode);
        break;
      default:
        setOutput("Unsupported language");
    }
  };

  const executeJavaScript = (jsCode) => {
    try {
      let logs = [];
      const customLog = (...args) => logs.push(args.join(" "));

      const wrappedCode = `
      (function() {
        const originalLog = console.log;
        console.log = customLog;
        try {
          ${jsCode}
        } catch (err) {
          customLog('Error:', err.message);
        }
        console.log = originalLog;
      })();
    `;

      setTimeout(() => {
        new Function("customLog", wrappedCode)(customLog);
        setOutput(logs.join("\n") || "No output");
      }, 100); // Adding slight delay
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const applyCSS = (cssCode) => {
    let styleElement = document.getElementById("dynamic-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "dynamic-style";
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = ""; // Clear previous styles
    styleElement.innerHTML = cssCode; // Apply new styles
  };

  const renderMarkdown = (mdCode) => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const rawHtml = marked.parse(mdCode);
    setOutput(DOMPurify.sanitize(rawHtml));
  };

  return (
    <div className="preview-container">
      <button onClick={handlePreview}>Preview</button>
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
