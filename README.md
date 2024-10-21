# Horus Next

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Node version: v20.10.0

## Development

### BE (Agora token server)

Go to `docker-server` folder

```bash
cd docker-server
```

Copy `.env.example` to `.env` and fill the required values (AGORA_APP_ID, AGORA_APP_CERTIFICATE)

```bash
cp .env.example .env
```

### FE (Horus Next App)

Copy `.env.example` to `.env` and fill the required values (APP_PORT, SERVER_PORT, VITE_TOKEN_ENDPOINT)

```bash
cp .env.example .env
```

Install package

```bash
npm install
```

Build docker containers (BE, FE) and run it

```bash
docker compose build
docker compose up -d
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173/room/test1](http://localhost:5173/room/test1) with your browser to see the result.

## Deploy

### BE (Agora token server)

Go to `docker-server` folder

```bash
cd docker-server
```

Copy `.env.example` to `.env` and fill the required values (AGORA_APP_ID, AGORA_APP_CERTIFICATE)

```bash
cp .env.example .env
```

### FE (Horus Next App)

Copy `.env.example` to `.env` and fill the required values (APP_PORT, SERVER_PORT)

```bash
cp .env.example .env
```

Build docker containers (BE, FE) and run it

```bash
docker compose build
docker compose up -d
```
