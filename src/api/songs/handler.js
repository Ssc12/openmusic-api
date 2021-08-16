class SongHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;

      this.postSongHandler = this.postSongHandler.bind(this);
      this.getSongsHandler = this.getSongsHandler.bind(this);
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
      this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, respn) {
      try {
        this._validator.validateSongPayload(request.payload);
        const { title, year, performer, genre = 'unspecified', duration = 0 } = request.payload;

        const songId = await this._service.addSong({ title, year, performer, genre, duration });

        const response = respn.response({
          status: 'success',
          message: 'Lagu berhasil ditambahkan',
          data: {
            songId,
          },
        });
        response.code(201);
        return response;
      } catch (error) {
          return error;
      }
    }

    async getSongsHandler() {
      try {
        const songs = await this._service.getSongs();
         return {
           status: 'success',
           data: {
             songs,
           },
         };
      } catch (error) {
        return error;
      }
    }

    async getSongByIdHandler(request, respn) {
        try {
          const { songId } = request.params;
          const song = await this._service.getSongById(songId);

          const response = respn.response({
            status: 'success',
            data: {
               song,
            },
          });
          response.code(200);
          return response;
        } catch (error) {
          return error;
        }
    }

    async putSongByIdHandler(request, respn) {
        try {
          this._validator.validateSongPayload(request.payload);
          const { title, year, performer, genre = 'unspecified', duration = 0 } = request.payload;
          const { songId } = request.params;

          await this._service.editSongById(songId, { title, year, performer, genre, duration });

          const response = respn.response({
            status: 'success',
            message: 'lagu berhasil diperbarui',
          });
          response.code(200);
          return response;
        } catch (error) {
          return error;
        }
    }

    async deleteSongByIdHandler(request, respn) {
        try {
          const { songId } = request.params;
          await this._service.deleteSongById(songId);

          const response = respn.response({
            status: 'success',
            message: 'lagu berhasil dihapus',
          });
          response.code(200);
          return response;
        } catch (error) {
          return error;
        }
    }
}

module.exports = SongHandler;
