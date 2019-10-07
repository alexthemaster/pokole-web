# pokole-web
To be used with [Pokole](https://github.com/penfoldium/pokole)'s static files hosting feature

## 📝 Requirements
- [Node.js](https://nodejs.org/en/)

## ⚙️ Configuration
- `git clone https://github.com/penfoldium/pokole-web`
- `cd pokole-web`
- `npm install`
- Edit the [config.example.json](./src/config.example.json) file and rename it to `config.json`
- `npm run build`

Vue-CLI will build the webpage into the `/dist` folder, you being able to host these files with Pokole's static feature!