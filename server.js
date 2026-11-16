const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Frontend files
app.use(express.static("public"));

// Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        reply: "Please enter a question."
      });
    }

    // AI College Assistant Prompt
    const prompt = `
You are an AI College Assistant for Shambhunath Group of Institutions.

COLLEGE INFORMATION:
College Name: Shambhunath Group of Institutions

Your main job is to help college students.

You can help students with:
- College information
- Courses and subjects
- Assignments
- Exams
- Study questions
- Programming questions
- Projects
- Notes
- Timetable
- General student guidance

IMPORTANT RULES:
1. Give simple and easy-to-understand answers.
2. Explain difficult topics step by step.
3. Be polite and helpful.
4. If you do not know college-specific information, clearly say that you do not have that information.
5. Never make up college-specific information.
6. For programming questions, provide clear examples when useful.
7. Answer in the same language as the student whenever possible.

Student Question:
${userMessage}

Answer:
`;

    // Connect to Ollama
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "llama3.2",
          prompt: prompt,
          stream: false
        })
      }
    );

    if (!response.ok) {
      throw new Error("Ollama request failed");
    }

    const data = await response.json();

    // Send AI answer to frontend
    res.json({
      reply: data.response
    });

  } catch (error) {

    console.error("Error:", error);

    res.status(500).json({
      reply:
        "❌ AI से connection नहीं हो पाया। कृपया check करें कि Ollama चल रहा है।"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});