import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Pagina() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Sobre eBlog</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Nuestra Misión</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">
                        En eBlog, nos apasiona compartir historias y conocimientos. Nuestro objetivo es crear un espacio donde los bloggers argentinos puedan expresarse libremente, conectarse con sus lectores y crecer como escritores.
                    </p>
                </CardContent>
            </Card>

            <h2 className="text-3xl font-semibold mb-6">Nuestro Equipo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { nombre: "Fernando Agustín Soria", rol: "Desarrollador web", avatar: "./fernando-agustin.jpg" },
                ].map((miembro) => (
                    <Card key={miembro.nombre}>
                        <CardHeader>
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                                <AvatarImage src={miembro.avatar} alt={miembro.nombre} />
                                <AvatarFallback>{miembro.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-center">{miembro.nombre}</CardTitle>
                            <CardDescription className="text-center">{miembro.rol}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Nuestra Historia</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        eBlog nació en 2024, cuando un decidi crear una plataforma para conectar a bloggers de toda Argentina.
                    </p>
                    <p>
                        Desde entonces, crecemos para convertirnos en una de las comunidades de blogs más grandes del país, con miles de escritores y lectores activos cada día.
                    </p>
                </CardContent>
            </Card>

            <div className="text-center mt-12">
                <h2 className="text-2xl font-semibold mb-4">¿Querés ser parte de nuestra comunidad?</h2>
                <p className="mb-6">Unite a eBlog hoy y comenzá a compartir tus historias con el mundo.</p>
                <SignedOut>
                    <SignInButton>
                        <p
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold"
                        >
                            Registrate Gratis
                        </p>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <Link
                        href={"/nuevo_articulo"}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold"
                    >
                        Escribí un articulo
                    </Link>
                </SignedIn>
            </div>
        </div>
    )
}