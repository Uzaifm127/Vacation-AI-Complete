## Getting Started

First, copy the env variables from .env.example to .env:

```bash
cp .env.example .env
```

Second, go to [Google gemini](https://ai.google.dev/) and get your Gemini api key then make your env variable from it.

Second, build the docker image:

```bash
docker build -t vacation-image .
```

Third, start the docker container:

```bash
docker run -it -p 3000:3000 vacation-image
```