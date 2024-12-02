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
docker-compose up -d --build
docker exec -it db mysql -u root -p

CREATE USER 'arm'@'%' IDENTIFIED BY 'strong';
GRANT ALL PRIVILEGES ON devicemanager.* TO 'arm'@'%';
FLUSH PRIVILEGES;

docker exec -it server /bin/bash
npx prisma db push
```

## Notes

### Initialize mysql dev

```
docker run --name mysql -e MYSQL_ROOT_PASSWORD=[] -e MYSQL_DATABASE=devicemanager -e MYSQL_USER=[] -e MYSQL_PASSWORD=[] -p 3306:3306 -d --restart=always mysql:8.2.0
docker exec -it mysql mysql -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'arm'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### Migrate prisma

```
npx prisma migrate dev --name []
npx prisma generate
```
