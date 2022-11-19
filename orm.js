const SequelizeAuto = require('sequelize-auto');
require('dotenv').config();
const env = process.env;

const auto = new SequelizeAuto(env.DATABASE_USER,env.DATABASE_NAME,env.DATABASE_PASSWORD,{
  host:env.DATABASE_HOST,
  port:env.PORT,
  dialect: "mysql"
});
auto.run((err)=>{
  if(err) throw err;
})