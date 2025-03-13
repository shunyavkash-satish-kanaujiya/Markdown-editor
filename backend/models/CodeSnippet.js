const mongoose = require("mongoose");

const CodeSnippetSchema = new mongoose.Schema({
  language: { type: String, required: true },
  code: { type: String, required: true },
});

module.exports = mongoose.model("CodeSnippet", CodeSnippetSchema);
