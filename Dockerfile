FROM node:16
RUN npm install @vue/cli@3.7.0 -g


WORKDIR /var/www/frontend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
# COPY . .
# RUN npm run build
# CMD ["npm", "run", "build"]
# EXPOSE 8080
