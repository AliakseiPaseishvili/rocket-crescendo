type FormUrlParams = {
  url: string;
  params?: Record<string, string | boolean | number | string[]>;
};

export const formUrlParams = ({ url, params }: FormUrlParams): string => {
  if (params) {
    return Object.entries(params).reduce((finalUrl, [key, value]) => {
      return finalUrl.replace(
        `:${key}`,
        Array.isArray(value) ? value.join(',') : `${value}`,
      );
    }, url);
  }
  return url;
};

export const formSearchParams = ({ url, params }: FormUrlParams): string => {
  if (params) {
    // Convert the params object into an array of [key, value] pairs
    const entries: string[][] = Object.entries(params).flatMap(
      ([key, value]) => {
        if (Array.isArray(value)) {
          // If the value is an array, create a pair for each element
          return value.filter((v) => v).map((v) => [key, v]);
        } else if (value) {
          // If the value is a string, create a single pair
          return [[key, `${value}`]];
        } else {
          // Filter out nullish values
          return [];
        }
      },
    );

    const queryAsString = new URLSearchParams(entries).toString();
    return `${url}${queryAsString ? `?${queryAsString}` : ''}`;
  }

  return url;
};