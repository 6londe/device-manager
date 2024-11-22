# Device manager

## Prerequisites

```
cp .env.sample .env
```

## Run dev

```
nvm use 18.18.0
npm install
npm run dev
```

## Run prod

```
docker-compose up --build
```

## Notes

### Initialize mysql

```
docker run --name mysql -e MYSQL_ROOT_PASSWORD=[] -e MYSQL_DATABASE=devicemanager -e MYSQL_USER=[] -e MYSQL_PASSWORD=[] -p 3306:3306 -d --restart=always mysql:8.2.0
docker exec -it mysql /bin/bash
mysql -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'arm'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### Migrate prisma

```
npx prisma migrate dev --name []
npx prisma generate
```
