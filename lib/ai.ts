export class AiStepError extends Error {
  readonly status: number;
  readonly retryable: boolean;

  constructor(message: string, status: number, retryable: boolean) {
    super(message);
    this.name = "AiStepError";
    this.status = status;
    this.retryable = retryable;
  }
}