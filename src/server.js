require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const songsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const songService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songService,
        validator: songsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // client error
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // server error
    if (response instanceof Error) {
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server internal kami.',
      });
      newResponse.code(500);
      return newResponse;
    }

    // other response
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
