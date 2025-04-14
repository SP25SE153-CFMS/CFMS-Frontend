import config from '@/configs';
import { env } from '@/env';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';

/**
 * Create an Axios instance with default configurations.
 */
const axiosInstance: AxiosInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL, // Set API base URL
});

// Axios Response Interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // TODO: Handle error here
        // For example, redirect to login page if the access token is expired
        if (error.response?.status === 401) {
            window.location.href = config.routes.signIn;
        }

        return Promise.reject(error);
    },
);

/**
 * Creates an Axios instance for making HTTP requests.
 *
 * @param {string} endpoint - The API endpoint to which the request should be made.
 * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {object} [headers={}] - An object containing custom headers for the request. Default is an empty object.
 * @param {object} [params={}] - An object containing URL parameters for the request. Default is an empty object.
 * @param {object} [body={}] - An object containing the request body. Default is an empty object.
 * @returns {Promise} - A Promise that resolves to the response of the HTTP request.
 */
export const request = <T>(
    endpoint: string,
    method: string,
    headers: object = {},
    params: object = {},
    body: object = {},
): Promise<AxiosResponse<T>> => {
    const accessToken = getCookie(config.cookies.accessToken);

    const url = endpoint.startsWith('http') ? endpoint : env.NEXT_PUBLIC_API_URL + endpoint;

    return axiosInstance({
        url,
        method: method,
        headers: Object.assign(
            {},
            headers,
            accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        ),
        params: Object.assign(params),
        data: body,
    });
};

/**
 * Sends a GET request to the specified endpoint.
 *
 * @param {string} endpoint - The API endpoint to which the GET request should be made.
 * @param {object} [params={}] - An object containing URL parameters for the request. Default is an empty object.
 * @param {object} [headers={}] - An object containing custom headers for the request. Default is an empty object.
 * @returns {Axios} - An Axios instance for making the GET request.
 */
export const get = <T>(
    endpoint: string,
    params: object = {},
    headers: object = {},
): Promise<AxiosResponse<T>> => {
    return request<T>(endpoint, 'GET', headers, params);
};

/**
 * Sends a POST request to the specified endpoint.
 *
 * @param {string} endpoint - The API endpoint to which the POST request should be made.
 * @param {object} [body={}] - An object containing the request body. Default is an empty object.
 * @param {object} [params={}] - An object containing URL parameters for the request. Default is an empty object.
 * @param {object} [headers={}] - An object containing custom headers for the request. Default is an empty object.
 * @returns {Axios} - An Axios instance for making the POST request.
 */
export const post = <T>(
    endpoint: string,
    body: object = {},
    params: object = {},
    headers: object = {},
): Promise<AxiosResponse<T>> => {
    return request<T>(endpoint, 'POST', headers, params, body);
};

/**
 * Sends a PUT request to the specified endpoint.
 *
 * @param {string} endpoint - The API endpoint to which the PUT request should be made.
 * @param {object} [body={}] - An object containing the request body. Default is an empty object.
 * @param {object} [params={}] - An object containing URL parameters for the request. Default is an empty object.
 * @param {object} [headers={}] - An object containing custom headers for the request. Default is an empty object.
 * @returns {Axios} - An Axios instance for making the PUT request.
 */
export const put = <T>(
    endpoint: string,
    body: object = {},
    params: object = {},
    headers: object = {},
): Promise<AxiosResponse<T>> => {
    return request<T>(endpoint, 'PUT', headers, params, body);
};

/**
 * Sends a DELETE request to the specified endpoint.
 *
 * @param {string} endpoint - The API endpoint to which the DELETE request should be made.
 * @param {object} [body={}] - An object containing the request body. Default is an empty object.
 * @param {object} [params={}] - An object containing URL parameters for the request. Default is an empty object.
 * @param {object} [headers={}] - An object containing custom headers for the request. Default is an empty object.
 * @returns {Axios} - An Axios instance for making the DELETE request.
 */
export const remove = <T>(
    endpoint: string,
    body: object = {},
    params: object = {},
    headers: object = {},
): Promise<AxiosResponse<T>> => {
    return request<T>(endpoint, 'DELETE', headers, params, body);
};
