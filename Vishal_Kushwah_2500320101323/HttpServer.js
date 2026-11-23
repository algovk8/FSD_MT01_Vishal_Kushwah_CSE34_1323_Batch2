const http = require('http');
const app = require('./ExpressApp');

const PORT = 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Library Book Management Server running on http://localhost:${PORT}`);
});