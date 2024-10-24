import { TarjetaDeArticulo } from "@/components/articulos/TarjetaDeArticulo";
import { obtenerArticulo } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Pagina({ params }: { params: { id: string } }) {
    const articulo = await obtenerArticulo({ id: params.id })
    if (!articulo) {
        redirect("/404")
    }
    return (
        <TarjetaDeArticulo articulo={articulo} />
    )
}