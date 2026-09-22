FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]

# to run this 
# docker build -t snippet-api .
# docker run -p 5000:5000 --env-file .env snippet-api