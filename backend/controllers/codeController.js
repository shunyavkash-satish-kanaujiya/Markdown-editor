const CodeSnippet = require("../models/CodeSnippet");

exports.saveCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const updatedSnippet = await CodeSnippet.findOneAndUpdate(
      { language }, // Find existing entry
      { code }, // Update code
      { new: true, upsert: true } // Return updated document or insert if missing
    );

    res
      .status(200)
      .json({ message: "Code saved successfully!", data: updatedSnippet });
  } catch (error) {
    res.status(500).json({ error: "Error saving code" });
  }
};

exports.getCode = async (req, res) => {
  try {
    const { language } = req.params;
    const snippet = await CodeSnippet.findOne({ language });

    if (snippet) {
      res.status(200).json({ code: snippet.code });
    } else {
      res.status(404).json({ message: "No code found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving code" });
  }
};
