import { ArticulosInfiniteScroll } from "@/components/articulos/ArticulosInfiniteScroll"
import { obtenerTodosLosArticulos } from "@/lib/actions"
export default async function Pagina() {
    const resultado = await obtenerTodosLosArticulos({ offset: 0 })
    return (
        <ArticulosInfiniteScroll
            resultadoInicial={resultado}
            titulo="Ultimos agregados"
            obtenerArticulos={obtenerTodosLosArticulos}
            args={{}}
        />
    )
}