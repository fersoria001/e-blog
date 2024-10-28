'use server'
import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";
import { randomUUID } from "crypto";
import { clerkClient } from '@clerk/nextjs/server'
import { Articulo, ResultadoPaginado } from "./types";
import { redirect } from "next/navigation";
import { kv } from '@vercel/kv';
import { aArregloDePGSql } from "./utils";
import { Knock } from "@knocklabs/node";
export async function removerDeMeGusta({ idDeArticulo }: { idDeArticulo: string }) {
  const { userId } = auth()
  if (!userId) {
    return
  }
  await sql`DELETE from likes where article_id = ${idDeArticulo} AND user_id=${userId};`
  await sql`UPDATE articles SET likes = likes - 1 WHERE id=${idDeArticulo}`
}

export async function agregarAMeGusta({ idDeArticulo }: { idDeArticulo: string }) {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const id = randomUUID();
  await sql`INSERT into likes(id, article_id, user_id) VALUES (${id}, ${idDeArticulo}, ${userId});`
  await sql`UPDATE articles SET likes = likes + 1 WHERE id=${idDeArticulo}`
}

export async function removerDeFavoritos({ idDeArticulo }: { idDeArticulo: string }) {
  const { userId } = auth()
  if (!userId) {
    return
  }
  await sql`DELETE from favourites where article_id = ${idDeArticulo} AND user_id=${userId};`
  await sql`UPDATE articles SET favourited = favourited - 1 WHERE id=${idDeArticulo}`
}

export async function agregarAFavoritos({ idDeArticulo }: { idDeArticulo: string }) {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const id = randomUUID();
  await sql`INSERT into favourites(id, article_id, user_id) VALUES (${id}, ${idDeArticulo}, ${userId});`
  await sql`UPDATE articles SET favourited = favourited + 1 WHERE id=${idDeArticulo}`
}

export async function obtenerArticulo({ id }: { id: string }): Promise<Articulo | undefined> {
  const { userId } = auth()
  const { rows: filas } = await sql`
SELECT 
  a.id, 
  a.author_id, 
  a.serialized_text, 
  a.likes,
  a.favourited,
  a.tags,
  a.title,
  COUNT(l.article_id) > 0 AS is_liked, 
  COUNT(f.article_id) > 0 AS is_favorited
FROM 
  articles a
LEFT JOIN 
  likes l 
ON 
  a.id = l.article_id 
  AND l.user_id = ${userId} 
LEFT JOIN 
  favourites f 
ON 
  a.id = f.article_id 
  AND f.user_id = ${userId}
WHERE 
  a.id = ${id}
GROUP BY 
  a.id, a.author_id, a.serialized_text;
`
  if (!filas[0]) return
  const articulo = filas[0] as Articulo
  const autor = await clerkClient().users.getUser(articulo.author_id)

  return {
    ...articulo,
    author: {
      id: autor!.id,
      firstName: autor!.firstName || "",
      lastName: autor!.lastName || "",
      fullName: autor!.fullName || "",
      imageUrl: autor!.imageUrl || ""
    }
  }
}

export async function buscarArticulos({ consulta, offset = 0, limit = 10 }: {
  consulta: string,
  offset?: number,
  limit?: number
}): Promise<ResultadoPaginado<Articulo>> {
  const { userId } = auth()
  const { rows: total } = await sql`SELECT COUNT(*) as total FROM articles`
  const { rows: filas } = await sql`
SELECT 
  a.id, 
  a.author_id, 
  a.serialized_text, 
  a.likes,
  a.favourited,
  a.tags,
  a.title,
  COUNT(l.article_id) > 0 AS is_liked, 
  COUNT(f.article_id) > 0 AS is_favorited
FROM 
  articles a
LEFT JOIN 
  likes l 
ON 
  a.id = l.article_id 
  AND l.user_id = ${userId} 
LEFT JOIN 
  favourites f 
ON 
  a.id = f.article_id 
  AND f.user_id = ${userId}
WHERE search_vector @@ to_tsquery('spanish', ${consulta})
GROUP BY 
  a.id, a.author_id, a.serialized_text
OFFSET ${offset} LIMIT ${limit};
`
  const autores = await clerkClient().users.getUserList({ userId: filas.map((f) => f.author_id) })
  const articulos = filas.map((f) => {
    const autor = autores.data.find((a) => a.id == f.author_id)
    if (autor) {
      return {
        id: f.id,
        author_id: f.author_id,
        plain_text: f.plain_text,
        search_vector: f.search_vector,
        serialized_text: f.serialized_text,
        title: f.title,
        tags: f.tags,
        likes: f.likes,
        favourited: f.favourited,
        is_liked: f.is_liked,
        is_favorited: f.is_favorited,
        author: {
          id: autor.id,
          firstName: autor.firstName,
          lastName: autor.lastName,
          fullName: autor.fullName,
          imageUrl: autor.imageUrl
        }
      }
    }
    return null
  }).filter((a): a is NonNullable<typeof a> => a !== undefined)
  return { offset, limit, total: total[0].total, data: articulos }
}

