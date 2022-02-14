const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');
const PessoaFisica = require('./models/PessoaFisica');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});

app.get('/list', async (req, res) => {
    await PessoaFisica.findAll({order: [['id','DESC']]}).then(function(users){
        res.json({
            erro: false,
            users
        });
    }).catch(function(){
        return res.json({
            erro: true,
            messagem: "Nenhum usuario encontrado!"
        })
    });
});

app.post('/create', async (req, res) => {
    const dados = req.body;

    dados.password = await bcrypt.hash(dados.password, 8);

    await PessoaFisica.create(dados).then(function(){
        return res.json({
            erro: false,
            messagem: "Usuário cadastrado com sucesso!"
        });
    }).catch(function(){
        return res.status(400).json({
            erro: true,
            messagem: "Erro ao cadastrar usuário!"
        })
    });
});

app.put('/edit', async (req, res) => {
    const { id } = req.body;
    const dados = req.body;

    dados.password = await bcrypt.hash(dados.password, 8);

    await PessoaFisica.update(dados, { where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuario editado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: usuário não editado!"
        })
    })
})

app.get('/viewuser/:id', async (req, res) => {
    const { id } = req.params;
    await PessoaFisica.findByPk(id).then((user) => {
        return res.json({
            erro: false,
           user
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: nenhum usuário encontrado!"
        })
    })
})


app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await PessoaFisica.destroy({ where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuario deletado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro ao deletar usuário!"
        })
    })
})  

app.post('/login', async (req, res) => {
    const user = await PessoaFisica.findOne({
        attributes: ['id', 'name', 'name', 'password'],
        where: {
            name: req.body.name
        }
    });

    if(user === null){     
        return res.status(400).json({
            erro: true,
            messagem: "Erro: Usuário não encontrado!"
        })
    }

    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            messagem: "Erro: Senha incorreta!"
        })
    }

    const token = jwt.sign({id: user.id}, "74be16979710d4c4e7c6647856088456", {
        expiresIn: '7d',
    })

    return res.json({
        erro: false,
        token: token
    })
});

async function validarToken(req, res, next){
   const authHeader = req.headers.authorization;
   const [, token] = authHeader.split(' ');
   
   if(!token){
       res.status(400).json({
        erro: true,
        messagem: "Erro: Faça seu login!"
       })
   }

   try{
      const decoded = await promisify(jwt.verify)(token, "74be16979710d4c4e7c6647856088456")
      req.userId = decoded.id;
      return next();
   }catch(err){
    res.status(400).json({
        erro: true,
        messagem: "Erro: Token inválido!"
       })
   }
}

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})