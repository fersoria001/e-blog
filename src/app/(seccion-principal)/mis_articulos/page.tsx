import { ArticulosInfiniteScroll } from "@/components/articulos/ArticulosInfiniteScroll"
import { encontrarArticulosPorIdDeAutor } from "@/lib/actions"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
export default async function Pagina() {
    const { userId } = auth()
    if (!userId) redirect("/")
    const resultado = await encontrarArticulosPorIdDeAutor({ idDeAutor: userId })
    return (
        <ArticulosInfiniteScroll
            resultadoInicial={resultado}
            args={{ idDeAutor: userId }}
            titulo="Mis articulos"
            obtenerArticulos={encontrarArticulosPorIdDeAutor}
        />
    )
}