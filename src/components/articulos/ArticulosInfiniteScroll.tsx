'use client'
import { Articulo, ParametrosDePaginacion, ResultadoPaginado } from "@/lib/types";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer"
import { ListaDeArticulos } from "../articulos/ListaDeArticulos";

export function ArticulosInfiniteScroll<T extends ParametrosDePaginacion>({ resultadoInicial, titulo, args, obtenerArticulos, editable = false }: {
    resultadoInicial: ResultadoPaginado<Articulo>,
    titulo: string,
    args: T,
    obtenerArticulos: (arg0: T) => Promise<ResultadoPaginado<Articulo>>,
    editable?: boolean
}) {
    const { ref, inView } = useInView();
    const [posicion, setPosicion] = useState(resultadoInicial.offset);
    const [articulos, setArticulos] = useState<Articulo[]>(resultadoInicial.data);
    const [hayMasDatos, setHayMasDatos] = useState(true);
    const [estaCargando, setEstaCargando] = useState(false);
    useEffect(() => {
        const cargarMas = async () => {
            if (hayMasDatos) {
                setEstaCargando(true)
                const articulos = await obtenerArticulos({
                    ...args,
                    offset: posicion + resultadoInicial.limit
                })
                if (articulos.data.length == 0) {
                    setHayMasDatos(false);
                }
                setArticulos((prev) => [...prev, ...articulos.data]);
                setPosicion((prev) => prev + resultadoInicial.limit);
                setEstaCargando(false)
            }
        }
        if (inView && hayMasDatos) {
            cargarMas();
        }
    }, [args, hayMasDatos, inView, obtenerArticulos, posicion, resultadoInicial.limit]);

    return (
        <ListaDeArticulos
            estaCargando={estaCargando}
            inViewRef={ref}
            titulo={titulo}
            articulos={articulos}
            editable={editable} />
    )
}