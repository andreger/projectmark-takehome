export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class VersionConflictError extends Error {
  constructor() {
    super("Version conflict");
    this.name = "VersionConflictError";
  }
}
