const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistHandler,
      options: {
        auth: 'musicapp_playlists_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistsHandler,
      options: {
        auth: 'musicapp_playlists_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{playlistId}',
      handler: handler.deletePlaylistByIdHandler,
      options: {
        auth: 'musicapp_playlists_jwt',
      },
    },
];

module.exports = routes;
