/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import { Button } from '../ui/button';
import { BookPlus, Loader2 } from 'lucide-react';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import './editor.css'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, EditorState, LexicalEditor } from 'lexical';
import { guardarArticulo, guardarBorradorDeArticulo } from '@/lib/actions';
import editorConfig from './config';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Badge } from '../ui/badge';
import { useUser } from '@clerk/nextjs';

const esquemaDePublicacion = z.object({
    titulo: z.
        string().
        min(15, { message: "el título debe contener al menos 15 carácteres" })
        .max(110, { message: "el titulo puede tener hasta 110 carácteres" }),
    etiquetas: z
        .string()
        .array()
        .min(1, { message: "elegí al menos una etiqueta" })
        .max(3, { message: "podés elegir hasta 3 etiquetas" })
})

const defaultEtiquetas = [
    "Tecnología",
    "Estilo de Vida",
    "Arte",
    "Ciencia",
    "Negocios"
]

const placeholder = 'Escribí acá...';
const URL_MATCHER =
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
    (text: string) => {
        const match = URL_MATCHER.exec(text);
        if (match === null) {
            return null;
        }
        const fullMatch = match[0];
        return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
            // attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
        };
    },
];


export function EditorDeTexto() {
    const [editorState, setEditorState] = useState<string>("")
    const [textoPlano, setTextoPlano] = useState<string>("")
    const [estaGuardando, setEstaGuardando] = useState<boolean>(false)
    const { isSignedIn } = useUser();
    
    const onEditorChange = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
        const editorStateJSON = editorState.toJSON();
        setEditorState(JSON.stringify(editorStateJSON));
        setTextoPlano(editorState.read(() => $getRoot().getTextContent()))
    }

    const form = useForm<z.infer<typeof esquemaDePublicacion>>({
        resolver: zodResolver(esquemaDePublicacion),
        defaultValues: {
            titulo: "",
            etiquetas: []
        },
    })

    async function onSubmit(values: z.infer<typeof esquemaDePublicacion>) {
        if (!editorState && !textoPlano) return
        if (!isSignedIn) {
            setEstaGuardando(true)
            await guardarBorradorDeArticulo({ textoPlano: textoPlano, textoSerializado: editorState, titulo: values.titulo, etiquetas: values.etiquetas })
        }
        setEstaGuardando(true)
        await guardarArticulo({ textoPlano: textoPlano, textoSerializado: editorState, titulo: values.titulo, etiquetas: values.etiquetas })
    }

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className='relative w-full p-3 my-5 mx-auto'>
                <div className='flex flex-col xl:flex-row justify-between'>
                    <ToolbarPlugin />
                    <Dialog>
                        <DialogTrigger className='mb-4 xl:mb-0 w-36 self-center xl:self-start xl:mt-2'>
                            <Button>
                                <BookPlus />
                                Publicar
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Estas listo para publicar tu articulo?
                                </DialogTitle>
                                <DialogDescription>
                                    Tu articulo se publicará y todos los usuarios podran verlo.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="titulo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Elegí un título para tu publicación</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Escribí acá" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Este título se mostrará en las miniaturas de tu publicación.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="etiquetas"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Elegí etiquetas para tu publicación</FormLabel>
                                                <FormControl>
                                                    <ToggleGroup
                                                        type="multiple"
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            if (value.length <= 3) {
                                                                form.setValue('etiquetas', value)
                                                            }
                                                        }}
                                                        className="flex flex-wrap gap-2"
                                                    >
                                                        {defaultEtiquetas.map((etiqueta) => (
                                                            <ToggleGroupItem
                                                                key={etiqueta}
                                                                value={etiqueta}
                                                                disabled={field.value.length >= 3 && !field.value.includes(etiqueta)}
                                                            >
                                                                <Badge variant={field.value.includes(etiqueta) ? "default" : "outline"}>
                                                                    {etiqueta}
                                                                </Badge>
                                                            </ToggleGroupItem>
                                                        ))}
                                                    </ToggleGroup>
                                                </FormControl>
                                                <FormDescription>
                                                    Estas etiquetas ayudarán a categorizar y facilitar la búsqueda de tu artículo.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {estaGuardando ?
                                        (<Button disabled>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Publicando...
                                        </Button>)
                                        :

                                        (<Button type="submit">
                                            Publicar
                                        </Button>)
                                    }
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className='relative'>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className='h-[calc(100vh-10rem)] mb-4 p-3 border relative resize-none outline-none overflow-y-auto'
                                aria-placeholder={placeholder}
                                placeholder={
                                    <div className='absolute top-3 left-4 inline-block'>{placeholder}</div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />

                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <CheckListPlugin />
                    <TabIndentationPlugin />
                    <AutoLinkPlugin matchers={MATCHERS} />
                    <CharacterLimitPlugin charset='UTF-16' maxLength={15000} renderer={MaxLengthRenderer} />
                    <OnChangePlugin onChange={onEditorChange} />
                    {/* <TreeViewPlugin /> */}

                </div>
            </div>
        </LexicalComposer>
    );
}



function MaxLengthRenderer({ remainingCharacters }: { remainingCharacters: number }) {
    useEffect(() => {
        if (remainingCharacters <= 0) {
            toast("Limite de carácteres alcanzado", {
                description: "Llegaste al límite de carácteres permitido (15000).",
                action: {
                    label: "cerrar",
                    onClick: () => { },
                },
            })
        }
    }, [remainingCharacters])
    return (
        <></>
    );
}