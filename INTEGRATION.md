# Amazon Q Integration Guide

## Overview

This guide explains how the Statelessor MCP Server integrates with Amazon Q Developer.

## Architecture

```
┌─────────────────┐
│   Amazon Q      │
│   (IDE Plugin)  │
└────────┬────────┘
         │ stdio (local process)
         ▼
┌─────────────────┐
│ Statelessor MCP │
│ Server (Local)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│ Statelessor API │
│ (AWS EC2)       │
└─────────────────┘
```

## How It Works

1. **User asks question in Amazon Q**
   - Example: "Analyze my .NET project at /path/to/app"

2. **Amazon Q spawns MCP server locally**
   - Runs as child process using stdio transport
   - Uses configuration from ~/.aws/amazonq/mcp-config.json

3. **MCP server processes request**
   - Validates input parameters
   - Zips project files (for local analysis)
   - Calls Statelessor API via HTTPS

4. **API analyzes code**
   - Scans for stateful patterns
   - Generates findings and recommendations

5. **Results returned to Amazon Q**
   - MCP server formats results
   - Amazon Q displays in chat

## MCP Configuration Format

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "<executable>",
      "args": ["<arg1>", "<arg2>"],
      "env": {
        "<ENV_VAR>": "<value>"
      }
    }
  }
}
```

## Testing Integration

### 1. Verify MCP Server Installation

```bash
# Check if installed
which statelessor-mcp

# Test manually
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npx statelessor-mcp
```

### 2. Verify Amazon Q Configuration

```bash
# Check config file exists
cat ~/.aws/amazonq/mcp-config.json

# Validate JSON syntax
python -m json.tool ~/.aws/amazonq/mcp-config.json
```

### 3. Test in Amazon Q

```
You: List available MCP tools
```

Expected: Should see 5 Statelessor tools

### 4. Test Tool Execution

```
You: Generate a bash script for analyzing .NET projects
```

Expected: Should receive a bash script with instructions

## Debugging

### Enable MCP Debug Logging

Add to mcp-config.json:

```json
{
  "mcpServers": {
    "statelessor": {
      "command": "npx",
      "args": ["statelessor-mcp"],
      "env": {
        "STATELESSOR_API_URL": "https://statelessor-api.port2aws.pro",
        "DEBUG": "*"
      }
    }
  }
}
```

### Check Amazon Q Logs

**VS Code:**
- Output panel → Amazon Q Language Server

**JetBrains:**
- Help → Show Log in Finder/Explorer

### Test MCP Server Directly

```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector npx statelessor-mcp

# Test with manual input
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  STATELESSOR_API_URL=https://statelessor-api.port2aws.pro \
  npx statelessor-mcp