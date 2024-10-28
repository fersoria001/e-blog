import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function NoHayResultadosDeBusqueda({ consulta = "" }: { consulta?: string }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <Search className="w-12 h-12 mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">No se encontraron resultados</h2>
        {consulta && (
          <p className="text-muted-foreground mb-4">
            No pudimos encontrar resultados para &quot;{consulta}&quot;
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Intenta con otros términos de búsqueda o revisa tu ortografía.
        </p>
      </CardContent>
    </Card>
  )
}