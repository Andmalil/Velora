# Velora — React + Go/Gin + PostgreSQL

Магазин компьютерной техники на основе проекта `C:/Users/Andy/Documents/University/Velora`. Сохранены оформление, компоненты и демонстрационный каталог исходника. Рабочая версия находится в текущем репозитории; исходная папка не изменяется.

## Возможности

- React + TypeScript + Vite: адаптивная витрина, поиск, категории, сортировка, карточки товаров.
- Go + Gin + pgx: каталог из PostgreSQL, гостевая корзина, оформление заказа.
- Корзина хранится в PostgreSQL и привязана к случайной HttpOnly-cookie (30 дней).
- Сервер рассчитывает сумму по ценам в БД; доставка бесплатна от $100, иначе $9.90.
- Заказ, списание остатков и очистка корзины выполняются в одной транзакции. Блокировки защищают от продажи последнего товара двум покупателям. Повтор запроса с тем же requestId возвращает существующий заказ.
- Оформление сохраняет заказ со статусом pending. Онлайн-оплата и отправка писем не подключены.

## Запуск через Docker

Установите и запустите Docker Desktop. В корне проекта:

```powershell
Copy-Item .env.example .env
docker compose up --build -d
```

Сайт: http://localhost:3000. Проверка API: http://localhost:8080/api/health.

База доступна контейнеру API по адресу `db:5432`; её порт не публикуется на Windows, чтобы не конфликтовать с локальной PostgreSQL. Для SQL-консоли используйте `docker compose exec db psql -U velora -d velora` (если меняли имя пользователя или базы в .env, подставьте свои значения).

PostgreSQL автоматически создаёт таблицы и добавляет 8 товаров при первом запуске с пустым томом. Данные сохраняются в томе pgdata. Остановка без удаления данных: `docker compose down`.

SQL-скрипты инициализации не запускаются повторно для существующего тома. Для БД со старой схемой примените только `database/002_checkout.sql` один раз. Не удаляйте том с рабочими данными для обновления схемы.

## Разработка без Docker

Нужны Node.js 22+, Go 1.23+ и PostgreSQL 17+.

Создайте пустую базу velora и выполните по порядку:

```powershell
psql -U postgres -d velora -v ON_ERROR_STOP=1 -f database/schema.sql
psql -U postgres -d velora -v ON_ERROR_STOP=1 -f database/002_checkout.sql
psql -U postgres -d velora -v ON_ERROR_STOP=1 -f database/seed.sql
```

Backend, отдельный терминал:

```powershell
cd backend
$env:DATABASE_URL='postgres://velora:YOUR_PASSWORD@localhost:5432/velora?sslmode=disable'
go run ./cmd/server
```

Frontend, другой терминал:

```powershell
cd frontend
npm ci
npm run dev
```

Vite проксирует /api в localhost:8080; открывайте адрес, напечатанный Vite. Настройка CORS не требуется. В production Nginx обслуживает React и проксирует API через тот же origin.

## Проверки

```powershell
cd frontend
npm run build
cd ../backend
go test ./...
go vet ./...
# Дополнительно: интеграционные тесты с PostgreSQL.
$env:TEST_DATABASE_URL='postgres://velora:YOUR_PASSWORD@localhost:5432/velora?sslmode=disable'
go test -v ./...
```

Интеграционные тесты создают отдельную случайную схему и удаляют только её. Пользователю БД нужно право CREATE SCHEMA. Проверяются изоляция корзин, валидация, серверная сумма, повтор заказа, списание остатков, конкурентная покупка и отклонение стороннего Origin.

## API

| Метод | Путь | Назначение |
| --- | --- | --- |
| GET | /api/health | Проверка соединения с БД |
| GET | /api/products | Каталог |
| GET | /api/cart | Корзина текущей гостевой сессии |
| PUT | /api/cart/:id | JSON {"quantity": 1}; 0 удаляет товар |
| POST | /api/orders | JSON с name, email, address, requestId |

## Структура

- frontend/src — React-компоненты, стили SCSS, API-клиент и hooks.
- backend/cmd/server/main.go — точка входа.
- backend/internal/app — запуск HTTP-сервера, маршруты и интеграционные тесты.
- backend/internal/handler — HTTP-обработчики, валидация запросов и ответы API.
- backend/internal/store — подключение PostgreSQL, SQL-запросы и транзакции заказов.
- backend/internal/middleware — ограничения запросов, проверка Origin и гостевые cookie.
- database — исходная схема, миграция гостевых корзин и заказов, seed.
- compose.yaml — PostgreSQL, Go API и Nginx с React.

Каталог, цены, оценки и отзывы демонстрационные; валюта USD сохранена из исходника. Файл frontend/src/data/products.ts содержит типы и исходные данные для seed, но витрина получает товары только через API. Старая таблица cart_items сохранена для совместимости; действующая гостевая корзина использует guest_cart_items.

Перед публичным запуском задайте собственный пароль БД, HTTPS и COOKIE_SECURE=true. Учётные записи, админ-панель и платёжный провайдер не входят в эту версию.

## Предпросмотр в текущей сессии

Для проверки был запущен сайт http://127.0.0.1:5174/ с Go API на :8080 и отдельной локальной PostgreSQL 18 на 127.0.0.1:55432. Её данные лежат в .runtime/pg-local (не включаются в Git). В этой локальной базе есть один тестовый заказ с вымышленными контактами. Этот экземпляр использует trust-аутентификацию и предназначен только для локальной проверки.

Проверены production-сборка frontend, go test, go vet, интеграционные тесты PostgreSQL и оформление заказа через браузер. Docker Compose проверен на корректность конфигурации; контейнерная сборка не проверена, поскольку Docker Hub не ответил при загрузке образа PostgreSQL.
