import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

interface ApiResponse<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

interface ApiOperations<T> {
    fetch: ApiResponse<T> & { fetchData: (config?: AxiosRequestConfig) => Promise<void> };
    put: ApiResponse<T> & { putData: (url: string, body: any) => Promise<void> };
    delete: ApiResponse<T> & { deleteData: (url: string) => Promise<void> };
}

axios.defaults.baseURL = "https://660160fd87c91a11641ab523.mockapi.io";
export const useAxiosFetch = <T = any>(): ApiOperations<T> => {
    const [fetchDataState, setFetchDataState] = useState<T | null>(null);
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<Error | null>(null);

    const [putDataState, setPutDataState] = useState<T | null>(null);
    const [putLoading, setPutLoading] = useState<boolean>(false);
    const [putError, setPutError] = useState<Error | null>(null);

    const [deleteDataState, setDeleteDataState] = useState<T | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<Error | null>(null);

    const fetchData = useCallback(async (config?: AxiosRequestConfig) => {
        if (config) {
            setFetchLoading(true);
            try {
                const response = await axios({ ...config });
                setFetchDataState(response.data);
                setFetchError(null);
            } catch (error) {
                console.log(error, "Hereeee")
                setFetchError(error as Error);
            }
            setFetchLoading(false);
        }
    }, []);

    const putData = useCallback(async (url: string, body: any) => {
        setPutLoading(true);
        try {
            const response = await axios.put<T>(url, body);
            setPutDataState(response.data);
            setPutError(null);
        } catch (error) {
            setPutError(error as Error);
            throw error;
        }
        setPutLoading(false);
    }, []);

    const deleteData = useCallback(async (url: string) => {
        setDeleteLoading(true);
        try {
            await axios.delete(url);
            setDeleteDataState(null);
            setDeleteError(null);
        } catch (error) {
            setDeleteError(error as Error);
        }
        setDeleteLoading(false);
    }, []);

    useEffect(() => {
        fetchData(); // Initial call (optional)
    }, [fetchData]);

    return {
        fetch: { data: fetchDataState, loading: fetchLoading, error: fetchError, fetchData },
        put: { data: putDataState, loading: putLoading, error: putError, putData },
        delete: { data: deleteDataState, loading: deleteLoading, error: deleteError, deleteData }
    };
};
