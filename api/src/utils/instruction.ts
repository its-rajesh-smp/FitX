import fs from "fs";
import path from "path";

export function loadInstruction(fileName: string): string {
  const filePath = path.resolve(process.cwd(), "instructions", fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Instruction file not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
}
