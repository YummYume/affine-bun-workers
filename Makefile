COMPOSE=docker compose
EXEC=$(COMPOSE) exec workers

up:
	$(COMPOSE) up -d --force-recreate --remove-orphans

stop:
	$(COMPOSE) stop

restart:
	$(COMPOSE) restart

down:
	$(COMPOSE) down

rm:
	$(COMPOSE) rm

logs:
	$(COMPOSE) logs

logs-workers:
	$(COMPOSE) logs workers

ps:
	$(COMPOSE) ps

ssh:
	$(EXEC) bash

link:
	$(EXEC) bun run lint

format:
	$(EXEC) bun run format

test:
	$(EXEC) bun test
