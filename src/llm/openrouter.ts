import axios from "axios"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

if(!OPENROUTER_API_KEY){
    throw new Error("OPENROUTER_API_KEY is not working");
}

export async function generateChatCompletion({
    model = "nousresearch/hermes-3-llama-3.1-405b:free",
    messages
}: { 
    model?: string, 
    messages: { role: "user" | "assistant" | "system"; content: string }[];
}) { 
    console.log(messages)
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", 
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
)
    return response.data
}

