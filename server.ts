import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Routes
  app.post("/api/update-html", async (req, res) => {
    try {
      const { html, instruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      // Log key status (do not log the full key)
      if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is undefined or empty.");
      } else if (apiKey === "MY_GEMINI_API_KEY") {
        console.error("Error: GEMINI_API_KEY is set to the placeholder value.");
      } else {
        console.log(`Processing request with API key (length: ${apiKey.length})`);
      }

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        res.status(500).json({ 
          error: "Configuration Error: GEMINI_API_KEY is missing or invalid. Please set it in your environment variables or AI Studio secrets." 
        });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are an expert web developer.
        
        Task: Update the following HTML code based on the user's instructions.
        
        User Instruction: "${instruction}"
        
        Original HTML Code:
        \`\`\`html
        ${html}
        \`\`\`
        
        Requirements:
        1. Return ONLY the updated HTML code.
        2. Do not include markdown code fences (e.g., \`\`\`html ... \`\`\`).
        3. Do not include any explanations or conversational text.
        4. Ensure the code is valid HTML.
        5. If the original code is empty, generate a complete HTML structure based on the instruction.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleanedText = text.replace(/^```html\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

      res.json({ html: cleanedText });
    } catch (error) {
      console.error("Error processing AI request:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving would go here if we were building for prod
    // But for this environment, we usually rely on the dev server or a build step
    // For the "preview" environment here, we run in dev mode usually?
    // Actually, the instructions say "Deployment Build System" -> "start": "node server.ts"
    // And "Build Phase" -> "npm run build".
    // So in production, we need to serve dist.
    
    // Let's add static serving for production
    const path = await import("path");
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
