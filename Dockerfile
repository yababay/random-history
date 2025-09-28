FROM yababay/node:v24

COPY build /srv

WORKDIR /srv

ENTRYPOINT [ "node", "." ]
