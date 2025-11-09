const path = require('path');
const fs = require('fs').promises;

module.exports = {
  definition: {
    name: 'explain_remediation',
    description: 'Get detailed remediation guidance for a specific stateful pattern',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Pattern category (e.g., "Session State", "Static Mutable Field")',
        },
      },
      required: ['category'],
    },
  },

  async execute(args) {
    try {
      const { category } = args;

      // Load remediation actions from JSON file
      const remediationPath = path.join(__dirname, '../data/remediation-actions.json');
      const remediationData = JSON.parse(await fs.readFile(remediationPath, 'utf-8'));

      // Find matching category
      const remediation = remediationData.actions.find(
        (action) => action.category.toLowerCase() === category.toLowerCase()
      );

      if (!remediation) {
        return {
          content: [
            {
              type: 'text',
              text: `No remediation guidance found for category: ${category}\n\nAvailable categories:\n${remediationData.actions.map(a => `- ${a.category}`).join('\n')}`,
            },
          ],
        };
      }

      // Format remediation guidance
      const guidance = `# Remediation: ${remediation.category}\n\n` +
        `**Effort**: ${remediation.effortWeight} points\n\n` +
        `## Actions Required:\n\n` +
        remediation.subActions.map((action, idx) => 
          `${idx + 1}. **${action.action}** (${action.effort} points)\n   ${action.description || ''}`
        ).join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: guidance,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error explaining remediation: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
};