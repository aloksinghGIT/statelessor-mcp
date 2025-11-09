class ResultFormatter {
  /**
   * Format analysis result for Amazon Q
   * @param {Object} result - Analysis result from API
   * @returns {string} Formatted text
   */
  formatAnalysisResult(result) {
    const { projectName, projectType, scanDate, complexityFactor, stats, summary, detailed, actions } = result;

    let output = `# Analysis Results: ${projectName}\n\n`;
    output += `**Project Type**: ${projectType}\n`;
    output += `**Scan Date**: ${new Date(scanDate).toLocaleString()}\n`;
    output += `**Complexity Factor**: ${complexityFactor}\n\n`;

    // Stats
    output += `## Statistics\n\n`;
    output += `- **Total Issues**: ${stats.totalIssues}\n`;
    output += `- **High Severity**: ${stats.highSeverity}\n`;
    output += `- **Medium Severity**: ${stats.mediumSeverity}\n`;
    output += `- **Low Severity**: ${stats.lowSeverity}\n\n`;

    // Summary findings
    if (summary && summary.length > 0) {
      output += `## Summary Findings\n\n`;
      summary.forEach((finding, idx) => {
        output += `### ${idx + 1}. ${finding.category}\n`;
        output += `- **Pattern**: ${finding.pattern}\n`;
        output += `- **Count**: ${finding.count}\n`;
        output += `- **Severity**: ${finding.severity}\n`;
        output += `- **Effort**: ${finding.effort} points\n\n`;
      });
    }

    // Recommended actions
    if (actions && actions.length > 0) {
      output += `## Recommended Actions\n\n`;
      actions.forEach((action, idx) => {
        output += `${idx + 1}. **${action.category}** (${action.effortWeight} points)\n`;
        if (action.subActions && action.subActions.length > 0) {
          action.subActions.forEach((sub) => {
            output += `   - ${sub.action} (${sub.effort} points)\n`;
          });
        }
        output += `\n`;
      });
    }

    return output;
  }

  /**
   * Format historical findings
   * @param {Array} findings - Array of historical findings
   * @param {string} projectName - Project name
   * @returns {string} Formatted text
   */
  formatHistoricalFindings(findings, projectName) {
    let output = `# Historical Findings: ${projectName}\n\n`;
    output += `**Total Scans**: ${findings.length}\n\n`;

    findings.forEach((finding, idx) => {
      output += `## Scan ${idx + 1}: ${new Date(finding.scanDate).toLocaleDateString()}\n`;
      output += `- **Total Issues**: ${finding.totalIssues}\n`;
      output += `- **Complexity**: ${finding.complexityFactor}\n`;
      output += `- **Effort Required**: ${finding.totalEffort} points\n\n`;
    });

    // Trend analysis
    if (findings.length > 1) {
      const first = findings[0];
      const last = findings[findings.length - 1];
      const change = last.totalIssues - first.totalIssues;
      const trend = change > 0 ? '📈 Increasing' : change < 0 ? '📉 Decreasing' : '➡️ Stable';

      output += `## Trend Analysis\n\n`;
      output += `${trend}: ${Math.abs(change)} issues ${change > 0 ? 'added' : 'resolved'}\n`;
    }

    return output;
  }

  /**
   * Format error message
   * @param {Error} error - Error object
   * @returns {string} Formatted error message
   */
  formatError(error) {
    return `❌ **Error**: ${error.message}\n\nPlease check your input and try again.`;
  }
}

module.exports = new ResultFormatter();