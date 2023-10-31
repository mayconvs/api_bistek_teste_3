// Incluir as bibliotecas
// Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require("express");
// Chamar a função express
const router = express.Router();
// Incluir o arquivo que possui a conexão com banco de dados
const db = require('../db/models');
const Sequelize = require('sequelize');

function converterData(data) {
    const partesData = data.split('/'); // Divide a data nas partes dia, mês e ano
    const dia = partesData[0];
    const mes = partesData[1];
    const ano = partesData[2];

    // Formate a data no formato "YYYY-MM-DD"
    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
}

// Criar a rota listar 
// Endereço para acessar através da aplicação externa: http://localhost:8080/products?page=3
router.get("/products", async (req, res) => {
    console.log(req.query)
    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page = 1, sortColumn = 'codigo', sortOrder = 'asc', all = 0, limit = 15 } = req.query;
    //console.log(page);
    /* console.log(sortColumn); */

    // Limite de registros em cada página
    //let limit = 15;
    if (all == 1) {
        limit = 999999999999999;
    }


    // Variável com o número da última página
    var lastPage = 1;

    const findOptions = {};

    if (sortColumn && sortOrder) {
        const orderClause = [[sortColumn, sortOrder]];
        findOptions.order = orderClause;
    }

    // Contar a quantidade de registro no banco de dados
    const countUser = await db.Products.count();
    //console.log(countUser);

    // Acessa o IF quando encontrar registro no banco de dados
    if (countUser !== 0) {
        // Calcular a última página
        lastPage = Math.ceil(countUser / limit);
        //console.log(lastPage);
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum produto encontrado!"
        });
    }

    //console.log((page * limit) - limit); // 3 * 10 - 10 = 20
    // Recuperar todos os usuário do banco de dados
    const products = await db.Products.findAll({

        // Indicar quais colunas recuperar
        attributes: ['codigo', 'descricao', 'categoria', 'ativo', 'data'],

        // Ordenar os registros pela coluna id na forma decrescente
        ...findOptions,
        //order: sortColumn && sortOrder ? [[sortColumn, sortOrder]] : [['codigo', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if (products) {
        // Criar objeto com as informações para paginação
        var pagination = {
            // Caminho
            path: '/products',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Última página
            lastPage,
            // Quantidade de registros
            total: countUser
        }

        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            products,
            pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum produto encontrado!"
        });
    }
});

//router.get("/search/:descricao?", async (req, res) => {
router.get("/search", async (req, res) => {
    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page = 1, descricao, sortColumn, sortOrder } = req.query;
    //console.log(page);
    //console.log(req.query)
    // Limite de registros em cada página
    const limit = 10;

    // Variável com o número da última página
    var lastPage = 1;

    const findOptions = {};

    if (sortColumn && sortOrder) {
        const orderClause = [[sortColumn, sortOrder]];
        findOptions.order = orderClause;
    }

    // Contar a quantidade de registro no banco de dados
    //const countUser = await db.Products.count();
    // Contar a quantidade de registro no banco de dados
    const countUser = await db.Products.count({
        where: {
            descricao: {
                [Sequelize.Op.like]: `%${descricao}%`
            }
        }
    });
    //console.log(countUser);

    // Acessa o IF quando encontrar registro no banco de dados
    if (countUser !== 0) {
        // Calcular a última página
        lastPage = Math.ceil(countUser / limit);
        //console.log(lastPage);
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum produto encontrado!"
        });
    }

    //console.log((page * limit) - limit); // 3 * 10 - 10 = 20
    // Recuperar todos os usuário do banco de dados
    const products = await db.Products.findAll({

        // Indicar quais colunas recuperar
        attributes: ['codigo', 'descricao', 'categoria', 'ativo', 'data'],

        // Ordenar os registros pela coluna id na forma decrescente
        //order: [['codigo', 'ASC']],
        ...findOptions,
        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit,
        where: {
            descricao: {
                [Sequelize.Op.like]: `%${descricao}%`
            }
        }
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if (products) {
        // Criar objeto com as informações para paginação
        var pagination = {
            // Caminho
            path: '/search',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Última página
            lastPage,
            // Quantidade de registros
            total: countUser
        }

        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            products,
            pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum produto encontrado!"
        });
    }


});


// Criar a rota visualizar e receber o parâmentro id enviado na URL 
// Endereço para acessar através da aplicação externa: http://localhost:8080/products/7
router.get("/products/:codigo", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { codigo } = req.params;
    //console.log(codigo);

    // Recuperar o registro do banco de dados
    const product = await db.Products.findOne({
        // Indicar quais colunas recuperar
        attributes: ['codigo', 'descricao', 'categoria', 'ativo', 'data', 'createdAt', 'updatedAt'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: { codigo },
    });
    //console.log(product);

    // Acessa o IF se encontrar o registro no banco de dados
    if (product) {
        // Pausar o processamento e retornar os dados
        return res.json({
            product: product.dataValues
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Produto não encontrado!"
        });
    }
});

// Criar a rota para puxar todos os dados da tabela products
// Endereço para acessar através da aplicação externa: http://localhost:8080/download_product_csv
router.get("/download_product_csv", async (req, res) => {
    /*     console.log("aaaaaa: " + req.query) */

    // Contar a quantidade de registro no banco de dados
    const countProducts = await db.Products.count();
    //console.log(countUser);

    // Acessa o IF quando encontrar registro no banco de dados
    if (countProducts <= 0) {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum produto encontrado!"
        });
    }

    //console.log((page * limit) - limit); // 3 * 10 - 10 = 20
    // Recuperar todos os usuário do banco de dados
    const products = await db.Products.findAll({
        // Indicar quais colunas recuperar
        attributes: ['codigo', 'descricao', 'categoria', 'ativo', 'data'],
        order: [['codigo', 'ASC']], // Ordenar por 'codigo' em ordem ascendente
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if (products) {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            products
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum produto encontrado!"
        });
    }
});


