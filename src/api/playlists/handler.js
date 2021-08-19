class PlaylistHandler {
    constructor(service, PlaylistsValidator, PlaylistSongValidator) {
      this._service = service;
      this._PlaylistsValidator = PlaylistsValidator;
      this._PlaylistSongValidator = PlaylistSongValidator;

      this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
      this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
      this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
      this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
      this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
      this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, respn) {
        try {
          this._PlaylistsValidator.validatePlaylistPayload(request.payload);
          const { name } = request.payload;
          const { id: credentialId } = request.auth.credentials;

          const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

          const response = respn.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
              playlistId,
            },
          });
          response.code(201);
          return response;
        } catch (error) {
            return error;
        }
    }

    async getPlaylistsHandler(request, respn) {
        const { id: credentialId } = request.auth.credentials;

        const playlists = await this._service.getPlaylistByUserId(credentialId);

        const response = respn.response({
            status: 'success',
            data: {
              playlists,
            },
        });
        response.code(200);
        return response;
    }

    async deletePlaylistByIdHandler(request, respn) {
        try {
          const { playlistId } = request.params;
          const { id: credentialId } = request.auth.credentials;

          await this._service.verifyPlaylistOwner(playlistId, credentialId);
          await this._service.deletePlaylistById(playlistId);

          const response = respn.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
          });
          response.code(200);
          return response;
        } catch (error) {
          return error;
        }
    }

    async postSongToPlaylistHandler(request, respn) {
      try {
        this._PlaylistSongValidator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;
        await this._service.verifySongById(songId);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;
        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        await this._service.addSongToPlaylist({ playlistId, songId });

        const response = respn.response({
          status: 'success',
          message: 'Lagu berhasil ditambahkan ke playlist',
        });
        response.code(201);
        return response;
      } catch (error) {
          return error;
      }
    }

    async getSongsFromPlaylistHandler(request, respn) {
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        const songs = await this._service.getSongsFromPlaylist(playlistId);

        const response = respn.response({
            status: 'success',
            data: {
              songs,
            },
        });
        response.code(200);
        return response;
    }

    async deleteSongFromPlaylistByIdHandler(request, respn) {
      try {
        this._PlaylistSongValidator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;
        await this._service.verifySongById(songId);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;
        await this._service.verifyPlaylistAccess(playlistId, credentialId);

        await this._service.deleteSongFromPlaylistBySongId({ playlistId, songId });

        const response = respn.response({
          status: 'success',
          message: 'Lagu berhasil dihapus dari playlist',
        });
        response.code(200);
        return response;
      } catch (error) {
          return error;
      }
    }
}

module.exports = PlaylistHandler;
