git add .
git commit -m "[Digital Ocean] Push remote changes"
bash scripts/pull.sh
GIT_SSH_COMMAND="ssh -i .githubsync/id_rsa" git push
