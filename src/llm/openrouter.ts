import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing");
}

export async function generateChatCompletion({
  messages,
  model = "deepseek/deepseek-chat-v3.1:free",
}: {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  model?: string;
}) {
  const res = await axios.post(
    `${OPENROUTER_BASE_URL}/chat/completions`,
    {
      model,
      messages,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}
