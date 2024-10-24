/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


export default function EntradaConPortapapeles({ texto }: { texto: string }) {
    const [copiado, setCopiado] = useState(false)
    const { toast } = useToast()
    const copiarAlPortapapeles = async () => {
        try {
            await navigator.clipboard.writeText(texto)
            setCopiado(true)
            toast({
                title: "Copiado",
                description: "El texto fue copiado al portapapeles.",
            })
            setTimeout(() => setCopiado(false), 2000)
        } catch (err: unknown) {
            toast({
                title: "Fallo al copiar",
                description: "Hubo un error al intentar copiar el texto, intentá de nuevo.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
                className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                type="texto" value={texto} readOnly />
            <Button onClick={copiarAlPortapapeles} variant="outline" size="icon">
                {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">{copiado ? "Copiado" : "Copiar"}</span>
            </Button>
        </div>
    )
}