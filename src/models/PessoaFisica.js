const Sequelize = require('sequelize');
const db = require('../config/db');

const PessoaFisica = db.define('pessoafisica', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
     telefone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING
    }
});

// PessoaFisica.sync();

module.exports = PessoaFisica;