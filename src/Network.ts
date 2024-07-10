import axios, { AxiosError } from "axios";
import { requestResponse } from "./Interfaces";

export const baseURL = "http://localhost:3001/"
// export const baseURL = "https://44.220.164.141.nip.io/"

const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

export async function get<T>(path: string, params: Record<string, unknown>): Promise<requestResponse<T>> {
    try {
        const response = await apiClient.get(path, { params })
        if (response.status >= 200 && response.status <= 299) {
            return { success: true, data: response.data }
        }
        return { success: false, data: response.data }
    } catch (err: unknown) {
        console.error(err)
        if (err instanceof AxiosError && err.response && err.response.data) {
            return { success: false, data: err.response.data };
        }
        if (err instanceof AxiosError && err.message) {
            return { success: false, data: err.message };
        }
        return { success: false, data: "An unknown error ocurred." };
    }
}

export async function post<T>(path: string, params?: Record<string, unknown>, body?: Record<string, unknown>): Promise<requestResponse<T>> {
    try {
        const response = await apiClient.post(path, body, { params: params })
        if (response.status >= 200 && response.status <= 299) {
            return { success: true, data: response.data }
        }
        return { success: false, data: response.data }
    } catch (err: unknown) {
        console.error(err)
        if (err instanceof AxiosError && err.response && err.response.data) {
            return { success: false, data: err.response.data };
        }
        if (err instanceof AxiosError && err.message) {
            return { success: false, data: err.message };
        }
        return { success: false, data: "An unknown error ocurred." };
    }
}