GIT_SSH_COMMAND="ssh -i .githubsync/id_rsa" git fetch origin master
GIT_SSH_COMMAND="ssh -i .githubsync/id_rsa" git pull origin master
npm i
node scripts/remove_old_dist.js
tsc
pm2 restart index --update-env -o output.log -e output.log
