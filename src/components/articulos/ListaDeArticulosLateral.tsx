'use client'
import { Articulo, ResultadoPaginado } from "@/lib/types";
import { Card, CardHeader, CardFooter } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import clsx from "clsx";
import { Heart, Loader2Icon, Star } from "lucide-react";
import { obtenerTodosLosArticulosPorMasReacciones } from "@/lib/actions";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function ListaDeArticulosLateral({ resultadoInicial }: { resultadoInicial: ResultadoPaginado<Articulo> }) {
    const { ref, inView } = useInView();
    const [posicion, setPosicion] = useState(resultadoInicial.offset);
    const [articulos, setArticulos] = useState<Articulo[]>(resultadoInicial.data);
    const [hayMasDatos, setHayMasDatos] = useState(true);
    const [estaCargando, setEstaCargando] = useState(false);

    useEffect(() => {
        const cargarMas = async () => {
            if (hayMasDatos) {
                setEstaCargando(true)
                const articulos = await obtenerTodosLosArticulosPorMasReacciones({ offset: posicion + resultadoInicial.limit })
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
    }, [hayMasDatos, inView, posicion, resultadoInicial.limit]);

    return (
        <aside className="fixed top-12 z-30 ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
                Con más reacciones
            </h3>
            <ScrollArea className="flex flex-col h-[calc(100vh-10rem)] border-r">
                {articulos.map((a) => (
                    <Card key={`aside-${a.id}`} className="mb-4 last:mb-0">
                        <Link href={`/articulo/${a.id}`}>
                            <CardHeader>
                                <h4 className="font-semibold tracking-tight">
                                    {a.title}
                                </h4>
                            </CardHeader>
                        </Link>
                        <CardFooter className="flex-col">
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={
                                        clsx('rounded-full transition-colors hover:bg-red-50 pointer-events-none dark:pointer-events-none', {
                                            'bg-red-100 text-red-500 hover:bg-red-200': a.is_liked
                                        })}
                                >
                                    <Heart className={clsx('w-6 h-6', { 'fill-current': a.is_liked })} />
                                    <span className="sr-only">Me gusta</span>
                                </Button>
                                <span className="text-sm font-medium">{a.likes}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={clsx('rounded-full transition-colors hover:bg-yellow-50 pointer-events-none dark:pointer-events-none',
                                        {
                                            'bg-yellow-100 text-yellow-500 hover:bg-yellow-200': a.is_favorited,
                                        })
                                    }
                                >
                                    <Star className={clsx('w-6 h-6', { 'fill-current': a.is_favorited })} />
                                    <span className="sr-only">Agregar a favoritos</span>
                                </Button>
                                <span className="text-sm font-medium">{a.favourited}</span>
                            </div>
                            <div className="flex w-full flex-wrap gap-1">
                                {
                                    a.tags.map((e) =>
                                    (<Link key={`aside-tag-${a.id}-${e}`} href={`/busqueda?c=${e}`}>
                                        <Badge>
                                            {e}
                                        </Badge>
                                    </Link>)
                                    )
                                }
                            </div>
                        </CardFooter>
                    </Card>
                ))}
                {
                    estaCargando && <Loader2Icon className="mx-auto w-6 h-6 animate-spin" />
                }
                <div ref={ref}></div>
            </ScrollArea>
        </aside>
    )
}