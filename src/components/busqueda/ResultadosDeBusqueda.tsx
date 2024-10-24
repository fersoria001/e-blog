'use client'
import { Articulo, ResultadoPaginado } from "@/lib/types";
import { ListaDeArticulos } from "../articulos/ListaDeArticulos";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "../ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";


export function ResultadosDeBusqueda({ resultadoInicial }: { resultadoInicial: ResultadoPaginado<Articulo> }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const paginas = Math.ceil(resultadoInicial.total / 10) || 1
    const pagina = parseInt(searchParams.get("p") || "1", 10)

    const obtenerNumerosDePagina = () => {
        const numerosDePagina = []
        const limiteDeMuestra = 5
        const mitadDelLimite = Math.floor(limiteDeMuestra / 2)

        let paginaInicial = Math.max(1, pagina - mitadDelLimite)
        const paginaFinal = Math.min(paginas, paginaInicial + limiteDeMuestra - 1)

        if (paginaFinal - paginaInicial + 1 < limiteDeMuestra) {
            paginaInicial = Math.max(1, paginaFinal - limiteDeMuestra + 1)
        }

        for (let i = paginaInicial; i <= paginaFinal; i++) {
            numerosDePagina.push(i)
        }

        return numerosDePagina
    }

    const manejarCambioDePagina = (pagina: number) => {
        const params = new URLSearchParams(searchParams);
        if (pagina) {
            params.set('p', pagina.toString());
        } else {
            params.delete('p');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const numerosDePagina = obtenerNumerosDePagina()

    return (
        <div className="flex flex-col min-h-screen">
            <ListaDeArticulos
                titulo="Resultados de busqueda"
                articulos={resultadoInicial.data} />
            <Pagination className="mt-auto mb-4">
                <PaginationContent>
                    <PaginationItem>
                        <Button
                            variant="ghost"
                            onClick={() => manejarCambioDePagina(Math.max(1, pagina - 1))}
                            disabled={pagina === 1}
                        >
                            <ChevronLeft className="w-6 h-6" />
                            Anterior
                        </Button>
                    </PaginationItem>

                    {numerosDePagina[0] > 1 && (
                        <>
                            <PaginationItem>
                                <Button variant="outline" onClick={() => manejarCambioDePagina(1)}>1</Button>
                            </PaginationItem>
                            {numerosDePagina[0] > 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                        </>
                    )}

                    {numerosDePagina.map((numeroDePagina) => (
                        <PaginationItem key={`pagina-${numeroDePagina}`}>
                            <Button
                                variant={numeroDePagina === pagina ? "default" : "outline"}
                                className={clsx({ "pointer-events-none": numeroDePagina === pagina })}
                                onClick={() => manejarCambioDePagina(numeroDePagina)}
                            >
                                {numeroDePagina}
                            </Button>
                        </PaginationItem>
                    ))}

                    {numerosDePagina[numerosDePagina.length - 1] < paginas && (
                        <>
                            {numerosDePagina[numerosDePagina.length - 1] < paginas - 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <Button variant="outline" onClick={() => manejarCambioDePagina(paginas)}>{paginas}</Button>
                            </PaginationItem>
                        </>
                    )}

                    <PaginationItem>
                        <Button
                            variant="ghost"
                            onClick={() => manejarCambioDePagina(Math.min(paginas, pagina + 1))}
                            disabled={pagina === paginas}
                        >
                            Siguiente
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}