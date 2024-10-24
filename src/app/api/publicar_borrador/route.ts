import { guardarArticulo } from "@/lib/actions";
import { kv } from "@vercel/kv";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const idDelBorrador = params.get("id")
    if (!idDelBorrador) {
        redirect("/")
    }
    const borrador = await kv.get<{
        textoPlano: string,
        textoSerializado: string,
        titulo: string,
        etiquetas: string[]
    }>(idDelBorrador)
    if (!borrador) {
        redirect("/")
    }
    await guardarArticulo(borrador)
    redirect("/")
}