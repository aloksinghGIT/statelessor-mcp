# Statelessor MCP Server

MCP (Model Context Protocol) server for analyzing .NET and Java projects for stateful code patterns. Integrates with Amazon Q Developer.

## Installation

```bash
npm install -g statelessor-mcp
```

## Quick Start

### 1. Configure Amazon Q

Create or edit `~/.aws/amazonq/mcp-config.json`:

```json
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
```

### 2. Restart Amazon Q in your IDE

### 3. Use in Amazon Q Chat

```
You: Analyze my local project at /path/to/my-dotnet-app

You: Analyze https://github.com/myorg/java-project

You: Explain how to fix Session State issues

You: Generate a bash script for analyzing .NET projects
```

## Available Tools

- **analyze_git_repository** - Analyze Git repos for stateful patterns
- **analyze_local_project** - Analyze local project directories
- **generate_analysis_script** - Generate bash/PowerShell scripts
- **get_project_findings** - Retrieve historical findings
- **explain_remediation** - Get remediation guidance

## Configuration

Environment variables:

- `STATELESSOR_API_URL` - API endpoint (default: http://localhost:3001)
- `STATELESSOR_API_TIMEOUT` - Request timeout in ms (default: 300000)

## Additional details

Read USER_GUIDE.md for more details
Read INTEGRATION.md as well for additional information

## License

MIT