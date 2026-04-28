# 💪 Muscle Fit - Gerenciador de Treinos

Aplicativo PWA completo para gerenciamento de exercícios de musculação, com backend Node.js/Express + MongoDB Atlas, pronto para deploy no Vercel.

---

## 📁 Estrutura do Projeto

```
muscle-fit/
├── backend/          # API REST
│   ├── server.js
│   ├── controllers/
│   ├── models/
│   └── routes/
├── frontend/         # PWA (HTML/CSS/JS puro)
│   └── public/
├── api/              # Entry point para Vercel
│   └── index.js
├── vercel.json       # Configuração do Vercel
└── .gitignore
```

---

## 🚀 Deploy no Vercel (Backend + API)

### 1. MongoDB Atlas (Banco de Dados)

1. Acesse [https://cloud.mongodb.com](https://cloud.mongodb.com) e crie uma conta
2. Crie um cluster gratuito (**Shared/Free tier**)
3. Vá em **Database Access** > **Add New Database User**
   - Username: `musclefit_user`
   - Password: gere uma senha forte e salve
4. Vá em **Network Access** > **Add IP Address** > `0.0.0.0/0` (permite acesso de qualquer IP)
5. Vá em **Clusters** > clique em **Connect** > **Drivers** > **Node.js**
6. Copie a string de conexão, ex:
   ```
   mongodb+srv://musclefit_user:SENHA_AQUI@cluster0.abc123.mongodb.net/musclefit?retryWrites=true&w=majority
   ```

### 2. Deploy no Vercel

1. Faça push do código para o GitHub
2. Acesse [https://vercel.com](https://vercel.com) e importe o repositório
3. Nas configurações do projeto, adicione as **Environment Variables**:
   - `MONGODB_URI` = sua URI do MongoDB Atlas
   - `NODE_ENV` = `production`
4. Clique em **Deploy**

### 3. Testar a API

Depois do deploy, acesse:
```
https://seu-app.vercel.app/health
https://seu-app.vercel.app/api/exercicios
```

---

## 🖥️ Rodando Localmente

```bash
# 1. Instalar dependências (na pasta backend)
cd backend
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e configure MONGODB_URI (Atlas ou localhost)

# 3. Rodar o servidor
npm run dev
```

O backend será iniciado em `http://localhost:3000`

O frontend estará disponível em `http://localhost:3000/` (servido pelo Express)

---

## 📝 Variáveis de Ambiente (.env)

```env
PORT=3000                           # Porta local (ignorada pelo Vercel)
MONGODB_URI=<sua-uri-do-atlas>      # URI do MongoDB Atlas
NODE_ENV=development                # ou production
FRONTEND_URL=                       # URL do frontend em produção (opcional, para CORS)
```

---

## 🔑 Configurações Importantes no MongoDB Atlas

### IP Allowlist (Network Access)
- Para deploy no Vercel: adicione `0.0.0.0/0` (qualquer IP)
- Para desenvolvimento local: adicione seu IP atual

### Usuário do Banco de Dados
- Database Access > Add New Database User
- Dê permissões de **Read and Write to any database**
- Use autenticação por senha (SCRAM)

---

## 📦 Deploy do Frontend (separado do backend)

Se quiser fazer deploy do frontend separado no Vercel:

1. Suba apenas a pasta `frontend/public/` para outro repositório
2. Configure no `app.js` a URL da API:
   ```javascript
   const API_URL = 'https://seu-backend.vercel.app/api/exercicios';
   ```
3. Adicione a URL do frontend no backend como `FRONTEND_URL`

---

## ✅ Funcionalidades

- [x] CRUD completo de exercícios
- [x] Filtros por grupo muscular, nível e busca textual
- [x] Ativar/desativar exercícios
- [x] Estatísticas em tempo real
- [x] Design responsivo (mobile-first)
- [x] PWA instalável
- [x] Service Worker com cache offline
- [x] Integração com MongoDB Atlas

---

## 🛠️ Tecnologias

- **Backend:** Node.js, Express, Mongoose, CORS, dotenv
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Banco:** MongoDB Atlas
- **Deploy:** Vercel
- **PWA:** Service Worker, Web App Manifest

