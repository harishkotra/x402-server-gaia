#!/usr/bin/env bun

import { existsSync } from "fs";
import { join, dirname, resolve, relative } from "path";
import { mkdir, readdir, copyFile, stat } from "fs/promises";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function prompt(question: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function isValidProjectName(name: string): boolean {
  // Check for valid directory name
  if (!name || name.trim().length === 0) {
    return false;
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(name)) {
    return false;
  }
  
  // Check for reserved names (Windows)
  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
  if (reservedNames.test(name)) {
    return false;
  }
  
  return true;
}

// Files and directories to exclude from template
const EXCLUDE_PATTERNS = [
  "node_modules",
  ".git",
  ".DS_Store",
  "dist",
  "out",
  ".cache",
  "coverage",
  ".env",
  ".env.local",
  ".env.*.local",
  "*.log",
  ".eslintcache",
  "*.tsbuildinfo",
  ".idea",
];

function shouldExclude(filePath: string, templateDir: string): boolean {
  const relativePath = relative(templateDir, filePath);
  const pathParts = relativePath.split(/[/\\]/);
  
  // Check if any part of the path matches an exclude pattern
  for (const part of pathParts) {
    for (const pattern of EXCLUDE_PATTERNS) {
      // Simple pattern matching (supports wildcards)
      if (pattern.includes("*")) {
        const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
        if (regex.test(part)) {
          return true;
        }
      } else if (part === pattern) {
        return true;
      }
    }
  }
  
  return false;
}

async function copyTemplate(templateDir: string, targetDir: string): Promise<void> {
  async function copyRecursive(src: string, dest: string): Promise<void> {
    // Skip excluded files/directories
    if (shouldExclude(src, templateDir)) {
      return;
    }
    
    const stats = await stat(src);
    
    if (stats.isDirectory()) {
      // Create directory if it doesn't exist
      await mkdir(dest, { recursive: true });
      
      // Read directory contents
      const entries = await readdir(src);
      
      // Recursively copy each entry
      for (const entry of entries) {
        const srcPath = join(src, entry);
        const destPath = join(dest, entry);
        await copyRecursive(srcPath, destPath);
      }
    } else if (stats.isFile()) {
      // Copy file
      await copyFile(src, dest);
    }
  }
  
  try {
    await copyRecursive(templateDir, targetDir);
  } catch (error) {
    throw new Error(`Failed to copy template: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function createProject() {
  const args = process.argv.slice(2);
  let projectName = args[0];

  // Welcome message
  console.log("\n✨ Welcome to create-x402-app!");
  console.log("   Create a new Hono server application\n");

  // Get project name
  if (!projectName) {
    projectName = await prompt("What is your project named? ");
  }

  if (!isValidProjectName(projectName)) {
    console.error("\n❌ Error: Invalid project name");
    console.error("   Project name must be a valid directory name");
    process.exit(1);
  }

  const targetDir = resolve(process.cwd(), projectName);

  // Check if directory already exists
  if (existsSync(targetDir)) {
    const files = await import("fs/promises").then((fs) => fs.readdir(targetDir));
    if (files.length > 0) {
      console.error(`\n❌ Error: Directory "${projectName}" already exists and is not empty`);
      process.exit(1);
    }
  }

  // Get template directory
  const templateDir = join(__dirname, "template");

  if (!existsSync(templateDir)) {
    console.error(`\n❌ Error: Template directory not found at "${templateDir}"`);
    console.error("   Please create a 'template' directory with your Hono server code");
    process.exit(1);
  }

  // Create project directory
  try {
    await mkdir(targetDir, { recursive: true });
  } catch (error) {
    console.error(`\n❌ Error: Failed to create directory "${projectName}"`);
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // Copy template files
  console.log(`\n📦 Creating project in "${projectName}"...`);
  
  try {
    await copyTemplate(templateDir, targetDir);
  } catch (error) {
    console.error(`\n❌ Error: Failed to copy template files`);
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }

  // Success message
  console.log("\n✅ Project created successfully!");
  console.log("\n📝 Next steps:");
  console.log(`   cd ${projectName}`);
  console.log("   bun install");
  console.log("   bun run dev");
  console.log("\n");
}

// Run the CLI
createProject().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
