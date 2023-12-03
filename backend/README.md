# nilrow

### Passo a passo de como eu criei e configurei esse projeto

# Crie um novo diretório para o projeto
Abra o terminal e crie um novo diretório para o seu projeto:
```
mkdir backend
cd backend
```

# Inicialize o projeto Node.js
Execute o seguinte comando para iniciar um novo projeto Node.js:
```
npm init
```
Isso criará um arquivo package.json com as configurações padrão.

# Instale as dependências necessárias
Instale o Express e o MongoDB usando o seguinte comando:
```
npm install express mongoose
```
O Express será nosso framework web, e o Mongoose é uma biblioteca ODM (Object Data Modeling) para MongoDB.

# Configure o arquivo app.js
Crie um arquivo app.js na raiz do seu projeto. Este será o ponto de entrada do seu aplicativo. Adicione o seguinte código inicial:
```
            const express = require('express');
            const mongoose = require('mongoose');

            const app = express();
            const PORT = process.env.PORT || 3000;

            app.use(express.json());

            // Configuração do MongoDB
            mongoose.connect('mongodb://127.0.0.1:27017/helpcenter');

            mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
            });

            // Defina suas rotas aqui

            app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            });
```
# Execute o servidor
No terminal, execute o comando:
```
node app.js
```
