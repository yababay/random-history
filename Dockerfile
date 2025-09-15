FROM redis-starter:svelte

COPY .data/dump.rdb /data
RUN rm -rf /srv/random-history
COPY build /srv/random-history
