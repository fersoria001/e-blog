"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { enviarMensajeDeContacto } from "@/lib/actions"


const formSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Por favor, introduce un email válido.",
    }),
    mensaje: z.string().min(10, {
        message: "El mensaje debe tener al menos 10 caracteres.",
    }),
})

export default function Contacto() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            email: "",
            mensaje: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        await enviarMensajeDeContacto({ nombre: values.nombre, email: values.email, mensaje: values.mensaje })
        setTimeout(() => {
            setIsSubmitting(false)
            toast({
                title: "Mensaje enviado",
                description: "Gracias por contactarnos. Te responderemos pronto.",
            })
            form.reset()
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold">Contacto - eBlog</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Contáctanos</CardTitle>
                        <CardDescription>Envíanos un mensaje y te responderemos lo antes posible.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu nombre" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="tu@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mensaje"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mensaje</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tu mensaje" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {isSubmitting ?
                                    (<Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </Button>)
                                    :
                                    (<Button type="submit">
                                        Enviar
                                    </Button>)
                                }
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start">
                        <h3 className="text-lg font-semibold mb-2">Información de contacto</h3>
                        <p>Email: bercho001@gmail.com</p>
                        <p>Teléfono: +54 294 4781823</p>
                        <p>Dirección: San Carlos de Bariloche, Río Negro, Argentina.</p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}