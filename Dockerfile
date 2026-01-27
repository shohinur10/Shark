FROM node:20.10.0

# Set working directory
WORKDIR /usr/src/shark-next

# Copy package files
COPY package.json ./
COPY yarn.lock ./

# Install dependencies with retry and timeout settings
# Clean yarn cache before install to save space
RUN yarn cache clean && \
    yarn config set network-timeout 300000 && \
    yarn config set registry https://registry.npmjs.org/ && \
    yarn install --frozen-lockfile --network-timeout 300000 && \
    yarn cache clean

# Copy source code (excluding node_modules and other files via .dockerignore)
COPY . .

# Set default environment variables for build (can be overridden)
ARG REACT_APP_API_URL=http://localhost:4000
ARG REACT_APP_API_GRAPHQL_URL=http://localhost:4000/graphql
ARG REACT_APP_API_WS=ws://localhost:4000/graphql

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_API_GRAPHQL_URL=$REACT_APP_API_GRAPHQL_URL
ENV REACT_APP_API_WS=$REACT_APP_API_WS

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Start production server
CMD ["yarn", "start"]
