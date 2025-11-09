const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ProjectZipper {
  /**
   * ZIP a project directory
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<string>} Path to created ZIP file
   */
  async zipProject(projectPath) {
    return new Promise((resolve, reject) => {
      // Create temp ZIP file
      const projectName = path.basename(projectPath);
      const zipFileName = `${projectName}-${Date.now()}.zip`;
      const zipFilePath = path.join(os.tmpdir(), zipFileName);

      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Maximum compression
      });

      output.on('close', () => {
        // ZIP created successfully - don't log to stdout (breaks MCP protocol)
        resolve(zipFilePath);
      });

      archive.on('error', (err) => {
        console.error('[ZIP Error]', err.message);
        reject(err);
      });

      archive.pipe(output);

      // Add project directory to ZIP
      archive.directory(projectPath, false);

      // Finalize the archive
      archive.finalize();
    });
  }

  /**
   * Get project size in MB
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<number>} Size in MB
   */
  async getProjectSize(projectPath) {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    try {
      const { stdout } = await execAsync(`du -sm "${projectPath}"`);
      const sizeMB = parseInt(stdout.split('\t')[0]);
      return sizeMB;
    } catch (error) {
      // Fallback: estimate size
      return 0;
    }
  }
}

module.exports = new ProjectZipper();