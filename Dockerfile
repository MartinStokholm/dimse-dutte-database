FROM node:24-bullseye-slim

WORKDIR /app

# Install runtime dependencies required by Prisma native engines
RUN apt-get update && \
    apt-get install -y --no-install-recommends libssl1.1 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --production=false --ignore-scripts=false

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
