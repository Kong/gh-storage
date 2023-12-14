const { parseRepoPath } = require('../src/main')

describe('repo-path', () => {
  it('splits correctly', async () => {
    const { owner, repo, branch, path } = parseRepoPath(
      'owner/repo/branch/pa/th'
    )
    expect(owner).toBe('owner')
    expect(repo).toBe('repo')
    expect(branch).toBe('branch')
    expect(path).toBe('pa/th')
  })
})
