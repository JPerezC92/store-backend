export enum StatusType {
  SUCCESS = 'success',
  FAIL = 'fail',
  ERROR = 'error',
}

export interface SuccessResponse {
  status: StatusType.SUCCESS;
  data: unknown;
}

export interface ErrorResponse {
  status: StatusType.ERROR;
  message: string;
}

export interface FailureResponse {
  status: StatusType.FAIL;
  data: Record<string, string> | string;
}
