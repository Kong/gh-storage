const fs = require('node:fs')
const { expect, it, describe } = require('@jest/globals')
const tmp = require('tmp')

const {
  uploadFile,
  downloadFile,
  parseRepoPath,
  makeRepoPath
} = require('../src/main')

describe('repo-path', () => {
  it('splits correctly', () => {
    const { owner, repo, branch, path } = parseRepoPath(
      'owner/repo/branch/pa/th'
    )
    expect(owner).toBe('owner')
    expect(repo).toBe('repo')
    expect(branch).toBe('branch')
    expect(path).toBe('pa/th')
  })

  it('joins correctly', () => {
    const repoPath = makeRepoPath('owner', 'repo', 'branch', 'pa/th')
    expect(repoPath).toBe('owner/repo/branch/pa/th')
  })
})

const repoPath = process.env.TEST_GITHUB_PATH
if (repoPath) {
  describe('storage', () => {
    it('can upload and download a file', async () => {
      const tempFile = tmp.fileSync()
      const theSecretMessage = Math.random().toString(36)
      fs.writeFileSync(tempFile.name, theSecretMessage)
      await uploadFile(tempFile.name, repoPath, 'committed from test')
      fs.unlinkSync(tempFile.name)
      await downloadFile(tempFile.name, repoPath)
      const text = fs.readFileSync(tempFile.name, { encoding: 'utf-8' })
      expect(text).toBe(theSecretMessage)
    })
  })
}
