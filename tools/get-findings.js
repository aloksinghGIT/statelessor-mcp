const apiClient = require('../utils/api-client');
const resultFormatter = require('../utils/result-formatter');

module.exports = {
  definition: {
    name: 'get_project_findings',
    description: 'Retrieve historical analysis findings for a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: 'Name of the project',
        },
      },
      required: ['projectName'],
    },
  },

  async execute(args) {
    try {
      const { projectName } = args;

      // Call Statelessor API
      const findings = await apiClient.getProjectFindings(projectName);

      if (!findings || findings.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No historical findings found for project: ${projectName}`,
            },
          ],
        };
      }

      // Format findings
      return {
        content: [
          {
            type: 'text',
            text: resultFormatter.formatHistoricalFindings(findings, projectName),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving findings: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
};