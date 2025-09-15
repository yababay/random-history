.PHONY: build

build:
	docker build . -t redis-starter:random-history

start:
	docker run -v /media/portable/.3f-lab/_humanitarian/random-history/.data/:/data --rm -d -p 6377:6379 --env-file .env --name redis-starter redis-starter:random-history

publish:
	docker tag redis-starter:random-history cr.yandex/crpfd9cholo7rk9upkma/redis-starter:random-history
	docker push cr.yandex/crpfd9cholo7rk9upkma/redis-starter:random-history

bash:
	docker exec -it redis-starter /bin/bash

stop:
	docker container stop redis-starter

status:
	docker container ls | grep redis-starter
