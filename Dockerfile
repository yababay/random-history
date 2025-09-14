FROM redis-starter:node

COPY build /srv/random-history

WORKDIR /
COPY scripts/svelte.sh .
RUN chmod +x *.sh

ENTRYPOINT ["/svelte.sh"]
