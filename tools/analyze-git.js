const apiClient = require('../utils/api-client');
const resultFormatter = require('../utils/result-formatter');

module.exports = {
  definition: {
    name: 'analyze_git_repository',
    description: 'Analyze a Git repository for stateful code patterns in .NET or Java projects',
    inputSchema: {
      type: 'object',
      properties: {
        gitUrl: {
          type: 'string',
          description: 'Git repository URL (HTTPS or SSH)',
        },
        sshKeyId: {
          type: 'string',
          description: 'SSH key ID for private repositories (optional)',
        },
      },
      required: ['gitUrl'],
    },
  },

  async execute(args) {
    try {
      const { gitUrl, sshKeyId } = args;

      // Validate Git URL
      if (!gitUrl || (!gitUrl.startsWith('https://') && !gitUrl.startsWith('git@'))) {
        throw new Error('Invalid Git URL. Must start with https:// or git@');
      }

      // Call Statelessor API
      const result = await apiClient.analyzeGitRepository(gitUrl, sshKeyId);

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
            text: `Error analyzing Git repository: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
};