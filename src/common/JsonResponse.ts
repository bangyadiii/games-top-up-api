export interface JsonResponse<T> {
  statusCode: number;
  message: string;
  error?: T | undefined;
  data: T | [];
}
