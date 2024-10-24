import { UUID } from "crypto"

export interface ParametrosDePaginacion {
    offset?: number,
    limit?: number
}

export type ResultadoPaginado<T> = {
    offset: number;
    limit: number;
    total: number;
    data: T[]
}

export type Articulo = {
    id: UUID,
    author_id: string,
    plain_text?: string,
    search_vector?: string,
    serialized_text: string,
    title: string,
    tags: string[],
    likes: number,
    favourited: number,
    author?: Autor,
    is_liked?: boolean,
    is_favorited?: boolean,
}

export type Favourites = {
    id: UUID,
    article_id: UUID,
    user_id: string,
}

export type Likes = {
    id: UUID,
    article_id: UUID,
    user_id: string,
}

export type Autor = {
    id: string,
    firstName: string | null,
    lastName: string | null,
    fullName: string | null,
    imageUrl: string,
}