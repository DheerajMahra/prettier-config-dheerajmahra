#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for better terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m"
};

const log = {
  info: msg => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: msg => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: msg => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: msg => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: msg => console.log(`\n${colors.bright}${msg}${colors.reset}\n`)
};

function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.includes("pnpm")) return "pnpm";
    if (userAgent.includes("yarn")) return "yarn";
    if (userAgent.includes("npm")) return "npm";
  }

  // Check for lock files
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  if (fs.existsSync("package-lock.json")) return "npm";

  // Default to npm
  return "npm";
}

function createPrettierrc() {
  const prettierrcPath = path.join(process.cwd(), ".prettierrc");

  if (fs.existsSync(prettierrcPath)) {
    log.warn(".prettierrc already exists. Skipping...");
    return false;
  }

  const prettierrcContent = `"@dheerajmahra/prettier-config"`;

  fs.writeFileSync(prettierrcPath, prettierrcContent, "utf8");
  log.success("Created .prettierrc");
  return true;
}

function createPrettierignore() {
  const prettierignorePath = path.join(process.cwd(), ".prettierignore");

  if (fs.existsSync(prettierignorePath)) {
    log.warn(".prettierignore already exists. Skipping...");
    return false;
  }

  const templatePath = path.join(__dirname, "..", "templates", ".prettierignore");

  try {
    const prettierignoreContent = fs.readFileSync(templatePath, "utf8");
    fs.writeFileSync(prettierignorePath, prettierignoreContent, "utf8");
    log.success("Created .prettierignore");
    return true;
  } catch (error) {
    log.error("Failed to create .prettierignore from template");
    console.error(error.message);
    return false;
  }
}

function createVSCodeSettings() {
  const vscodeDirPath = path.join(process.cwd(), ".vscode");
  const settingsPath = path.join(vscodeDirPath, "settings.json");

  // Create .vscode directory if it doesn't exist
  if (!fs.existsSync(vscodeDirPath)) {
    fs.mkdirSync(vscodeDirPath, { recursive: true });
  }

  if (fs.existsSync(settingsPath)) {
    // If settings.json exists, merge with existing settings
    try {
      const existingSettings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
      const templatePath = path.join(__dirname, "..", "templates", "settings.json");
      const newSettings = JSON.parse(fs.readFileSync(templatePath, "utf8"));

      const mergedSettings = { ...existingSettings, ...newSettings };
      fs.writeFileSync(settingsPath, JSON.stringify(mergedSettings, null, 2), "utf8");
      log.success("Updated .vscode/settings.json with Prettier configuration");
      return true;
    } catch (error) {
      log.error("Failed to update .vscode/settings.json");
      console.error(error.message);
      return false;
    }
  } else {
    // Create new settings.json
    const templatePath = path.join(__dirname, "..", "templates", "settings.json");

    try {
      const settingsContent = fs.readFileSync(templatePath, "utf8");
      fs.writeFileSync(settingsPath, settingsContent, "utf8");
      log.success("Created .vscode/settings.json");
      return true;
    } catch (error) {
      log.error("Failed to create .vscode/settings.json from template");
      console.error(error.message);
      return false;
    }
  }
}

function installPackage(packageManager) {
  const packageName = "@dheerajmahra/prettier-config";

  log.info(`Installing ${packageName} with ${packageManager}...`);

  try {
    let command;
    switch (packageManager) {
      case "pnpm":
        command = `pnpm add -D ${packageName}`;
        break;
      case "yarn":
        command = `yarn add -D ${packageName}`;
        break;
      case "npm":
      default:
        command = `npm install --save-dev ${packageName}`;
        break;
    }

    execSync(command, { stdio: "inherit" });
    log.success(`Installed ${packageName}`);
    return true;
  } catch (error) {
    log.error(`Failed to install ${packageName}`);
    console.error(error.message);
    return false;
  }
}

function checkPackageJson() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    log.error("package.json not found in current directory");
    log.info("Please run this command in a project with package.json");
    process.exit(1);
  }
}

function isPrettierInstalled() {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    return allDeps.hasOwnProperty("prettier");
  } catch (error) {
    return false;
  }
}

function installPrettier(packageManager) {
  log.info(`Installing prettier with ${packageManager}...`);

  try {
    let command;
    switch (packageManager) {
      case "pnpm":
        command = "pnpm add --save-dev --save-exact prettier";
        break;
      case "yarn":
        command = "yarn add --dev --exact prettier";
        break;
      case "npm":
      default:
        command = "npm install --save-dev --save-exact prettier";
        break;
    }

    execSync(command, { stdio: "inherit" });
    log.success("Installed prettier");
    return true;
  } catch (error) {
    log.error("Failed to install prettier");
    console.error(error.message);
    return false;
  }
}

async function main() {
  log.header("💅🏻 Setting up Prettier Config by Dheeraj Mahra");

  // Check if package.json exists
  checkPackageJson();

  const packageManager = detectPackageManager();
  log.info(`Detected package manager: ${packageManager}`);

  // Step 1: Check and install prettier if not present
  if (!isPrettierInstalled()) {
    const prettierInstalled = installPrettier(packageManager);
    if (!prettierInstalled) {
      log.warn("Could not install prettier automatically. You can install it manually later.");
    }
  }

  // Step 2: Install the prettier config package
  const installed = installPackage(packageManager);
  if (!installed) {
    log.error("Setup failed. Could not install package.");
    process.exit(1);
  }

  // Step 3: Create .prettierrc
  createPrettierrc();

  // Step 4: Create .prettierignore
  createPrettierignore();

  // Step 5: Create .vscode/settings.json
  createVSCodeSettings();

  // Success message
  log.header("✨ Setup complete!");
  log.info("You can now use prettier with your new config:");
  console.log(`  ${colors.bright}${packageManager === "pnpm" ? "pnpm" : packageManager === "yarn" ? "yarn" : "npx"} prettier --write .${colors.reset}`);
  console.log("");
  log.info("VS Code is now configured to format on save using Prettier!");
  console.log("");
}

main().catch(error => {
  log.error("An error occurred while setting up Prettier Configs:");
  console.error(error);
  process.exit(1);
});