// Criar a rota cadastrar
// Endereço para acessar através da aplicação externa: http://localhost:8080/users
/*
// A aplicação externa deve indicar que está enviado os dados em formato de objeto
Content-Type: application/json

// Dados em formato de objeto
{
    "name": "Cesar",
    "email": "cesar@celke.com.br"
}
*/
router.post("/products", async (req, res) => {

    // Receber os dados enviados no corpo da requisição
    var dados = req.body;
    console.log(dados);

    // Salvar no banco de dados
    await db.Products.create(dados).then((dadosUsuario) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Produto cadastrado com sucesso!",
            dadosUsuario
        });
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Produto não cadastrado com sucesso!"
        });
    });
});

// Criar a rota editar 

// Endereço para acessar através da aplicação externa: http://localhost:8080/products

/*
// A aplicação externa deve indicar que está enviado os dados em formato de objeto
Content-Type: application/json

// Dados em formato de objeto
{
    "id": 2,
    "name": "Cesar 2a",
    "email": "cesar2a@celke.com.br"
}
*/
router.put("/products", async (req, res) => {

    // Receber os dados enviados no corpo da requisição
    var dados = req.body;

    // Crie um novo objeto com a data editada
    const objetoEditado = {
        ...dados, // Copie os valores originais
        data: converterData(dados.data) // Atualize a data
    };

    dados = objetoEditado;
    //console.log(dados);

    // Editar no banco de dados
    await db.Products.update(dados, { where: { codigo: dados.codigo } })
        .then(() => {
            // Pausar o processamento e retornar a mensagem
            return res.json({
                mensagem: "Produto atualizado com sucesso!"
            });
        }).catch(() => {
            // Pausar o processamento e retornar a mensagem
            return res.status(400).json({
                mensagem: "Erro: Produto não atualizado!"
            });
        });
});

router.put("/products/active_all_page", async (req, res) => {
    try {

        // Receber os dados enviados no corpo da requisição
        var dados = req.body;
        console.log(dados);

        // Verificar se 'dados' é um array de códigos
        if (!Array.isArray(dados)) {
            return res.status(400).json({
                mensagem: "Erro: Dados inválidos!"
            });
        }

        // Extrair todos os códigos true dos dados
        const codigos = dados
            .filter(item => item.valor[0] === true) // Filtrar elementos com valor[0] igual a true
            .map(item => item.codigo);

        //const codigos = dados.map(item => item.codigo);
        console.log(codigos);
        // Atualizar 'ativo' para 1 para todos os registros com códigos em 'codigos'
        const result = await db.Products.update({ ativo: 1 }, {
            where: { codigo: codigos }
        });

        if (result[0] > 0) {
            return res.json({
                mensagem: "Produtos atualizados com sucesso!"
            });
        } else {
            return res.status(400).json({
                mensagem: "Nenhum produto atualizado!"
            });
        }

    } catch (error) {
        console.error("Erro:", error);
        return res.status(500).json({
            mensagem: "Erro interno do servidor"
        });
    }
});

// Criar a rota para apagar todos os registros de acordo com um array de ids 
// Endereço para acessar através da aplicação externa: http://localhost:8080/products/delete_multiple/
router.delete("/products/delete_multiple/:codigos", express.json(), async (req, res) => {

    try {
        // Receba a matriz de códigos no corpo da solicitação
        //const { codes } = req.body;
        const codigos = JSON.parse(req.params.codigos);
        /* console.log(codigos); */
        const arrayCodigos = codigos.map(item => item.codigo);
        //console.log(arrayCodigos);

        // Certifique-se de que a matriz de códigos seja uma matriz válida
        if (!Array.isArray(arrayCodigos) || arrayCodigos.length === 0) {
            return res.status(400).json({ mensagem: "Códigos inválidos ou ausentes" });
        }

        // Apague registros no banco de dados com base na matriz de códigos
        const result = await db.Products.destroy({
            where: {
                codigo: codigos.map(item => item.codigo)
            }
        });

        if (result > 0) {
            return res.json({ mensagem: "Produtos apagados com sucesso!" });
        } else {
            return res.status(404).json({ mensagem: "Nenhum produto encontrado para exclusão" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro na exclusão de produtos" });
    }
});


// Criar a rota apagar e receber o parâmentro id enviado na URL 
// Endereço para acessar através da aplicação externa: http://localhost:8080/users/3
router.delete("/product/:codigo", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { codigo } = req.params;
    /* console.log(codigo); */
    // Apagar usuário no banco de dados utilizando a MODELS Products
    await db.Products.destroy({
        // Acrescentar o WHERE na instrução SQL indicando qual registro excluir no BD
        where: { codigo }
    }).then(() => {
        // Pausar o processamento e retornar a mensagem
        return res.json({
            mensagem: "Usuário apagado com sucesso!"
        });
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem
        return res.status(400).json({
            mensagem: "Erro: Usuário não apagado com sucesso!"
        });
    });
});

// Exportar a instrução que está dentro da constante router 
module.exports = router;