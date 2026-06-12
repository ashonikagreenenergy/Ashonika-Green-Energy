import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize secure, server-side Gemini AI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Track active chat sessions per phone number to hold conversational memory
  const sessions = new Map<string, any>();
  // Local in-memory fallback store to ensure seamless offline/resilient OTP validation
  const fallbackStore = new Map<string, string>();

  // Standard API Endpoint for client-side OTP management
  app.post("/api/otp", async (req, res) => {
    try {
      const { action, phone, code } = req.body;
      if (!phone) {
        return res.status(400).json({ status: "failed", message: "Phone number is required." });
      }

      if (action !== "GENERATE" && action !== "VERIFY") {
        return res.status(400).json({ status: "failed", message: "Invalid action." });
      }

      // 1. Handle Verification with local fallback store as source of truth for robustness
      if (action === "VERIFY") {
        const cleanEnteredCode = (code || "").trim();
        const expectedCode = fallbackStore.get(phone);

        // Best effort: keep Gemini session in sync if available
        const chat = sessions.get(phone);
        if (chat) {
          chat.sendMessage({ message: `ACTION: VERIFY, PHONE: ${phone}, CODE: ${cleanEnteredCode}` }).catch(() => {});
        }

        if (expectedCode && cleanEnteredCode === expectedCode) {
          return res.json({ status: "verified", message: "OTP verification successful" });
        } else {
          return res.json({ status: "failed", message: "Invalid OTP code" });
        }
      }

      // 2. Handle Generation with Gemini model try-catch
      const fallbackLocalCode = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        let chat = sessions.get(phone);
        if (!chat) {
          chat = ai.chats.create({
            model: "gemini-3.5-flash",
            config: {
              systemInstruction: "You are a secure, lightweight OTP Verification Backend API for a website booking form. Your sole purpose is to manage OTP creation, simulation, and verification. You must strictly follow these rules:\n\n1. RESPOND ONLY IN RAW JSON. Do not include markdown formatting like ```json ... ```. Do not include any conversational filler text.\n2. If the user sends: \"ACTION: GENERATE, PHONE: [number]\", you must generate a random 6-digit OTP code, simulate sending it to that number, and return this exact JSON structure:\n{\"status\": \"success\", \"message\": \"OTP generated successfully\", \"debug_code\": \"XXXXXX\"}\n(Replace XXXXXX with the actual generated code for development purposes).\n3. You must maintain state in the conversation memory. If the user sends: \"ACTION: VERIFY, PHONE: [number], CODE: [user_entered_code]\", compare their code to the last code generated for that phone number.\n- If it matches, return: {\"status\": \"verified\", \"message\": \"OTP verification successful\"}\n- If it fails, return: {\"status\": \"failed\", \"message\": \"Invalid OTP code\"}\n4. Treat any other inputs as invalid requests and return an error JSON block."
            }
          });
          sessions.set(phone, chat);
        }

        const promptPayload = `ACTION: GENERATE, PHONE: ${phone}`;
        const response = await chat.sendMessage({ message: promptPayload });
        let textResult = response.text || "";

        // Clean up markdown formatting if returned by the model
        textResult = textResult.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

        const parsed = JSON.parse(textResult);
        if (parsed.status === "success" && parsed.debug_code) {
          fallbackStore.set(phone, parsed.debug_code);
          return res.json(parsed);
        }
      } catch (geminiError: any) {
        console.warn("Gemini service temporarily overloaded. Falling back to secure native local OTP generator.", geminiError.message || geminiError);
      }

      // Fallback response if Gemini is unavailable, rate-limited, or fails to parse
      fallbackStore.set(phone, fallbackLocalCode);
      return res.json({
        status: "success",
        message: "OTP generated successfully",
        debug_code: fallbackLocalCode
      });

    } catch (error: any) {
      console.error("General API OTP backend error:", error);
      return res.status(500).json({ status: "failed", message: "Unable to establish secure validation session." });
    }
  });

  // Integrate Vite dev server or serve static React files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
