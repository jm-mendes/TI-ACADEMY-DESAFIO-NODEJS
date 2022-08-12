const express = require('express'); //framework que permite trabalhar com as rotas
const cors = require('cors'); //função de segurança; é um middleware
const { Sequelize } = require('./models');
const models = require('./models');
const bodyParser = require('body-parser');

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

//CRUD C-create R-recuperar/report U-update - D-delete
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
        validade: req.body,
        dataCartao: req.body //ao utilizar o req.body.data => a informação foi como null no banco de dados
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
//bug -> dados indo como 'null'
app.post('/empresa/:id/promocao', async (req, res) => {
    const prom = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        validade: req.body.validade, //ao utilizar o req.body.data => a informação foi como null no banco de dados
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


    // if (!await cartao.findByPk(comp.CartaoId)) {
    //     return res.status(400).json({
    //         error: true,
    //         message: "Cartão inexistente"
    //     });
    // };

    // if (!await promocao.findByPk(comp.PromocaoId)) {
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

//Listar todos os Cartões dos Clientes
app.get('/clientes/cartoes', async (req, res) => {
    await cartao.findAll()
        //await cartao.findAll({ include: [{ all: true }] }) -> Assim não funcionou
        .then(cartoes => {
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

//Atualizar informações de um cartão
app.put('alterarcartao/:id', async (req, res) => {
    const card = {
        id: req.params.id,
        ClienteId: req.body.ClienteId,
        dataCartao: req.body.data,
        validade: req.body.data
    }
    if (! await cliente.findByPk(req.body.ClienteId)) {
        return res.status(400).json({
            error: true,
            message: "Cliente inexistente"
        });
    };

    await cartao.update(card, {
        where: Sequelize.and({ ClienteId: req.body.ClienteId })
    }).then(umCard => {
        return res.json({
            error: false,
            message: "Pedido foi atualizado com sucesso",
            umCard
        });
    }).catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Problema de conexão com a API."
        });
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