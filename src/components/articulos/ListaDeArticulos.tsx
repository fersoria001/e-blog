import { Articulo } from "@/lib/types";
import { TarjetaDeArticulo } from "./TarjetaDeArticulo";
import { Loader2Icon } from "lucide-react";
import NoHayArticulos from "./NoHayArticulos";

export function ListaDeArticulos({ titulo, articulos, inViewRef, estaCargando, editable = false }: {
    titulo: string,
    articulos: Articulo[],
    inViewRef?: (node?: Element | null) => void,
    estaCargando?: boolean,
    editable?: boolean
}) {
    if (articulos.length < 1) {
        return (
            <div className="flex flex-col min-h-screen">
                <div className="my-auto">
                    <NoHayArticulos />
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
                {titulo}
            </h3>
            <div>
                {
                    articulos.map((articulo) => (
                        <TarjetaDeArticulo
                            key={articulo.id}
                            tamaño="sm"
                            articulo={articulo}
                            editable={editable} />
                    ))
                }
                {
                    estaCargando && <Loader2Icon className="mx-auto w-6 h-6 animate-spin" />
                }
                <div ref={inViewRef} />
            </div>
        </div>
    )
}