export async function obtenerTodosLosArticulosPorMasReacciones({ offset = 0, limit = 10 }: {
  offset?: number,
  limit?: number
}): Promise<ResultadoPaginado<Articulo>> {
  const { userId } = auth()
  const { rows: total } = await sql`SELECT COUNT(*) as total FROM articles`
  const { rows: filas } = await sql`
SELECT 
  a.id, 
  a.author_id, 
  a.serialized_text, 
  a.likes,
  a.favourited,
  a.tags,
  a.title,
  COUNT(l.article_id) > 0 AS is_liked, 
  COUNT(f.article_id) > 0 AS is_favorited
FROM 
  articles a
LEFT JOIN 
  likes l 
ON 
  a.id = l.article_id 
  AND l.user_id = ${userId} 
LEFT JOIN 
  favourites f 
ON 
  a.id = f.article_id 
  AND f.user_id = ${userId}
GROUP BY 
  a.id, a.author_id, a.serialized_text, a.likes, a.favourited
ORDER BY 
  a.likes DESC, 
  a.favourited DESC
OFFSET ${offset} LIMIT ${limit}
`
  const autores = await clerkClient().users.getUserList({ userId: filas.map((f) => f.author_id) })
  const articulos = filas.map((f) => {
    const autor = autores.data.find((a) => a.id == f.author_id)
    if (autor) {
      return {
        id: f.id,
        author_id: f.author_id,
        plain_text: f.plain_text,
        search_vector: f.search_vector,
        serialized_text: f.serialized_text,
        title: f.title,
        tags: f.tags,
        likes: f.likes,
        favourited: f.favourited,
        is_liked: f.is_liked,
        is_favorited: f.is_favorited,
        author: {
          id: autor.id,
          firstName: autor.firstName,
          lastName: autor.lastName,
          fullName: autor.fullName,
          imageUrl: autor.imageUrl
        }
      }
    }
    return null
  }).filter((a): a is NonNullable<typeof a> => a !== undefined)
  return { offset, limit, total: total[0].total, data: articulos }
}

export async function obtenerTodosLosArticulos({ offset = 0, limit = 10 }: {
  offset?: number,
  limit?: number
}): Promise<ResultadoPaginado<Articulo>> {
  const { userId } = auth()
  const { rows: total } = await sql`SELECT COUNT(*) as total FROM articles`
  const { rows: filas } = await sql`
SELECT 
  a.id, 
  a.author_id, 
  a.serialized_text, 
  a.likes,
  a.favourited,
  a.tags,
  a.title,
  COUNT(l.article_id) > 0 AS is_liked, 
  COUNT(f.article_id) > 0 AS is_favorited
FROM 
  articles a
LEFT JOIN 
  likes l 
ON 
  a.id = l.article_id 
  AND l.user_id = ${userId} 
LEFT JOIN 
  favourites f 
ON 
  a.id = f.article_id 
  AND f.user_id = ${userId}
GROUP BY 
  a.id, a.author_id, a.serialized_text
OFFSET ${offset} LIMIT ${limit}
`
  const autores = await clerkClient().users.getUserList({ userId: filas.map((f) => f.author_id) })
  const articulos = filas.map((f) => {
    const autor = autores.data.find((a) => a.id == f.author_id)
    if (autor) {
      return {
        id: f.id,
        author_id: f.author_id,
        plain_text: f.plain_text,
        search_vector: f.search_vector,
        serialized_text: f.serialized_text,
        title: f.title,
        tags: f.tags,
        likes: f.likes,
        favourited: f.favourited,
        is_liked: f.is_liked,
        is_favorited: f.is_favorited,
        author: {
          id: autor.id,
          firstName: autor.firstName,
          lastName: autor.lastName,
          fullName: autor.fullName,
          imageUrl: autor.imageUrl
        }
      }
    }
    return null
  }).filter((a): a is NonNullable<typeof a> => a !== undefined)
  return { offset, limit, total: total[0].total, data: articulos }
}

