import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { html, instruction } = await req.json();
    
    // Check for GEMINI_API_KEY first (standard), then GEMINI_API_KEY (user's typo)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.error("GEMINI_API_KEY is missing or invalid");
      return new Response(JSON.stringify({ error: "Server configuration error: Invalid API Key" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
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

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (e) {
          console.error("Streaming error:", e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error("Error processing AI request:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
