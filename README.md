
# Open Data Gunungkidul

Custom CKAN web frontend for Open Data Gunungkidul using Vue 3 




## Features

- Vue 3
- Typescript
- Single Page Application (SPA)
- Progressive Web App (PWA)
- Built in XLSX, DOCX, PDF, and Images Viewer


## Deployment

Make sure you have Node installed

Clone the repository

```bash
git clone https://github.com/avivbintangaringga/opendata-gk.git
```

Change the directory

```bash
cd opendata-gk
```

Change the variables inside the .env files
```env
VITE_CKAN_BASE_URL=https://data.demakkab.go.id/
VITE_CORS_PROXY=
```

Make sure CORS settings are enabled on the CKAN server, or use this CORS header injector

[Click here for the CORS Proxy](https://github.com/avivbintangaringga/cloudflare-cors-proxy)



Install dependencies using NPM
```bash
npm install
```

Build the project
```
npm run build
```

Copy the generated files inside the **dist** directory to your web hoster
## Demo

[Click here](https://opendata-gk.pages.dev)

