'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Articulo } from "@/lib/types";
import DOMPurify from "dompurify";
import { createEditor } from "lexical";
import editorConfig from "../editor-de-texto/config";
import { $generateHtmlFromNodes } from '@lexical/html';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import clsx from "clsx";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Heart, Share2, Star } from "lucide-react";
import { agregarAFavoritos, agregarAMeGusta, removerDeFavoritos, removerDeMeGusta } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
    TwitterShareButton,
    FacebookShareButton,
    RedditShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    RedditIcon,
    WhatsappIcon,
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
} from 'next-share';
import EntradaConPortapapeles from "../misc/EntradaConPortapapeles";
import { useUser } from "@clerk/nextjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tamaños = {
    "default": "default",
    "sm": "sm"
}

export function TarjetaDeArticulo({ articulo, tamaño = "default", editable = false }: { tamaño?: keyof typeof tamaños, articulo: Articulo, editable?: boolean }) {
    const URL_PARA_COMPARTIR = `${process.env.NEXT_PUBLIC_HOST}/articulo/${articulo.id}`
    const [contenidoHtml, setContenidoHtml] = useState<string | null>(null);
    const { refresh } = useRouter()
    const { isSignedIn } = useUser()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const editor = createEditor(editorConfig);
            editor.setEditorState(editor.parseEditorState(articulo.serialized_text));
            editor.read(() => {
                const html = $generateHtmlFromNodes(editor, null);
                setContenidoHtml(html);
            });
        }
    }, [articulo.serialized_text]);

    async function manejarMeGusta(): Promise<void> {
        if (articulo.is_liked) {
            await removerDeMeGusta({ idDeArticulo: articulo.id })
            refresh()
        } else {
            await agregarAMeGusta({ idDeArticulo: articulo.id })
            refresh()
        }
    }

    async function manejarFavorito(): Promise<void> {
        if (articulo.is_favorited) {
            await removerDeFavoritos({ idDeArticulo: articulo.id })
            refresh()
        } else {
            await agregarAFavoritos({ idDeArticulo: articulo.id })
            refresh()
        }
    }
    return (
        <Card className={clsx("mb-4", { "mt-12": tamaño == "default" })}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    {articulo.author &&
                        (<div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage
                                    src={articulo.author.imageUrl}
                                    alt="foto de perfil del autor" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="leading-7 [&:not(:first-child)]:mt-6">
                                {articulo.author.fullName}
                            </p>
                        </div>)
                    }
                    <TooltipProvider>
                        <div className="flex items-center justify-center gap-4 p-4 ml-auto">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={clsx('w-12 h-12 rounded-full transition-colors hover:bg-red-50', {
                                            'pointer-events-none dark:pointer-events-none': tamaño != "default" || !isSignedIn,
                                            'bg-red-100 text-red-500 hover:bg-red-200': articulo.is_liked
                                        })}
                                        onClick={manejarMeGusta}
                                    >
                                        <Heart className={clsx('w-6 h-6', { 'fill-current': articulo.is_liked })} />
                                        <span className="sr-only">Me gusta</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{articulo.is_liked ? 'No me gusta' : 'Me gusta'}</p>
                                </TooltipContent>
                            </Tooltip>
                            <span className="text-sm font-medium">{articulo.likes}</span>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={clsx('w-12 h-12 rounded-full transition-colors hover:bg-yellow-50',
                                            {
                                                'pointer-events-none dark:pointer-events-none': tamaño != "default" || !isSignedIn,
                                                'bg-yellow-100 text-yellow-500 hover:bg-yellow-200': articulo.is_favorited,
                                            })
                                        }
                                        onClick={manejarFavorito}
                                    >
                                        <Star className={clsx('w-6 h-6', { 'fill-current': articulo.is_favorited })} />
                                        <span className="sr-only">Agregar a favoritos</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{articulo.is_favorited ? 'Remover de favoritos' : 'Agregar a favoritos'}</p>
                                </TooltipContent>
                            </Tooltip>
                            <span className="text-sm font-medium">{articulo.favourited}</span>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="w-12 h-12 rounded-full hover:bg-blue-50"
                                            >
                                                <Share2 className="w-6 h-6" />
                                                <span className="sr-only">Compartir</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Compartir</DialogTitle>
                                                <DialogDescription>
                                                    Compartí este artículo en tus redes sociales.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col">
                                                <div className="flex gap-4 items-center justify-center mb-4">
                                                    <TwitterShareButton url={URL_PARA_COMPARTIR}>
                                                        <TwitterIcon size={32} round />
                                                    </TwitterShareButton>
                                                    <FacebookShareButton url={URL_PARA_COMPARTIR} >
                                                        <FacebookIcon size={32} round />
                                                    </FacebookShareButton>
                                                    <RedditShareButton url={URL_PARA_COMPARTIR} >
                                                        <RedditIcon size={32} round />
                                                    </RedditShareButton>
                                                    <WhatsappShareButton url={URL_PARA_COMPARTIR} >
                                                        <WhatsappIcon size={32} round />
                                                    </WhatsappShareButton>
                                                    <LinkedinShareButton url={URL_PARA_COMPARTIR} >
                                                        <LinkedinIcon size={32} round />
                                                    </LinkedinShareButton>
                                                </div>
                                                <EntradaConPortapapeles texto={URL_PARA_COMPARTIR} />
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Compartir</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>
            </CardHeader>

            <CardContent className={clsx("mb-4", {
                "h-[100px] lg:h-[200px] overflow-hidden": tamaño == "sm"
            })}>
                {contenidoHtml && (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contenidoHtml) }} />
                )}
            </CardContent>
            {tamaño == "sm" &&
                <CardFooter className="font-bold flex-col">
                    <div className="flex w-full sm:w-1/2 self-start justify-between mb-4">
                        <Link className="shrink-0" href={`/articulo/${articulo.id}`}>
                            ...Leer más
                        </Link>
                        {editable &&
                            <Link href={`/editar_articulo/${articulo.id}`}>
                                <Button>
                                    Editar
                                </Button>
                            </Link>
                        }
                    </div>
                    <div className="flex self-end gap-3">
                        {
                            articulo.tags.map((etiqueta) => {
                                return (
                                    <Link key={etiqueta} href={`/busqueda?c=${etiqueta}`}>
                                        <Badge>
                                            {etiqueta}
                                        </Badge>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </CardFooter >
            }
        </Card >
    );
}
