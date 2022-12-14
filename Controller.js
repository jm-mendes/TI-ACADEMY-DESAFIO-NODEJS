const express = require('express'); //framework que permite trabalhar com as rotas
const cors = require('cors'); //função de segurança; é um middleware
const { Sequelize } = require('./models');
const models = require('./models');
const bodyParser = require('body-parser');
const database = require('./models')

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

//Cliente
let cliente = models.Cliente;
let cartao = models.Cartao;
let empresa = models.Empresa;
let promocao = models.Promocao;
let compra = models.Compra;

let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log('Servidor está ativo: ' +
        'http://localhost:3001');
});

app.get('/', function (req, res) {
    res.send('Bem-vindo(a) a TI ACADEMY BRASIL');
});

//CRUD C-create R-recuperar/report U-update/atualizar -D-delete/excluir
//CREATE

//Inserir um novo cliente
app.post('/cliente', async (req, res) => {
    await cliente.create(
        req.body
    ).then(cli => {
        return res.json({
            error: false,
            message: "Cliente inserido com sucesso!",
            cli
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//Inserir um cartão para o cliente
app.post('/cliente/:id/cartao', async (req, res) => {
    const cart = {
        ClienteId: req.params.id,
        validade: req.body.validade,
        dataCartao: req.body.dataCartao
    };

    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Cliente inexistente"
        });
    };

    await cartao.create(cart)
        .then(cartcli => {
            return res.json({
                error: false,
                message: "Cartão do cliente inserido com sucesso!",
                cartcli
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//Inserir uma nova empresa
app.post('/empresa', async (req, res) => {
    await empresa.create(
        req.body
    ).then(emp => {
        return res.json({
            error: false,
            message: "Empresa inserida com sucesso!",
            emp
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//Inserir uma nova promocao para empresa
app.post('/empresa/:id/promocao', async (req, res) => {
    const prom = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade,
        EmpresaId: req.params.id

    };

    if (!await empresa.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Empresa inexistente"
        });
    };

    await promocao.create(prom)
        .then(promEmpresa => {
            return res.json({
                error: false,
                message: "Promoção inserida com sucesso!",
                promEmpresa
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//inserir uma compra
app.post('/cartao/:idcartao/promocao/:idpromocao', async (req, res) => {
    const comp = {
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor,
        CartaoId: req.params.idcartao,
        PromocaoId: req.params.idpromocao
    };


    // if (!await cartao.findByPk(req.params.idcartao)) {
    //     return res.status(400).json({
    //         error: true,
    //         message: "Cartão inexistente"
    //     });
    // };

    // if (!await promocao.findByPk(req.params.idpromocao)) {
    //     return res.status(400).json({
    //         error: true,
    //         message: "Promocao inexistente"
    //     });
    // };

    await compra.create(comp)
        .then(compra => {
            return res.json({
                error: false,
                message: "Compra inserida com sucesso!",
                compra
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//Listar todos os Clientes
app.get('/clientes', async (req, res) => {
    await cliente.findAll()
        .then(cli => {
            return res.json({
                error: false,
                cli
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//Listar um Cliente Específico
app.get('/cliente/:id', async (req, res) => {
    await cliente.findByPk(req.params.id)
    .then(clientes => {
        return res.json({
            error: false,
            clientes
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});


//Listar todos os Cartões dos Clientes
app.get('/clientes/cartoes', async (req, res) => {

try {
    const todosCartaos = await database.Cartao.findAll()
    return res.status(200).json(todosCartaos)
} catch (error) {
    return res.status(400).json(error.message)
}
});

//teste-cartoes
app.get('/cartoes', async(req, res) => {
    await cartao.findAll({
        order: [['id', 'ASC']]   
    }).then(function(cartoes){
        res.json({cartoes})
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

//Listar os Cartões de um Cliente específico
app.get('/cliente/:id/cartoes', async (req, res) => {
    await cartao.findAll({
        where: { ClienteId: req.params.id }
    }).then(cartoes => {
        return res.json({
            error: false,
            cartoes
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//listar um cartao
app.get('/cartao/:id', async (req, res) => {
    await cartao.findByPk(req.params.id)
        .then(card => {
            return res.json({
                error: false,
                card
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//listar empresas
app.get('/empresas', async (req, res) => {
    await empresa.findAll()
        .then(emp => {
            return res.json({
                error: false,
                emp
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//Listar uma Empresa
app.get('/empresa/:id', async (req, res) => {
    await empresa.findByPk(req.params.id)
    .then(empresas => {
        return res.json({
            error: false,
            empresas
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});


//listar promocoes
app.get('/empresas/promocoes', async (req, res) => {
    await promocao.findAll()
        .then(promocoes => {
            return res.json({
                error: false,
                promocoes
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//listar uma promocao em especifico
app.get('/promocao/:id', async (req, res) => {
    await promocao.findByPk(req.params.id)
        .then(prom => {
            return res.json({
                error: false,
                prom
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//Listar os Promoções de uma Empresa específica
app.get('/empresa/:id/promocoes', async (req, res) => {
    await promocao.findAll({
        where: { EmpresaId: req.params.id }
    }).then(promocoes => {
        return res.json({
            error: false,
            promocoes
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
    });
});

//listar compras
app.get('/compras', async (req, res) => {
    await compra.findAll()
        .then(comp => {
            return res.json({
                error: false,
                comp
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API."
            });
        });
});

//listar compra específica
app.get('/cartao/:idcartao/promocao/:idpromocao', async (req, res) => {
    await compra.findOne({
        where: Sequelize.and({ CartaoId: req.params.idcartao, PromocaoId: req.params.idpromocao })
    })
        .then(comp => {
            return res.json({
                error: false,
                comp
            });
        }).catch(erro => {
            return res.status(400).json({
                error: true,
                message: "Problema de conexão com a API.",
                erro: erro.message
            });
        });
});

//Atualizar informações de um cartão
app.put('/alterarcartao/:id', async (req, res) => {
    const card = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        dataCartao: req.body.dataCartao,
        validade: req.body.validade
    }
    if (!await cartao.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Cartão inexistente"
        });
    };

    await cartao.update(card,{
        where: Sequelize.and({ClienteId : req.body.ClienteId},
            {id: req.params.id})
    }).then(cartaos=>{
        return res.json({
            error: false,
            mensagem: 'Cartão foi alterado com sucesso.',
            cartaos
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        });
    });
});

//Atualizar informação de um cliente
app.put('/alterarcliente/:id', async (req, res) => {
    const cli = {
        id: req.params.id,
        nome: req.body.nome,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento
    };

    if (!await cliente.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Cliente não existe.'
        });
    };

    await cliente.update(cli,{
        where: Sequelize.and(
            {id: req.params.id})
    }).then(clientes=>{
        return res.json({
            error: false,
            mensagem: 'Cliente foi alterado com sucesso.',
            clientes
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        });
    });
});

//Atualizar informação de uma empresa
app.put('/alterarempresa/:id', async (req, res) => {
    const emp = {
        id: req.params.id,
        nome: req.body.nome,
        dataAdesao: req.body.dataAdesao,
    };

    if (!await empresa.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Empresa inexistente.'
        });
    };

    await empresa.update(emp,{
        where: Sequelize.and(
            {id: req.params.id})
    }).then(empresas=>{
        return res.json({
            error: false,
            mensagem: 'Empresa foi alterada com sucesso.',
            empresas
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        });
    });
});

//Atualizar informações de uma promoção
app.put('/alterarpromocao/:id', async (req, res) => {
    const promo = {
        id: req.params.id,
        EmpresaId: req.body.EmpresaId,
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade,
    }
    if (!await promocao.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Promoção inexistente"
        });
    };

    await promocao.update(promo,{
        where: Sequelize.and(
            {id: req.params.id})
    }).then(promocaos=>{
        return res.json({
            error: false,
            mensagem: 'A promoção foi alterada com sucesso.',
            promocaos
        });
    }).catch(erro=>{
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        });
    });
});

//Atualizar informações de uma compra
app.put('/cartao/:idcartao/promocao/:idpromocao', async (req, res) => {
    const comp = {
        CartaoId: req.params.idcartao,
        data: req.body.data,
        quantidade: req.body.quantidade,
        valor: req.body.valor,
        PromocaoId: req.params.idpromocao
    }

    await compra.update(comp,{
        where: Sequelize.and({ CartaoId: req.params.idcartao, PromocaoId: req.params.idpromocao })
    }).then(comp=>{
        return res.json({
            error: false,
            message: 'A compra foi alterada com sucesso.',
            comp
        });
    }).catch(erro=>{
        return res.status(400).json(error.message);
    });
});


//deletar um cliente
app.delete('/excluir-cliente/:id', async (req, res) => {
    await cliente.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Cliente foi excluído com sucesso",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API"
        });
    });
});

//deletar uma empresa
app.delete('/excluirempresa/:id', async (req, res) => {
    await empresa.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Empresa foi excluída com sucesso",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API"
        });
    });
});

//deletar uma promocao
app.delete('/excluirpromocao/:id', async (req, res) => {
    await promocao.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Promoção foi excluída com sucesso",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API"
        });
    });
});

//deletar um cartao
app.delete('/excluircartao/:id', async (req, res) => {
    await cartao.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Cartão foi excluído com sucesso",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API"
        });
    });
});

//deletar uma compra
app.delete('/cartao/:idcartao/promocao/:idpromocao', async (req, res) => {
    await compra.destroy({
        where: Sequelize.and({ CartaoId: req.params.idcartao }, { PromocaoId: req.params.idpromocao })
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra foi excluída com sucesso",
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API"
        });
    });
});