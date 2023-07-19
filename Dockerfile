ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk add --no-cache --update nodejs npm wget curl

COPY . /load-manager-addon

RUN chmod +x /load-manager-addon/run.sh

CMD [ "/load-manager-addon/run.sh" ]