FROM andrius/asterisk:22.5.2_debian-bookworm

USER root

RUN mkdir -p /var/lib/apt/lists/partial \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
      unixodbc \
      libsqliteodbc \
      sqlite3 \
 && rm -rf /var/lib/apt/lists/*

# если в образе реально есть юзер asterisk — ок, если нет, удали эту строку
USER asterisk
