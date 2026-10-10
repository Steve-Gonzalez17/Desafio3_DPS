import { api } from "./api";
import { Entity, CreateEntity } from "../types/Entity";

const RESOURCE = "/books";

export const getBooks = async (): Promise<Entity[]> => {
    const response = await api.get<Entity[]>(RESOURCE);
    return response.data;
}

export const getBookById = async (id: string): Promise<Entity> => {
    const response = await api.get<Entity>(`${RESOURCE}/${id}`);
    return response.data;
}

export const createBook = async (item: CreateEntity): Promise<Entity> => {
    const response = await api.post<Entity>(RESOURCE, item);
    return response.data;
};

export const updateBook = async (
    id: string,
    item: Partial<CreateEntity>,
    method: "put" | "patch" = "patch"
): Promise<Entity> => {
    const response =
        method === "put"
            ? await api.put<Entity>(`${RESOURCE}/${id}`, item)
            : await api.patch<Entity>(`${RESOURCE}/${id}`, item);

    return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
    await api.delete(`${RESOURCE}/${id}`);
}