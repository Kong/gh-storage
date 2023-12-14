const core = require('@actions/core')

const { downloadFile, uploadFile, parseRepoPath } = require('./main')

module.exports = {
  upload: async () => {
    const repoPath = core.getInput('repo-path', { required: true })
    const { path } = parseRepoPath(repoPath)
    const localFile = core.getInput('local-path') || path
    const commitMessage = core.getInput('commit-message') || `Updated ${path}`
    await uploadFile(localFile, repoPath, commitMessage)
  },

  download: async () => {
    const repoPath = core.getInput('repo-path', { required: true })
    const { path } = parseRepoPath(repoPath)
    const localFile = core.getInput('local-path') || path
    await downloadFile(localFile, repoPath)
  }
}
