'use client'
import { BookText, SearchIcon, SquarePenIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { SignedOut, SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
    KnockProvider,
    KnockFeedProvider,
    NotificationIconButton,
    NotificationFeedPopover,
    NotificationCell,
    Avatar
} from "@knocklabs/react";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import Traduccion from "@/lib/knock_translation_esAR";

const esquemaDeBusqueda = z.object({
    consulta: z.string().min(3, {
        message: "Tu busqueda debe contener al menos 3 carácteres",
    }).max(120, { message: "Tu consulta no puede ser de más de 120 carácteres" }).trim(),
})

export function BarraDeNavegacion() {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
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
    const { isLoaded, isSignedIn, user } = useUser()
    if (!isLoaded) {
        return <div>Skeleton loading...</div>
    }
    const knockApiKey = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY
    if (!knockApiKey) throw new Error("ENV VARIABLE NOT DEFINED: NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY")
    const feedChannelId = process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID
    if (!feedChannelId) throw new Error("ENV VARIABLE NOT DEFINED: NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID")
    return (
        <KnockProvider
            apiKey={knockApiKey}
            userId={isSignedIn ? user.id : ""}
            i18n={{
                translations: Traduccion,
                locale: "esAR",
            }}
        >
            <KnockFeedProvider feedId={feedChannelId}>
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
                                <li>
                                    <NotificationIconButton
                                        ref={notifButtonRef}
                                        onClick={() => setIsVisible(!isVisible)}
                                    />
                                    <NotificationFeedPopover
                                        buttonRef={notifButtonRef}
                                        isVisible={isVisible}
                                        onOpen={({ store, feedClient }) => {
                                            const unreadItems = store.items.filter((item) => !item.read_at);

                                            if (unreadItems.length > 0) {
                                                feedClient.markAsRead(unreadItems);
                                            }
                                        }}
                                        onClose={() => setIsVisible(false)}
                                        renderItem={({ item, ...props }) => (
                                            <NotificationCell
                                                {...props}
                                                item={item}
                                                avatar={<Avatar
                                                    name={isSignedIn && user?.fullName ? user?.fullName : ""}
                                                    src={isSignedIn && user.imageUrl ? user.imageUrl : ""} />}
                                            />
                                        )}
                                    />
                                </li>
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
            </KnockFeedProvider>
        </KnockProvider>
    )
}