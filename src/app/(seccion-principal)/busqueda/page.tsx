import { ResultadosDeBusqueda } from "@/components/busqueda/ResultadosDeBusqueda";
import { buscarArticulos } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Pagina({ searchParams }: { searchParams?: { c?: string, p: string } }) {
    if (!searchParams?.c) redirect("/")
    const pagina = searchParams?.p || "1"
    const resultado = await buscarArticulos({ consulta: searchParams.c, offset: (parseInt(pagina, 10) - 1) * 10 })
    return (
        <ResultadosDeBusqueda resultadoInicial={resultado} />
    )
}