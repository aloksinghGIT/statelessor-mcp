const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/default.json');

class StatelessorAPIClient {
  constructor() {
    this.baseURL = process.env.STATELESSOR_API_URL || config.api.baseUrl;
    this.timeout = config.api.timeout;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Statelessor-MCP/1.0.0',
      },
    });
  }

  generateRequestId() {
    return uuidv4();
  }

  /**
   * Analyze a Git repository
   * @param {string} gitUrl - Git repository URL
   * @param {string} sshKeyId - Optional SSH key ID
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeGitRepository(gitUrl, sshKeyId = null) {
    const requestId = this.generateRequestId();
    
    try {
      const response = await this.client.post('/analyze', {
        type: 'git',
        gitUrl,
        sshKeyId,
      }, {
        headers: {
          'X-Request-ID': requestId,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'analyzeGitRepository');
    }
  }

  /**
   * Analyze a local project (ZIP file)
   * @param {string} zipFilePath - Path to ZIP file
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeLocalProject(zipFilePath) {
    const requestId = this.generateRequestId();
    
    try {
      const formData = new FormData();
      formData.append('type', 'zip');
      formData.append('zipFile', fs.createReadStream(zipFilePath));  // Changed from 'file' to 'zipFile'

      const response = await this.client.post('/analyze', formData, {
        headers: {
          'X-Request-ID': requestId,
          ...formData.getHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'analyzeLocalProject');
    }
  }

  /**
   * Generate analysis script
   * @param {string} scriptType - 'bash' or 'powershell'
   * @returns {Promise<string>} Script content
   */
  async generateScript(scriptType) {
    const requestId = this.generateRequestId();
    
    try {
      const endpoint = scriptType === 'bash' ? '/api/script/bash' : '/api/script/powershell';
      const response = await this.client.get(endpoint, {
        headers: {
          'X-Request-ID': requestId,
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'generateScript');
    }
  }

  /**
   * Get project findings
   * @param {string} projectName - Project name
   * @returns {Promise<Object>} Historical findings
   */
  async getProjectFindings(projectName) {
    const requestId = this.generateRequestId();
    
    try {
      const response = await this.client.get(`/findings/${projectName}`, {
        headers: {
          'X-Request-ID': requestId,
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'getProjectFindings');
    }
  }

  /**
   * Generate SSH key pair
   * @returns {Promise<Object>} SSH key pair
   */
  async generateSSHKey() {
    const requestId = this.generateRequestId();
    
    try {
      const response = await this.client.post('/api/ssh/generate', {}, {
        headers: {
          'X-Request-ID': requestId,
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'generateSSHKey');
    }
  }

  handleError(error, operation) {
    if (error.response) {
      // Server responded with error
      return new Error(
        `${operation} failed: ${error.response.data.error || error.response.statusText}`
      );
    } else if (error.request) {
      // No response received
      return new Error(`${operation} failed: No response from server`);
    } else {
      // Request setup error
      return new Error(`${operation} failed: ${error.message}`);
    }
  }
}

module.exports = new StatelessorAPIClient();