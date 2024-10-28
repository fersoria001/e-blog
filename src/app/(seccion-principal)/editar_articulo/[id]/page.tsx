import { EditorDeTexto } from "@/components/editor-de-texto/EditorDeTexto";
import { obtenerArticulo } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Pagina({ params }: { params: { id: string } }) {
    const { userId } = auth()
    const articulo = await obtenerArticulo({ id: params.id })
    if (!articulo) redirect("/404")
    if (articulo.author_id != userId) redirect("/mis_articulos")
    return (
        <div>
            <EditorDeTexto estadoPrevio={{ id: articulo.id, estadoSerializado: articulo.serialized_text, titulo: articulo.title, etiquetas: articulo.tags }} />
        </div>
    )
}