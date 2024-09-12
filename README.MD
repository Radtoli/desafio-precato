# API de menssagens Precato

Este projeto é uma API REST con o intuito de atualizar status de menssagens enviadas e coletar grupos de menssagens com base em seu status


## Principais funcionalidades

- Atualizar o status de uma mensagem.
- Buscar mensagens pelo status nas últimas 24 horas.
- Autenticação via token estático enviado no cabeçalho da requisição.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento.
- **Express.js**: Framework para criar APIs RESTful.
- **Sequelize**: ORM para interagir com o banco de dados PostgreSQL.
- **dotenv**: Carrega variáveis de ambiente a partir de um arquivo `.env`.

## Instalação e Execução

### Pré-requisitos

- Node.js e npm instalados.
- PostgreSQL configurado.

### Passos de Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu_usuario/nome_do_projeto.git
    cd nome_do_projeto
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure o arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

    ```
    DB_PASSWORD=senha_do_postgres
    AUTH_TOKEN=seu_token_de_autenticacao
    ```

4. Execute o projeto:

    ```bash
    npm start
    ```

A API estará disponível em `http://localhost:3000`.

## Estrutura de Pastas

O projeto está organizado nas seguintes pastas principais:

```
project-root/
│
├── config/
│   └── database.js        # Configuração da conexão com o banco de dados PostgreSQL via Sequelize
│
├── controllers/
│   └── messageController.js  # Controlador com a lógica das operações de mensagens
│
├── middleware/
│   └── validateToken.js    # Middleware para validação do token de autenticação
│
├── models/
│   └── Message.js         # Definição do modelo de dados Message no Sequelize
│
├── routes/
│   └── messageRoutes.js    # Definição das rotas da API relacionadas às mensagens
│
├── app.js                 # Ponto de entrada principal da aplicação Express
└── package.json           # Configurações e dependências do projeto
```


## Configuração do banco de dados
O arquivo `config/database.js` configura a conexão com o banco de daados PostgreSQL usando o Sequelize e utilizando varíaveis de ambiente para obter as credenciais de conexão

    import { Sequelize } from "sequelize";
    import dotenv from "dotenv";
    
    dotenv.config();
    
    const sequelize = new Sequelize("precato", "postgres", process.env.DB_PASSWORD, {
        host: "localhost",
        dialect: "postgres",
    });

    export default sequelize;

Tenha certeza que possui o PostgreSQL instalado e funcionando, e lembre-se de criar um banco de dados chamado "Precato".

## Rotas da Api

 1. Atulizar o Status de uma menssagem
 **Endpoint:** `PUT /precato/:id/:status`
 Descrição: Atualiza o status de uma menssagem com base no `id` e `status` fornecidos. O "Status" só tem 3 possíveis valores: `ENVIADO`, `RECEBIDO` ou `ERRO DE ENVIO`.
 
 - Autenticação: Requer token enviado no Header `Authorization`.
 - Parâmetros:
	 - `id`: Identificador único da menssagem.
	 - `status`: O novo status da menssagem. 
	 
**Exemplo de requisição**

    PUT /precato/1/ENVIADO
    Authorization: Bearer <seu_token>
**Resposta de sucesso**

    {
      "message": "Mensagem atualizada com sucesso"
    }
2. Buscar menssagem por Status

**Endpoint:** `PUT /precato/:status`
 Descrição: Retorna todas as menssagens com o status fornecido nas últimas 24 horas.
 
 - Autenticação: Requer token enviado no Header `Authorization`.
 - Parâmetros:
	 - `status`: O status da menssagem a ser buscada (`ENVIADO`, `RECEBIDO`, `ERRO DE ENVIO`).
	 
	 **Exemplo de requisição:** 
	 
 
    GET /precato/ENVIADO
    Authorization: Bearer <seu_token>

**Resposta de sucesso:**

    {
      "items": [
        {
          "id": 1,
          "phone": "123456789",
          "message": "Sua mensagem foi enviada",
          "status": "ENVIADO",
          "updatedAt": "2024-09-11T19:12:11.186Z"
        }
      ]
    }

## Autenticação
A autenticação é feita atráves de um token estático definido nas varíaveis de ambiente. O token deve ser enviado no Header `Authorization` em todas as requisições. Seu formato deve ser:

    Authorization: Bearer <seu_token>

## Middleware de validação do token
Foi utilizado um middleware personalizado para a validação do token em cada requisição (Não foi utilizado o mesmo tratamento de erros do controller por não achar necessário visto que só existem duas exceções neste código)

    import dotenv from 'dotenv';
    dotenv.config();
    
    const secretKey = process.env.AUTH_TOKEN;
    
    export const validateToken = (req, res, next) => {
        const token = req.headers['authorization'];
    
        if (!token) {
            return res.status(401).json({ error: "Token não informado" });
        }
        if (token != secretKey) {
            return res.status(403).json({ error: "Token inválido" });
            
        } else {
            next();
        }
    };

## Modelo
O arquivo `Message.js` dentro da pasta models, define a estrutura de dados da tabela de menssagens no banco de dados.

    import { DataTypes } from "sequelize";
    import sequelize from "../config/database.js";
    
    const Message = sequelize.define("mensagens", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(25),
            allowNull: true,
        }
    });
    
    export default Message;








