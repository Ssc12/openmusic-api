const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, PlaylistsValidator, PlaylistSongValidator }) => {
    const playlistHandler = new PlaylistHandler(service, PlaylistsValidator, PlaylistSongValidator);
    server.route(routes(playlistHandler));
  },
};
