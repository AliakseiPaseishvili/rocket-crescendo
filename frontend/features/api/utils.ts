import { formUrlParams, formSearchParams } from "@/frontend/utils/form-url";

type Body = Record<string, boolean | string | number | object>;
type Params = Record<string, string | boolean | number | string[]>;

export const executeRequest = async <T>({
  url,
  method,
  options = {},
}: {
  url: string;
  method: string;
  options?: {
    body?: Body;
    query?: Params;
    params?: Params;
  };
}): Promise<T> => {
  const { body, query, params } = options;

  let resolvedUrl = url;

  if (params) {
    resolvedUrl = formUrlParams({ url, params });
  }

  if (query && Object.keys(query).length) {
    resolvedUrl = formSearchParams({
      url: resolvedUrl,
      params: query,
    });
  }

  const response = await fetch(resolvedUrl, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
};
