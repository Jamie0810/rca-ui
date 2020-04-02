# build environment
# FROM node:9.6.1 as builder
# RUN mkdir /usr/src/app
# WORKDIR /usr/src/app
# ENV PATH /usr/src/app/node_modules/.bin:$PATH
# COPY package.json /usr/src/app/package.json
# RUN npm install --silent
# RUN npm install react-scripts@1.1.1 -g --silent
# COPY . /usr/src/app
# RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
# RUN rm /etc/nginx/conf.d/default.conf
COPY config/rca.com.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/
# COPY team.jpg /home/web/
COPY ./build /home/web
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
