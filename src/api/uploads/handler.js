class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, respn) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);

      const filename = await this._service.writeFile(data, data.hapi);

      const response = respn.response({
        status: 'success',
        data: {
           pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = UploadsHandler;
