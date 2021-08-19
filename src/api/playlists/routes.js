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
    {
      method: 'POST',
      path: '/playlists/{playlistId}/songs',
      handler: handler.postSongToPlaylistHandler,
      options: {
        auth: 'musicapp_playlists_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists/{playlistId}/songs',
      handler: handler.getSongsFromPlaylistHandler,
      options: {
        auth: 'musicapp_playlists_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{playlistId}/songs',
      handler: handler.deleteSongFromPlaylistByIdHandler,
      options: {
        auth: 'musicapp_playlists_jwt',
      },
    },
];

module.exports = routes;
