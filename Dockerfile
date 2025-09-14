FROM redis/redis-stack-server

RUN apt update
RUN apt install wget unzip -y

WORKDIR /opt
RUN wget "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip"
RUN unzip awscli-exe-linux-x86_64.zip
RUN ./aws/install

RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

