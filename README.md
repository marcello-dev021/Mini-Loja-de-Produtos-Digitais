# Mini-Loja-de-Produtos-Digitais

## Backend

1. Instale as dependências: `npm install`
2. Configure o banco de dados PostgreSQL e defina DATABASE_URL no .env
3. Execute as migrações: `npx prisma migrate deploy`
4. Gere o cliente Prisma: `npx prisma generate`
5. Inicie o servidor: `npm start`

## Frontend

O frontend é servido estaticamente pelo backend. Acesse http://localhost:3000/login.html

Para desenvolvimento, inicie o backend e abra o navegador.