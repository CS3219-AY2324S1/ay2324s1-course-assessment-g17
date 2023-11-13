FROM nginx

WORKDIR /app

COPY nginx.conf .

CMD ["nginx", "-c", "/app/nginx.conf", "-g", "daemon off;"]

