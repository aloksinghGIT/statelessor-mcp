const apiClient = require('../utils/api-client');
const projectZipper = require('../utils/project-zipper');
const resultFormatter = require('../utils/result-formatter');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  definition: {
    name: 'analyze_local_project',
    description: 'Analyze a local project directory for stateful code patterns',
    inputSchema: {
      type: 'object',
      properties: {
        projectPath: {
          type: 'string',
          description: 'Absolute path to project directory',
        },
      },
      required: ['projectPath'],
    },
  },

  async execute(args) {
    let zipFilePath = null;

    try {
      const { projectPath } = args;

      // Validate project path
      const stats = await fs.stat(projectPath);
      if (!stats.isDirectory()) {
        throw new Error('Project path must be a directory');
      }

      // ZIP the project
      zipFilePath = await projectZipper.zipProject(projectPath);

      // Call Statelessor API
      const result = await apiClient.analyzeLocalProject(zipFilePath);

      // Format result for Amazon Q
      return {
        content: [
          {
            type: 'text',
            text: resultFormatter.formatAnalysisResult(result),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing local project: ${error.message}`,
          },
        ],
        isError: true,
      };
    } finally {
      // Cleanup ZIP file
      if (zipFilePath) {
        try {
          await fs.unlink(zipFilePath);
        } catch (err) {
          console.error('Failed to cleanup ZIP file:', err);
        }
      }
    }
  },
};