export async function encontrarArticulosPorIdDeAutor({ idDeAutor, offset = 0, limit = 10 }:
  { idDeAutor: string, offset?: number, limit?: number }): Promise<ResultadoPaginado<Articulo>> {
  const { userId } = auth()
  const { rows: total } = await sql`SELECT COUNT(*) as total FROM articles`
  const { rows: filas } = await sql`
SELECT 
  a.id, 
  a.author_id, 
  a.serialized_text, 
  a.likes,
  a.favourited,
  a.tags,
  a.title,
  COUNT(l.article_id) > 0 AS is_liked, 
  COUNT(f.article_id) > 0 AS is_favorited
FROM 
  articles a
LEFT JOIN 
  likes l 
ON 
  a.id = l.article_id 
  AND l.user_id = ${userId} 
LEFT JOIN 
  favourites f 
ON 
  a.id = f.article_id 
  AND f.user_id = ${userId}
WHERE 
  a.author_id = ${idDeAutor}
GROUP BY 
  a.id, a.author_id, a.serialized_text
  OFFSET ${offset} LIMIT ${limit}
`
  const articulos = filas.map((f) => {
    return {
      id: f.id,
      author_id: f.author_id,
      plain_text: f.plain_text,
      search_vector: f.search_vector,
      serialized_text: f.serialized_text,
      title: f.title,
      tags: f.tags,
      likes: f.likes,
      favourited: f.favourited,
      is_liked: f.is_liked,
      is_favorited: f.is_favorited,
    }
  }).filter((a): a is NonNullable<typeof a> => a !== undefined)
  return { offset, limit, total: total[0].total, data: articulos }
}

export async function actualizarArticulo({ id, textoPlano, textoSerializado, titulo, etiquetas }: {
  id: string,
  textoPlano: string,
  textoSerializado: string,
  titulo: string,
  etiquetas: string[]
}) {
  await sql`
        UPDATE  articles
        SET 
            plain_text=${textoPlano}, 
            search_vector=to_tsvector('spanish', ${titulo} || ' ' || ${textoPlano} || ' ' || ${etiquetas.join(" ")}), 
            serialized_text=${textoSerializado},
            tags=${aArregloDePGSql(etiquetas)},
            title=${titulo}
        WHERE id = ${id}
    `;
  redirect("/mis_articulos")
}

export async function guardarArticulo({ textoPlano, textoSerializado, titulo, etiquetas }: {
  textoPlano: string,
  textoSerializado: string,
  titulo: string,
  etiquetas: string[]
}) {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const usuario = await currentUser()
  const id = randomUUID();
  await sql`
        INSERT INTO articles(id, author_id, plain_text, search_vector, serialized_text, tags, title)
        VALUES (
            ${id}, 
            ${userId},
            ${textoPlano}, 
            to_tsvector('spanish', ${titulo} || ' ' || ${textoPlano} || ' ' || ${etiquetas.join(" ")}), 
            ${textoSerializado},
            ${aArregloDePGSql(etiquetas)},
            ${titulo}
        );
    `;
  if (!usuario) { redirect("/") }
  const knock = new Knock(process.env.KNOCK_API_KEY);
  await knock.workflows.trigger("nuevo-articulo", {
    data: { key: "" },
    recipients: [
      {
        id: usuario.id,
        name: usuario.firstName || undefined,
        email: usuario.emailAddresses[0].emailAddress,
      },
    ],
  });
  redirect("/")
}

export async function guardarBorradorDeArticulo({ textoPlano, textoSerializado, titulo, etiquetas }: {
  textoPlano: string,
  textoSerializado: string,
  titulo: string,
  etiquetas: string[]
}): Promise<void> {
  const uuid = randomUUID()
  await kv.set(uuid, {
    textoPlano: textoPlano,
    textoSerializado: textoSerializado,
    titulo: titulo,
    etiquetas: etiquetas
  }, { ex: 60 * 30 })
  const urlDeRedireccion = `${process.env.HOST}/api/publicar_borrador?id=${uuid}`
  auth().redirectToSignIn({ returnBackUrl: urlDeRedireccion });
}

export async function enviarMensajeDeContacto({ nombre, email, mensaje }: { nombre: string, email: string, mensaje: string }) {
  const uuid = randomUUID()
  await sql`INSERT INTO contact_messages (id, name, email, message) VALUES (${uuid}, ${nombre}, ${email}, ${mensaje})`
}

export async function subscribirseAlRss({ email }: { email: string }) {
  const uuid = randomUUID()
  await sql`INSERT INTO rss_recipients (id, email) VALUES (${uuid}, ${email})`
}