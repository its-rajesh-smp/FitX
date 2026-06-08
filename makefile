dev:
	docker compose down -v
	docker compose build --no-cache api-service
	docker compose up -d db
	docker compose up api-service