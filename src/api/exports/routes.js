const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportPlaylistsHandler,
    options: {
        auth: 'musicapp_playlists_jwt',
    },
  },
];

module.exports = routes;
