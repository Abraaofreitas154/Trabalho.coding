# Deploy no Render

## 1. Configurar variáveis de ambiente no Render Dashboard:
```
MONGODB_URI= sua_connection_string_do_mongo_atlas
FRONTEND_URL=https://trabalho-coding.onrender.com
NODE_ENV=production
```

## 2. Build/Start Commands (padrão Render):
```
Build: Skip build (ou vazio)
Start: npm start
```

## 3. Estrutura esperada pelo Render:
```
src/
  └── index.js  ← entrypoint
server.js
package.json
```

## 4. Testar:
```
GET https://trabalho-coding.onrender.com/health
GET https://trabalho-coding.onrender.com/api/exercicios
```

## 5. Frontend separado:
O frontend está em `../frontend/` e deve ser deployado separadamente (Vercel/Netlify) ou servido pelo backend (futuro).

---
**Status:** ✅ Estrutura corrigida para Render

