```bash
cp .env .env.example

docker pull mysql:8.0.26

docker run --name mysql-next-prisma -e MYSQL_ROOT_PASSWORD=prisma0123 -e MYSQL_DATABASE=prisma -d -p 5555:3306 mysql:8.0.26

yarn

npx prisma migrate dev

yarn run dev
```
http://localhost:3000/notes



