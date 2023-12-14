const fs = require('fs')

const { Octokit } = require('@octokit/rest')
const axios = require('axios')

const parseRepoPath = (path) => {
  const components = path.split('/')
  if (components[0] === '' || components.length < 4) {
    throw new Error(
      'Invalid GitHub repository path, must be <owner>/<repo>/<branch>/<path>'
    )
  }

  return {
    owner: components[0],
    repo: components[1],
    branch: components[2],
    path: components.slice(3).join('/')
  }
}

const uploadFile = async (localFile, repoPath, commitMessage) => {
  console.debug(
    `upload local file ${localFile} to ${repoPath} with message "${commitMessage}"`
  )
  const fileContent = fs.readFileSync(localFile, 'utf-8')
  const { owner, repo, branch, path } = parseRepoPath(repoPath)

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  // Get the latest commit on the branch
  const latestCommit = await octokit.repos.getBranch({
    owner,
    repo,
    branch
  })

  // Get the tree SHA associated with the latest commit
  const treeResponse = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommit.data.commit.sha
  })

  // Create a new tree with the updated file
  const treeResponseNew = await octokit.git.createTree({
    owner,
    repo,
    base_tree: treeResponse.data.tree.sha,
    tree: [
      {
        path,
        mode: '100644',
        type: 'blob',
        content: fileContent
      }
    ]
  })

  // Create a new commit
  const commitResponse = await octokit.git.createCommit({
    owner,
    repo,
    message: commitMessage,
    parents: [latestCommit.data.commit.sha],
    tree: treeResponseNew.data.sha
  })

  // Update the branch reference
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commitResponse.data.sha
  })
}

const downloadFile = async (localFile, repoPath) => {
  const response = await axios.get(
    `https://raw.githubusercontent.com/${repoPath}`
  )

  fs.writeFileSync(localFile, response.data)
}

module.exports = { uploadFile, downloadFile, parseRepoPath }
