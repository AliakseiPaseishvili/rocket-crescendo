export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type RequestMap<T> = {
  [key in keyof T]: { url: string; method: HttpMethod; };
};

export type RequestProps<Data, Params, Query> = {
  body?: Data extends FormData ? FormData : Data;
  params?: Params;
  query?: Query;
};

export type RequestApiType<Data, Params, Query, ResponseType> = (
  props?: RequestProps<Data, Params, Query>,
) => Promise<ResponseType>;