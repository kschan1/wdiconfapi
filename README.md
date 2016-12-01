# WDI Conf API

API for WDI Conf app


# Initial setup (only once)
```
npm install --save sequelize
npm install --save pg pg-hstore
npm install --save sequelize-cli
node_modules/.bin/sequelize init
node_modules/.bin/sequelize model:create --name ModelName --attributes attribute1:data_type,attribute2:data_type
```

node_modules/.bin/sequelize db:migrate