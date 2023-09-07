echo 'start game-server of chat'
yarn

yarn run build

cd dist

node app
