#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const config = require('./config/default.json');

// Import tools
const analyzeGitTool = require('./tools/analyze-git');
const analyzeLocalTool = require('./tools/analyze-local');
const generateScriptTool = require('./tools/generate-script');
const getFindingsTool = require('./tools/get-findings');
const explainRemediationTool = require('./tools/explain-remediation');

class StatelessorMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: config.server.name,
        version: config.server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          analyzeGitTool.definition,
          analyzeLocalTool.definition,
          generateScriptTool.definition,
          getFindingsTool.definition,
          explainRemediationTool.definition,
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'analyze_git_repository':
          return await analyzeGitTool.execute(args);
        case 'analyze_local_project':
          return await analyzeLocalTool.execute(args);
        case 'generate_analysis_script':
          return await generateScriptTool.execute(args);
        case 'get_project_findings':
          return await getFindingsTool.execute(args);
        case 'explain_remediation':
          return await explainRemediationTool.execute(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Statelessor MCP server running on stdio');
  }
}

// Start server
const server = new StatelessorMCPServer();
server.start().catch(console.error);
