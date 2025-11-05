import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getContentFromChunk(chunk: string): string | null {
  // Parse SSE format (data: {...})
  if (chunk.startsWith("data: ")) {
    const jsonStr = chunk.substring(6); // Remove "data: " prefix
    try {
      const parsedData = JSON.parse(jsonStr);
      if (parsedData.content) {
        return parsedData.content;
      }
    } catch (e) {
      console.error("Error parsing JSON from chunk:", e);
      return null;
    }
  }
  return null;
}
