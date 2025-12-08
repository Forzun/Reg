// src/llm/handlers.ts
import { generateChatCompletion } from "./openrouter";

export async function summarizeText(text: string) {
  const response = await generateChatCompletion({
    messages: [
      {
        role: "system",
        content: "You are a concise summarization assistant.",
      },
      { role: "user", content: `Summarize this:\n\n${text}` },
    ],
  });

  const content = response.choices?.[0]?.message?.content ?? "No response from model";

  return content;
}
