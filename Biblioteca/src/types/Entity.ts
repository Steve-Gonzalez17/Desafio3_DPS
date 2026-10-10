export interface Entity {
    id: string;
    titulo: string;
    autor: string;
    genero: string;
    year: string;
    portada: string;
    estado: 0 | 1;
    calificacion: number;
}

export type CreateEntity = Omit<Entity, "id">;