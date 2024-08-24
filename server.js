const Hapi = require('@hapi/hapi');
const got = require('got');  // got library to make http requests

// destructure environment variables for ports, with defaults (port) if not provided
const {
  ORDER_SERVICE_PORT = 4000,
  USER_SERVICE_PORT = 5000,
} = process.env;

// construct the base URLs for the order and user services
const orderService = `http://localhost:${ORDER_SERVICE_PORT}`;
const userService = `http://localhost:${USER_SERVICE_PORT}`;

// define an asynchronous func to initialize the hapi server
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  // define server routes
  server.route([
    {
      method: 'GET',
      path: '/{id}',  // route path with a dynamic segment {id}
      handler: async (request, h) => {
        const { id } = request.params;  // extract the id from the route parameters

        try {
            // make parallel http GET request to the order and user services
            const [order, user] = await Promise.all([
            got(`${orderService}/${id}`).json(),
            got(`${userService}/${id}`).json(),
          ]);

          // combine the results from both services and return them
          return {
            id: order.id,  // id from order service
            menu: order.menu,  // menu item from order service
            user: user.name,  // user name from the user serive
          };
        } catch (error) {
            // handle errors for the requests
            if (!error.response) throw error;
            if (error.response.statusCode === 400) {
            return h.response({ message: 'bad request' }).code(400);
          }
          if (error.response.statusCode === 404) {
            return h.response({ message: 'not found' }).code(404);
          }

          throw error;  // re-throw any other errors
        }
      },
    },
  ]);
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
  console.log('Access http://localhost:3000/1 to test the program');
};

init();