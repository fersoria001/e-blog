import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"
import Link from "next/link"

export function PieDePagina() {
  return (
    <footer id="pie-de-pagina" className="bg-muted sticky text-muted-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Sobre Nosotros</h3>
            <p className="text-sm">
              Nos apasiona compartir conocimiento e inspirar creatividad a través de nuestro blog.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Información</h3>
            <ul className="space-y-2">
              <li><Link href="/sobre-nosotros" className="hover:underline">Sobre Nosotros</Link></li>
              <li><Link href="/politica-de-privacidad" className="hover:underline">Política de Privacidad</Link></li>
              <li><Link href="/terminos-y-condiciones" className="hover:underline">Términos y Condiciones</Link></li>
              <li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li><Link href="/busqueda?c=Tecnología" className="hover:underline">Tecnología</Link></li>
              <li><Link href="/busqueda?c=Estilo de Vida" className="hover:underline">Estilo de Vida</Link></li>
              <li><Link href="/busqueda?c=Viajes" className="hover:underline">Viajes</Link></li>
              <li><Link href="/busqueda?c=Gastronomía" className="hover:underline">Gastronomía</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Suscribite al Newsletter</h3>
            <p className="text-sm mb-4">Mantenete al tanto de nuestras últimas publicaciones y novedades.</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Tu dirección de correo" />
              <Button type="submit" className="w-full">Suscribirse</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Tu Nombre de Blog. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}