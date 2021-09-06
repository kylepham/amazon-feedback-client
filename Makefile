setup:
	@echo "Building image..."
	docker build -t amazon-feedback-client .
	@echo "Running docker compose..."
	docker-compose down
	docker-compose up -d
	sleep 30s

cleanup:
	docker-compose down