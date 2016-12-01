node_modules/.bin/sequelize model:create --name Event --attributes title:string,datetime:date,description:text

node_modules/.bin/sequelize model:create --name Venue --attributes name:string,address:text

node_modules/.bin/sequelize model:create --name Presenter --attributes first_name:string,last_name:string,company:string,job_title:string

node_modules/.bin/sequelize model:create --name User --attributes first_name:string,last_name:string,email:string,password_digest:string