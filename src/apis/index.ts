import axios, {AxiosResponse} from "axios";

/**
 * The function `GetData` is an asynchronous function in TypeScript that performs a GET request using
 * Axios with error handling.
 * @param {string} url - The `url` parameter is a string that represents the URL from which data will
 * be fetched.
 * @param params - The `params` parameter in the `GetData` function is a `Record<string, any>` type,
 * which means it is an object where the keys are strings and the values can be of any type. This
 * parameter is used to pass query parameters for the HTTP request when making a GET request using
 * @param headers - The `headers` parameter in the `GetData` function is used to specify any additional
 * HTTP headers that you want to include in the request. These headers can be used to provide
 * additional information to the server or to authenticate the request.
 * @returns The `GetData` function returns a Promise of type `T`, which is the generic type specified
 * when calling the function. The function makes a GET request to the provided `url` with optional
 * `params` and `headers`, and returns the data from the response if successful. If an error occurs
 * during the request, it logs the error message and throws the error.
 */
export const GetData = async <T>(
  url: string,
  params: Record<string, any> = {},
  headers: Record<string, any> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(url, {params, headers});
    return response.data;
  } catch (error: any) {
    console.error(
      "GET Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * The function `PostData` is an asynchronous function in TypeScript that sends a POST request to a
 * specified URL with data and headers, returning the response data.
 * @param {string} url - The `url` parameter is a string that represents the endpoint where the POST
 * request will be sent.
 * @param data - The `data` parameter in the `PostData` function represents the payload or data that
 * you want to send in the POST request to the specified `url`. It is a `Record<string, any>` type,
 * which means it is an object where the keys are strings and the values can be of
 * @param headers - The `headers` parameter in the `PostData` function is used to specify any
 * additional headers that should be included in the HTTP request when making a POST request to the
 * specified `url`. These headers can include information such as authentication tokens, content type,
 * or any other custom headers required by the server
 * @returns The `PostData` function returns a Promise of type `T`, which is the generic type specified
 * when calling the function. The function makes a POST request to the specified `url` with the
 * provided `data` and `headers`, and returns the data received in the response. If an error occurs
 * during the POST request, the function logs the error message and throws the error.
 */
export const PostData = async <T>(
  url: string,
  data: Record<string, any> = {},
  headers: Record<string, any> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(url, data, {headers});
    return response.data;
  } catch (error: any) {
    console.error(
      "POST Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * The function `PutData` sends a PUT request to a specified URL with data and headers, returning the
 * response data.
 * @param {string} url - The `url` parameter in the `PutData` function is a string that represents the
 * endpoint URL where the PUT request will be sent.
 * @param data - The `data` parameter in the `PutData` function is of type `Record<string, any>`, which
 * means it is an object where the keys are strings and the values can be of any type. This parameter
 * is used to send data in the body of the PUT request to the specified `
 * @param headers - The `headers` parameter in the `PutData` function is used to specify any additional
 * headers that should be included in the HTTP request when making a PUT request to the specified
 * `url`. These headers can contain information such as authentication tokens, content type, or any
 * other custom headers required by the server
 * @returns The `PutData` function returns a Promise that resolves to type `T`, which is specified when
 * calling the function. The function makes a PUT request to the provided `url` with the `data` and
 * `headers` provided, and returns the data from the response if the request is successful. If an error
 * occurs during the request, the function logs the error message and throws the error.
 */
export const PutData = async <T>(
  url: string,
  data: Record<string, any> = {},
  headers: Record<string, any> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.put(url, data, {headers});
    return response.data;
  } catch (error: any) {
    console.error(
      "PUT Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * The function `PatchData` is an asynchronous function in TypeScript that sends a PATCH request to a
 * specified URL with data and headers, returning the response data.
 * @param {string} url - The `url` parameter is a string that represents the endpoint where the PATCH
 * request will be sent.
 * @param data - The `data` parameter in the `PatchData` function represents the payload or data that
 * you want to send in the PATCH request to the specified `url`. It is a `Record<string, any>` type,
 * which means it is an object where the keys are strings and the values can be of any type.
 * @param headers - The `headers` parameter in the `PatchData` function is used to specify any
 * additional headers that should be included in the HTTP request when making a PATCH request to the
 * specified `url`. These headers can include information such as authentication tokens, content type,
 * or any other custom headers required by the server.
 * @returns The `PatchData` function returns a Promise of type `T`, which is the generic type specified
 * when calling the function. The function makes a PATCH request to the specified `url` with the
 * provided `data` and `headers`, and returns the data received in the response. If an error occurs
 * during the PATCH request, the function logs the error message and throws the error.
 */
export const PatchData = async <T>(
  url: string,
  data: Record<string, any> = {},
  headers: Record<string, any> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.patch(url, data, {headers});
    return response.data;
  } catch (error: any) {
    console.error(
      "PATCH Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

/**
 * The function `DeleteData` is an asynchronous function in TypeScript that sends a DELETE request to a
 * specified URL with optional parameters and headers, handling errors and returning the response data.
 * @param {string} url - The `url` parameter is a string that represents the endpoint URL where the
 * DELETE request will be sent to.
 * @param params - The `params` parameter in the `DeleteData` function is used to specify query
 * parameters that will be sent with the DELETE request. These parameters are typically used to filter
 * or provide additional information to the server when deleting data. For example, if you are deleting
 * a specific resource identified by an ID,
 * @param headers - The `headers` parameter in the `DeleteData` function is used to specify any
 * additional headers that should be included in the HTTP request when making a DELETE call to the
 * specified `url`. These headers can contain information such as authentication tokens, content type,
 * or any other custom headers required by the server
 * @returns The `DeleteData` function is returning a Promise that resolves to type `T`. The function
 * makes a DELETE request using Axios to the specified `url` with optional `params` and `headers`. If
 * the request is successful, it returns the data from the response. If an error occurs, it logs the
 * error message and throws the error.
 */
export const DeleteData = async <T>(
  url: string,
  params: Record<string, any> = {},
  headers: Record<string, any> = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.delete(url, {
      params,
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "DELETE Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
