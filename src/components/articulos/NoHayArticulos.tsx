import Link from 'next/link'
import { FileText, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NoHayArticulos() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">No tenés artículos</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Comenzá a crear tu primer artículo ahora mismo.
        </p>
        <Button asChild>
          <Link href="/nuevo_articulo" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Crear nuevo artículo
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}