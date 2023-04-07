class HttpException extends Error {
  constructor(public readonly message: string | any) {
    super(message);
  }
}

export default HttpException;
