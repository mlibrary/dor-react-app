FROM node:24

ARG UNAME=app
ARG UID=1000
ARG GID=1000

# Install additional tools if needed
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    curl \
    vim \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME
RUN mkdir /app
RUN chown $UID:$GID /app
COPY --chown=$UID:$GID . /app
USER $UNAME
WORKDIR /app
CMD ["sleep", "infinity"]
EXPOSE 4173
EXPOSE 5173
