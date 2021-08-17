class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
      this._authenticationsService = authenticationsService;
      this._usersService = usersService;
      this._tokenManager = tokenManager;
      this._validator = validator;

      this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
      this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
      this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, respn) {
        try {
          this._validator.validatePostAuthenticationPayload(request.payload);

          const { username, password } = request.payload;
          const id = await this._usersService.verifyUserCredential(username, password);

          const accessToken = this._tokenManager.generateAccessToken({ id });
          const refreshToken = this._tokenManager.generateRefreshToken({ id });

          await this._authenticationsService.addRefreshToken(refreshToken);

          const response = respn.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
              accessToken,
              refreshToken,
            },
          });
          response.code(201);
          return response;
        } catch (error) {
          return error;
        }
    }

    async putAuthenticationHandler(request, respn) {
        try {
           this._validator.validatePutAuthenticationPayload(request.payload);

           const { refreshToken } = request.payload;
           await this._authenticationsService.verifyRefreshToken(refreshToken);
           const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

           const accessToken = this._tokenManager.generateAccessToken({ id });

          const response = respn.response({
            status: 'success',
            message: 'Authentication berhasil diperbarui',
            data: {
                accessToken,
            },
          });
          response.code(200);
          return response;
        } catch (error) {
          return error;
        }
    }

    async deleteAuthenticationHandler(request, respn) {
        try {
          this._validator.validateDeleteAuthenticationPayload(request.payload);

          const { refreshToken } = request.payload;
          await this._authenticationsService.verifyRefreshToken(refreshToken);
          await this._authenticationsService.deleteRefreshToken(refreshToken);

          const response = respn.response({
            status: 'success',
            message: 'Refresh token berhasil dihapus',
          });
          response.code(200);
          return response;
        } catch (error) {
          return error;
        }
    }
}

module.exports = AuthenticationsHandler;
