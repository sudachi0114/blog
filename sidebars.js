module.exports = {
  someSidebar: {
    Docusaurus: ['doc1', 'doc2', 'doc3'],
    Features: ['mdx'],
    golang: ['golang/envsetting/golang-envsetting'],
    git: ['git/multiUser/git-multiUser',
      'git/delBranch/git-delBranch',
      'git/renameBranch/git-branch-rename',
      'git/ignoreNoExtFiles/git-ignore-binary',
      'git/fileHistory/git-file-history'],
    infra: [{
      ubuntu:['infra/ubuntu/set-timezone/ubuntu-set-timezone'],
      apache:['infra/apacheServer/infra-apacheServer'],
      samba:['infra/sambaServer/infra-sambaServer'],
      kvm:['infra/kvm/expand_volume/infra-kvm-expand-volume'],
    },],
    markdown: ['markdown/pulldown/markdown-pulldown'],
    editor: [{
      vscode: ['editor/vscode/openWithNewWindow/editor-vscode-openwithnewwindow']
    },],
  },
};
