FROM mariadb:latest
MAINTAINER Nathan Perkins

COPY ./sql/1_ddl.sql /docker-entrypoint-initdb.d
COPY ./sql/2_dump.sql /docker-entrypoint-initdb.d