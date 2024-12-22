FROM postgres:13.16-bookworm

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

# Create directory for SSL certificates
RUN mkdir -p /var/lib/postgresql/certs

# Generate SSL certificates
RUN openssl req -new -x509 -days 365 -nodes -out /var/lib/postgresql/certs/server.crt -keyout /var/lib/postgresql/certs/server.key -subj "/CN=localhost"
RUN chmod 600 /var/lib/postgresql/certs/server.key

# Set the PostgreSQL configuration to use SSL
RUN cat /usr/share/postgresql/postgresql.conf.sample > /usr/share/postgresql/postgresql.conf \
    && echo "ssl = on" >> /usr/share/postgresql/postgresql.conf \
    && echo "ssl_cert_file = '/var/lib/postgresql/certs/server.crt'" >> /usr/share/postgresql/postgresql.conf \
    && echo "ssl_key_file = '/var/lib/postgresql/certs/server.key'" >> /usr/share/postgresql/postgresql.conf \
    && cp /usr/share/postgresql/postgresql.conf /docker-entrypoint-initdb.d/postgresql.conf