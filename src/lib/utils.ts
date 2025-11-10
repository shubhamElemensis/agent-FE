import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getContentFromChunk(chunk: string): string | null {
  let jsonStr = chunk.trim();

  // Handle SSE format (data: {...})
  if (jsonStr.startsWith("data: ")) {
    jsonStr = jsonStr.substring(6);
  }

  // Skip empty chunks
  if (!jsonStr) {
    return null;
  }

  try {
    const parsedData = JSON.parse(jsonStr);

    // Only extract content from "text" type messages
    if (parsedData.type === "text" && parsedData.content) {
      return parsedData.content;
    }

    // Ignore "start" and "end" messages
    return null;
  } catch (e) {
    console.error("Error parsing JSON from chunk:", e, "Chunk:", chunk);
    return null;
  }
}
