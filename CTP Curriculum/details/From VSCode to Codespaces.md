## Overview: Your Familiar VSCode, Now in the Cloud

If you're comfortable with VSCode on your Mac, PC, or WSL setup, you're already 90% ready for GitHub Codespaces. Think of Codespaces as your exact VSCode environment, but running on a powerful cloud machine that you can access from anywhere—even an iPad or Chromebook.

## Key Concept: It's Still VSCode

**What stays the same:**

- The entire VSCode interface and layout
- Your keyboard shortcuts (Cmd/Ctrl patterns work identically)
- Extension ecosystem (most extensions work without modification)
- Settings sync (if you're signed into GitHub/Microsoft account)
- Git integration and source control panel
- Integrated terminal
- Debugging tools
- IntelliSense and code completion

**What's different:**

- Your code lives on a cloud machine, not your local drive
- Terminal commands execute on the Linux container, not your Mac/PC
- File system is ephemeral (temporary) unless saved to the repository
- Network requests originate from the cloud machine's IP

## Three Ways to Access Codespaces

### 1. **Browser-Based** (github.dev)

- Press `.` (period) in any GitHub repository
- Full VSCode experience in your browser
- Best for: Quick edits, reviewing code, working on restricted machines

### 2. **VSCode Desktop Application** (Recommended for Fellowship)

- Open your local VSCode
- Install "GitHub Codespaces" extension
- Connect to codespace via Command Palette: `Codespaces: Connect to Codespace`
- **This feels exactly like local development** but compute happens in cloud

### 3. **GitHub CLI**

```bash
gh codespace create --repo username/repository
gh codespace code  # Opens in local VSCode
```

## Initial Setup for Fellowship Projects

### Creating Your First Codespace

1. **From GitHub Repository:**
    
    - Click green "Code" button → "Codespaces" tab → "Create codespace on main"
    - Or use keyboard shortcut: Press `.` when viewing repo
2. **Machine Types:**
    
    - 2-core (Basic): Sufficient for React development
    - 4-core (Recommended): Better for full-stack with databases
    - 8-core: Only if running multiple services simultaneously
3. **Configuration via `.devcontainer/devcontainer.json`:**
    

```json
{
  "name": "Web Fellowship Environment",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/aws-cli:1": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "forwardPorts": [3000, 5432, 8000],
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "GitHub.copilot",
        "prisma.prisma"
      ],
      "settings": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true
      }
    }
  }
}
```

## Key Differences & Adaptations

### File System Behavior

**Local VSCode:**

- Files saved directly to your hard drive
- Changes persist until you delete them
- Can access any file on your machine

**Codespaces:**

- Files exist in container's file system
- Only repository files persist after codespace stops
- Use `/tmp` for temporary files (cleared on rebuild)
- Home directory (`~`) persists across rebuilds but not deletion

**💡 Fellowship Tip:** Always commit and push important changes. Treat uncommitted work as temporary.

### Terminal Differences

**Local Mac:**

```bash
brew install postgresql
open http://localhost:3000  # Opens in default browser
```

**Local Windows (WSL):**

```bash
sudo apt-get install postgresql
explorer.exe http://localhost:3000
```

**Codespaces (Always Linux):**

```bash
sudo apt-get update && sudo apt-get install postgresql
# Ports auto-forward, access via Ports panel or generated URL
```

### Port Forwarding Magic

Unlike local development where you manually navigate to `localhost:3000`, Codespaces:

- Automatically detects when processes start listening on ports
- Provides secure HTTPS URLs for each port
- Shows all active ports in "Ports" panel (Terminal → Ports tab)

**Example URLs:**

- Local: `http://localhost:3000`
- Codespaces: `https://username-repo-randomstring-3000.preview.app.github.dev`

### Environment Variables

**Local Setup:**

- `.env.local` files on your machine
- System environment variables
- Manual configuration per project

**Codespaces Best Practices:**

```bash
# Option 1: Repository Secrets (for sensitive data)
# Settings → Secrets → Codespaces → New secret

# Option 2: .env files (for non-sensitive config)
# Add .env.example to repo, .env to .gitignore

# Option 3: User-specific secrets (across all codespaces)
# Personal settings → Codespaces → Secrets
```

## Essential Workflows for the Fellowship

### Daily Development Flow

1. **Starting Work:**

```bash
# Open existing codespace (30-second resume)
gh codespace code

# Or via VSCode: Cmd/Ctrl+Shift+P → "Codespaces: Connect"
```

2. **Development with Next.js:**

```bash
npm run dev
# Check Ports panel for URL
# Share port publicly for team review (right-click → Port Visibility → Public)
```

3. **Ending Work Session:**

```bash
git add -A
git commit -m "WIP: Feature description"
git push
# Codespace auto-stops after 30 min inactivity (default)
```

### Database Development

**LocalStack for AWS Services:**

```bash
# Runs entirely within codespace
docker-compose up -d localstack
aws --endpoint-url=http://localhost:4566 dynamodb list-tables
```

**PostgreSQL with Aurora DSQL:**

```bash
# Connection string uses forwarded port
DATABASE_URL="postgresql://user:pass@localhost:5432/fellowship_db"
```

### Team Collaboration Features

**Live Share (Built-in):**

- Click "Live Share" in status bar
- Team members join your exact environment
- Shared terminals, debugging sessions, servers

**Pull Request Reviews:**

- Open PR in browser
- Click "Open in Codespace" to test changes
- Isolated environment for each PR

## Performance Optimization Tips

### 1. **Prebuild Configuration**

Add to `.github/workflows/codespaces-prebuild.yml`:

```yaml
name: Codespace Prebuild
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  prebuild:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: github/codespaces-prebuild@v1
```

### 2. **Use VSCode Desktop for Heavy Development**

- Browser version works everywhere but desktop is faster
- Desktop app maintains websocket connection better
- Local keyboard shortcuts always work correctly

### 3. **Optimize Extensions**

```json
// .vscode/settings.json
{
  "extensions.ignoreRecommendations": false,
  "remote.autoForwardPorts": true,
  "remote.autoForwardPortsSource": "process"
}
```

## Common Issues & Solutions

### "My changes disappeared!"

**Issue:** Codespace was deleted or rebuilt without pushing changes

**Solution:**

- Enable auto-save: `"files.autoSave": "afterDelay"`
- Set up GitHub's auto-commit feature
- Always push before stopping work

### "Command not found" errors

**Issue:** Tool installed in previous session not available

**Solution:** Add installations to `postCreateCommand`:

```json
{
  "postCreateCommand": "npm install && pip install -r requirements.txt"
}
```

### "Can't connect to database"

**Issue:** Database running but connection refused

**Solution:** Use `127.0.0.1` instead of `localhost` in connection strings:

```javascript
// Works in Codespaces
const dbUrl = process.env.DATABASE_URL || 'postgresql://user:pass@127.0.0.1:5432/db'
```

### "Port forwarding not working"

**Issue:** Next.js or other service not accessible

**Solution:**

```javascript
// next.config.js - bind to all interfaces
module.exports = {
  server: {
    host: '0.0.0.0',  // Not just localhost
    port: 3000
  }
}
```

## GitHub Copilot Integration

Works identically to local VSCode:

- `Tab` to accept suggestions
- `Cmd/Ctrl + Enter` for inline chat
- `Cmd/Ctrl + I` for chat panel

**Fellowship-Specific Prompts:**

```javascript
// Prompt: Create a React component using TypeScript that fetches expenses from AWS Lambda

// Prompt: Add Tailwind classes for a responsive expense card with hover effects

// Prompt: Write a Vitest unit test for the ExpenseTracker component
```

## Resource Management

### Storage

- **Free tier:** 15 GB/month
- **Codespace size:** ~1-2 GB for Node projects
- **Tip:** Delete stopped codespaces you won't use for a week+

### Compute Hours

- **Free tier:** 60 hours/month (4-core), 90 using the student pack
- **Auto-stop:** Configure to 30 minutes
- **Tip:** Stop manually when taking breaks

### Commands for Management

```bash
# List all codespaces
gh codespace list

# Delete specific codespace
gh codespace delete -c codespace-name

# Stop current codespace
gh codespace stop
```

## Advanced Tips for Power Users

### 1. **Dotfiles Repository**

- Create repo named `dotfiles` with your configurations
- Auto-applies to every new codespace
- Include: `.bashrc`, `.gitconfig`, VSCode settings

### 2. **Custom Docker Images**

```dockerfile
FROM mcr.microsoft.com/devcontainers/javascript-node:20
RUN npm install -g pnpm @aws-amplify/cli
COPY . /workspace
```

### 3. **Secrets Management**

```bash
# Set user-level secret (all codespaces)
gh secret set AWS_ACCESS_KEY_ID

# Set repository-level secret
gh secret set DATABASE_URL --repo username/project
```

### 4. **Keyboard Shortcuts**

Same as local VSCode, plus:

- `Cmd/Ctrl + Shift + P` → "Codespaces: " for all commands
- `F1` → Quick access to codespace-specific actions

## Migration Checklist

- [ ] Install GitHub Codespaces extension in local VSCode
- [ ] Sign into GitHub in VSCode
- [ ] Create `.devcontainer/devcontainer.json` in project
- [ ] Move environment variables to Codespace Secrets
- [ ] Test project runs with `npm run dev`
- [ ] Verify database connections work
- [ ] Configure auto-stop timeout
- [ ] Set up prebuilds for faster starts
- [ ] Share codespace URL with team for testing

## Fellowship-Specific Configuration

For the expense tracker and team projects, your optimal setup:

```json
{
  "name": "Fellowship Web Dev",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/aws-cli:1": {},
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "forwardPorts": [3000, 5432, 4566],
  "portsAttributes": {
    "3000": {
      "label": "Next.js App",
      "onAutoForward": "openBrowser"
    },
    "5432": {
      "label": "PostgreSQL"
    },
    "4566": {
      "label": "LocalStack"
    }
  },
  "postCreateCommand": "npm install && npm run db:migrate",
  "remoteUser": "node"
}
```

## Summary: Embrace the Cloud Development Mindset

**Think of Codespaces as:**

- Your VSCode, accessible from any device
- A consistent environment your entire team shares
- A way to never say "works on my machine" again
- Zero setup time for new team members

**Key behavioral changes:**

- Commit more frequently (every feature, not every day)
- Trust the cloud (your code is safer than on your laptop)
- Use disposable environments (spin up codespaces for experiments)
- Leverage sharing features for debugging with teammates

The transition from local VSCode to Codespaces is less about learning new tools and more about embracing cloud-first development practices. Your muscle memory, workflows, and extensions all transfer directly—you're just running them on a more powerful, more accessible, and more collaborative platform.