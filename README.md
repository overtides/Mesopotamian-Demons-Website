# Demons of Mesopotamia

An educational website exploring demons and supernatural figures from ancient Mesopotamian mythology.

**Live Site:** [View Website](https://overtides.github.io/Mesopotamian-Demons-Website/)

## Features

- Dedicated pages for Gallu, Lamashtu, Lilitu, and Pazuzu
- Historical information and artifact imagery
- Responsive desktop and mobile design
- Automated deployment through GitHub Pages

## Technologies

HTML, CSS, Jekyll, Docker, GitHub Actions

## Run Locally

Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop/), then clone the repository:

```bash
git clone https://github.com/overtides/Mesopotamian-Demons-Website.git
cd Mesopotamian-Demons-Website
```

Build and run the website:

```bash
docker build -t mesopotamian-demons .
docker run --rm -p 4000:4000 -v "$(pwd):/site" mesopotamian-demons
```

Open [http://localhost:4000/Mesopotamian-Demons-Website/](http://localhost:4000/Mesopotamian-Demons-Website/) in your browser.

## Sources

See the [Sources page](https://overtides.github.io/Mesopotamian-Demons-Website/sources.html) for references and further reading.