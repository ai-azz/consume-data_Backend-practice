const http = require('http');  // http core module to create a server
const url = require('url');  // built-in url module to parse the request url

const users = ['Aras', 'Arsy', 'Dimas', 'Ivan', 'Rafy', 'Gilang'];
const MISSING = 4;  // define a constant for simulating a "not found" condition

const server = http.createServer((req, res) => {
  // parse the request url and extract the pathname
  const { pathname } = url.parse(req.url);
  let id = pathname.match(/^\/(\d+)$/);  // mathc the pathname to extract the id
  
  // if id is not falid, response 400 bad request 
  if (!id) {
    res.statusCode = 400;
    return void res.end();
  }

  id = Number(id[1]);  // convert the id to a number

  if (id === MISSING) {
    res.statusCode = 404;
    return void res.end();
  }

  res.setHeader('Content-Type', 'application/json');

  // respond with a json object containing the id and corresponding user name 
  res.end(JSON.stringify({
    id,
    name: users[id % users.length],  // use module to cycle through the user names
  }));
});

server.listen(process.env.PORT || 0, () => {
  const { port } = server.address();
  console.log(`User service listening on localhost on port: ${port}`);
});