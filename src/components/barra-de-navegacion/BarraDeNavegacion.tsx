'use client'
import { BookText, SearchIcon, SquarePenIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";
import { useRouter } from "next/navigation";

const esquemaDeBusqueda = z.object({
    consulta: z.string().min(3, {
        message: "Tu busqueda debe contener al menos 3 carácteres",
    }).max(120, { message: "Tu consulta no puede ser de más de 120 carácteres" }).trim(),
})

export function BarraDeNavegacion() {
    const [showErrorTooltip, setShowErrorTooltip] = useState(false)
    const { push } = useRouter()
    const form = useForm<z.infer<typeof esquemaDeBusqueda>>({
        resolver: zodResolver(esquemaDeBusqueda),
        defaultValues: {
            consulta: "",
        },
    })
    function onSubmit(values: z.infer<typeof esquemaDeBusqueda>) {
        push(`/busqueda?c=${values.consulta}`)
    }
    return (
        <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground pb-2">
            <nav className="flex flex-wrap justify-between px-3 items-center">
                <Link href={"/"}>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        EBlog
                    </h2>
                </Link>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-sm space-x-2">
                        <FormField
                            control={form.control}
                            name="consulta"
                            render={({ field }) => (
                                <FormItem>
                                    <TooltipProvider>
                                        <Tooltip open={showErrorTooltip}>
                                            <TooltipTrigger asChild>
                                                <FormControl>
                                                    <Input
                                                        className="w-64 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                                                        type="text"
                                                        placeholder="Buscar..."
                                                        {...field}
                                                        onFocus={() => form.formState.errors.consulta && setShowErrorTooltip(true)}
                                                        onBlur={() => setShowErrorTooltip(false)}
                                                    />
                                                </FormControl>
                                            </TooltipTrigger>
                                            {form.formState.errors.consulta && (
                                                <TooltipContent>
                                                    <p>{form.formState.errors.consulta.message}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </FormItem>
                            )}
                        />
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            type="submit"
                        >
                            <SearchIcon />
                        </Button>
                    </form>
                </Form>
                <ul className="flex space-x-3 items-center">
                    <li>
                        <Link href={"/nuevo_articulo"} passHref>
                            <Button variant={"outline"} size={"icon"}>
                                <SquarePenIcon />
                            </Button>
                        </Link>
                    </li>
                    <SignedOut>
                        <li>
                            <SignInButton>
                                <p className="cursor-pointer">Ingresar</p>
                            </SignInButton>
                        </li>
                    </SignedOut>
                    <SignedIn>
                        <li className="mt-2">
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Link
                                        label="Mis articulos"
                                        labelIcon={<BookText className="w-3 h-3" />}
                                        href="/mis_articulos"
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        </li>
                    </SignedIn>
                </ul>
            </nav>
        </header>
    )
}