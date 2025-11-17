import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChunkData {
  content: string | null;
  type: "text" | "tool_calls" | null;
}

export function getContentFromChunk(chunk: string): ChunkData {
  let jsonStr = chunk.trim();

  // Handle SSE format (data: {...})
  if (jsonStr.startsWith("data: ")) {
    jsonStr = jsonStr.substring(6);
  }

  // Skip empty chunks
  if (!jsonStr) {
    return { content: null, type: null };
  }

  try {
    const parsedData = JSON.parse(jsonStr);

    // Check if this is a text or tool_calls message
    if (parsedData.type === "text" || parsedData.type === "tool_calls") {
      return {
        content: parsedData.content || null,
        type: parsedData.type,
      };
    }

    // Ignore "start" and "end" messages
    return { content: null, type: null };
  } catch (e) {
    console.error("Error parsing JSON from chunk:", e, "Chunk:", chunk);
    return { content: null, type: null };
  }
}
