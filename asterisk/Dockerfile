FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive
ARG ASTERISK_VERSION=22.7.0

# UID/GID, под которые ты хочешь подогнать volume (обычно 1000:1000)
ARG AST_UID=1000
ARG AST_GID=1000

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl xz-utils \
    build-essential pkg-config procps \
    libssl-dev libxml2-dev libncurses5-dev libedit-dev \
    uuid-dev libjansson-dev libsqlite3-dev \
    libcurl4-openssl-dev \
    libopus-dev \
    unixodbc unixodbc-dev libodbc1 libsqliteodbc sqlite3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

RUN curl -fL "https://downloads.asterisk.org/pub/telephony/asterisk/asterisk-${ASTERISK_VERSION}.tar.gz" \
  | tar xz

WORKDIR /usr/src/asterisk-${ASTERISK_VERSION}

RUN ./configure --with-jansson-bundled=no \
 && make menuselect.makeopts \
 && menuselect/menuselect --enable codec_opus menuselect.makeopts \
 && make -j"$(nproc)" \
 && make install \
 && make samples \
 && ldconfig

WORKDIR /
RUN rm -rf "/usr/src/asterisk-${ASTERISK_VERSION}"

# ---- user/group fix (idempotent) ----
RUN set -eux; \
  if ! getent group asterisk >/dev/null; then \
    groupadd -r -g "${AST_GID}" asterisk; \
  else \
    groupmod -o -g "${AST_GID}" asterisk; \
  fi; \
  if ! id asterisk >/dev/null 2>&1; then \
    useradd -r -u "${AST_UID}" -g "${AST_GID}" -d /var/lib/asterisk -s /usr/sbin/nologin asterisk; \
  else \
    usermod -o -u "${AST_UID}" -g "${AST_GID}" asterisk; \
  fi; \
  mkdir -p /var/run/asterisk /var/log/asterisk /var/spool/asterisk /var/lib/asterisk; \
  chown -R asterisk:asterisk /var/run/asterisk /var/log/asterisk /var/spool/asterisk /var/lib/asterisk

USER asterisk
CMD ["asterisk", "-f", "-U", "asterisk", "-G", "asterisk"]
