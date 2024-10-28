import { ListaDeArticulosLateral } from "@/components/articulos/ListaDeArticulosLateral";
import { obtenerTodosLosArticulosPorMasReacciones } from "@/lib/actions";
export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const resultado = await obtenerTodosLosArticulosPorMasReacciones({ offset: 0 })
    return (
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <ListaDeArticulosLateral resultadoInicial={resultado} />
            <main>
                {children}
            </main>
        </div>
    )
}