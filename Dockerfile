FROM redis-starter:svelte

# COPY .data/dump.rdb /data
COPY scripts/svelte.sh /
RUN chmod +x /svelte.sh
RUN rm -rf /srv/random-history
COPY build /srv/random-history
