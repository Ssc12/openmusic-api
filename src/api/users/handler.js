class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, respn) {
    try {
        this._validator.validateUserPayload(request.payload);
        const { username, password, fullname } = request.payload;

        const userId = await this._service.addUser({ username, password, fullname });

        const response = respn.response({
          status: 'success',
          message: 'User berhasil ditambahkan',
          data: {
            userId,
          },
        });
        response.code(201);
        return response;
    } catch (error) {
      return error;
    }
  }

  async getUserByIdHandler(request, respn) {
    try {
      const { userId } = request.params;

      const user = await this._service.getUserById(userId);

      const response = respn.response({
        status: 'success',
        data: {
            user,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsersHandler;
