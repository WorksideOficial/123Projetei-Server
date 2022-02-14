const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'projetei_1234', 
    'root_projetei2', 
    '12345678', 
{
    host: '85.10.205.173',
    dialect: 'mysql',
    port: 3306
})

sequelize.authenticate().then(function(){
    console.log("Conectado com Sucesso!");
}).catch(function(error){
    console.log("Erro ao conectar!");
})

module.exports = sequelize;