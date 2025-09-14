.PHONY: build

build:
	docker build . -t redis-starter:svelte

publish:
	docker tag redis-starter:node yababay/redis-starter:node
	docker push yababay/redis-starter:node

start:
	docker run --rm -d -p 6377:6379 --env-file .env --name redis-starter redis-starter

node:
	docker run --rm -d -p 6377:6379 --env-file .env --name redis-starter redis-starter:node

records:
	docker run --rm -d -p 6377:6379 --env-file .env --name redis-starter redis-starter:records

svelte:
	docker run --rm -d -p 6377:6379 -p 3000:3000 --env-file .env --name redis-starter redis-starter:svelte

bash:
	docker exec -it redis-starter /bin/bash

stop:
	docker container stop redis-starter

status:
	docker container ls | grep redis-starter


