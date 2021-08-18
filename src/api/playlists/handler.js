class PlaylistHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;

      this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
      this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
      this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, respn) {
        try {
          this._validator.validatePlaylistPayload(request.payload);
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
}

module.exports = PlaylistHandler;
