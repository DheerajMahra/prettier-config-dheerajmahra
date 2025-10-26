# @dheerajmahra/prettier-config

A simple Prettier config for my personal projects 💅🏻

![NPM Version](https://img.shields.io/npm/v/@dheerajmahra/prettier-config)

## Quick Setup (Recommended)

The easiest way to set up this config is to use the CLI utility. It will automatically:
1. Install the package
2. Create `.prettierrc` file
3. Create `.prettierignore` file

Run one of the following commands in your project directory:

```bash
# Using npx (npm)
npx @dheerajmahra/prettier-config

# Using pnpm
pnpm dlx @dheerajmahra/prettier-config

# Using yarn
yarn dlx @dheerajmahra/prettier-config
```

That's it! Your project is now configured with Prettier 🎉

## Manual Setup

If you prefer to set up manually:

### 1. Install the package

```bash
npm install --save-dev @dheerajmahra/prettier-config
# or
pnpm add -D @dheerajmahra/prettier-config
# or
yarn add -D @dheerajmahra/prettier-config
```

### 2. Create `.prettierrc` file

Create a `.prettierrc` file in your project root with:

```json
"@dheerajmahra/prettier-config"
```

### 3. Create `.prettierignore` file (optional)

Create a `.prettierignore` file to exclude files from formatting:

```
node_modules
dist
build
coverage
*.log
.env
package-lock.json
yarn.lock
pnpm-lock.yaml
```

## Usage

After setup, you can format your code using:

```bash
# Format all files
npx prettier --write .

# Format specific files
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"

# Check formatting (CI/CD)
npx prettier --check .
```

## License

MIT
