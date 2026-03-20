# КупиПодариДай

Сервис вишлистов, в котором можно делиться своими желаниями и скидываться на подарки.

## Ссылки

```
IP адрес x.x.x.x
Frontend https://your-domain.nomoreparties.co
Backend https://api.your-domain.nomoreparties.co
```

## Запуск через Docker Compose

1. Склонируйте репозиторий
2. Создайте файл `.env` на основе `.env.example`
3. Выполните `docker compose up -d`

Фронтенд будет доступен на `http://localhost:8081`, бэкенд на `http://localhost:4000`.

## Стек

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: React
- **Инфраструктура**: Docker, Docker Compose, Nginx, PM2
