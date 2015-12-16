# get latest Node.js distribution
FROM node:latest

# create directories and clone Bag repo
RUN mkdir -p /usr/src/
WORKDIR /usr/src/
RUN git clone -v --progress https://github.com/adrianp/bag.git #redo
WORKDIR /usr/src/bag/

# install Bag (this will take a while due to NPM)
RUN npm install --production --unsafe-perm

# open network port
EXPOSE 3000

# start Bag
CMD ["npm", "start"]
