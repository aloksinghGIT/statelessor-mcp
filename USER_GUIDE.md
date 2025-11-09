# Statelessor MCP Server - User Guide

## What is This?

Statelessor MCP Server connects Amazon Q Developer to the Statelessor API for analyzing .NET and Java projects for stateful code patterns that prevent cloud migration.

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g statelessor-mcp
```

### Option 2: Install from source

```bash
git clone https://github.com/aloksinghGIT/statelessor-mcp.git
cd statelessor-mcp
npm install
npm link
```

## Amazon Q Configuration

### Step 1: Create MCP Configuration File

**macOS/Linux:**
```bash
mkdir -p ~/.aws/amazonq
cat > ~/.aws/amazonq/mcp-config.json << 'EOF'
{
  "mcpServers": {
    "statelessor": {
      "command": "npx",
      "args": ["statelessor-mcp"],
      "env": {
        "STATELESSOR_API_URL": "https://statelessor-api.port2aws.pro"
      }
    }
  }
}
EOF
```

**Windows (PowerShell):**
```powershell
$configPath = "$env:USERPROFILE\.aws\amazonq"
New-Item -ItemType Directory -Force -Path $configPath

@'
{
  "mcpServers": {
    "statelessor": {
      "command": "npx",
      "args": ["statelessor-mcp"],
      "env": {
        "STATELESSOR_API_URL": "https://statelessor-api.port2aws.pro"
      }
    }
  }
}
'@ | Out-File -FilePath "$configPath\mcp-config.json" -Encoding UTF8
```

### Step 2: Restart Amazon Q

- **VS Code:** Reload window (Cmd/Ctrl + Shift + P → "Reload Window")
- **JetBrains IDEs:** Restart IDE

### Step 3: Verify Connection

In Amazon Q chat:
```
You: List available MCP tools
```

You should see 5 Statelessor tools listed.

## Usage Examples

### Analyze Local Project

```
You: Analyze my local .NET project at /Users/john/projects/my-app
```

### Analyze Git Repository

```
You: Analyze the Git repository https://github.com/myorg/legacy-app
```

### Get Remediation Guidance

```
You: Explain how to fix Session State issues in .NET

You: How do I remediate Static Mutable Fields in Java?
```

### Generate Analysis Script

```
You: Generate a bash script for analyzing .NET projects

You: Create a PowerShell script for Java analysis
```

### Retrieve Historical Findings

```
You: Get findings for project "my-legacy-app"
```

## Troubleshooting

### MCP Server Not Found

**Error:** "Command not found: statelessor-mcp"

**Solution:**
```bash
# Verify installation
npm list -g statelessor-mcp

# Reinstall if needed
npm install -g statelessor-mcp
```

### API Connection Failed

**Error:** "ECONNREFUSED" or "API timeout"

**Solution:**
1. Check API URL in mcp-config.json
2. Verify API is accessible:
   ```bash
   curl https://statelessor-api.port2aws.pro/health
   ```
3. Check firewall/proxy settings

### Amazon Q Not Detecting MCP Server

**Solution:**
1. Verify config file location:
   ```bash
   cat ~/.aws/amazonq/mcp-config.json
   ```
2. Check JSON syntax (use jsonlint.com)
3. Restart IDE completely
4. Check Amazon Q extension logs

### File Upload Errors

**Error:** "File too large" or "Upload failed"

**Solution:**
- Maximum project size: 100MB
- Exclude node_modules, bin, obj folders
- Check project directory permissions

## Advanced Configuration

### Custom API Endpoint

For local development or custom deployments:

```json
{
  "mcpServers": {
    "statelessor": {
      "command": "npx",
      "args": ["statelessor-mcp"],
      "env": {
        "STATELESSOR_API_URL": "http://localhost:3001",
        "STATELESSOR_API_TIMEOUT": "600000"
      }
    }
  }
}
```

### Using Local Development Version

```json
{
  "mcpServers": {
    "statelessor-dev": {
      "command": "node",
      "args": ["/absolute/path/to/statelessor-mcp/mcp-server.js"],
      "env": {
        "STATELESSOR_API_URL": "http://localhost:3001"
      }
    }
  }
}
```

## Support

- **Issues:** https://github.com/aloksinghGIT/statelessor-mcp/issues
- **Documentation:** https://github.com/aloksinghGIT/statelessor-mcp
- **API Status:** https://statelessor-api.port2aws.pro/health