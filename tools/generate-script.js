const apiClient = require('../utils/api-client');

module.exports = {
  definition: {
    name: 'generate_analysis_script',
    description: 'Generate a bash or PowerShell script for offline analysis',
    inputSchema: {
      type: 'object',
      properties: {
        scriptType: {
          type: 'string',
          enum: ['bash', 'powershell'],
          description: 'Type of script to generate',
        },
      },
      required: ['scriptType'],
    },
  },

  async execute(args) {
    try {
      const { scriptType } = args;

      // Call Statelessor API
      const scriptContent = await apiClient.generateScript(scriptType);

      // Format instructions
      const instructions = scriptType === 'bash'
        ? `To use this script:
1. Save as analyze.sh
2. Make executable: chmod +x analyze.sh
3. Run: ./analyze.sh /path/to/project
4. Results will be saved as findings.json`
        : `To use this script:
1. Save as analyze.ps1
2. Run: .\\analyze.ps1 -ProjectPath "C:\\path\\to\\project"
3. Results will be saved as findings.json`;

      return {
        content: [
          {
            type: 'text',
            text: `# ${scriptType.toUpperCase()} Analysis Script\n\n${instructions}\n\n\`\`\`${scriptType}\n${scriptContent}\n\`\`\``,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error generating script: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
};