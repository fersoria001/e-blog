import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Pagina() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Política de Privacidad de eBlog</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-6">
            Última actualización: 25 de octubre de 2024
          </p>
          <p className="mb-6">
            Bienvenido a eBlog. Estamos comprometidos a proteger su información personal y su derecho a la privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos y compartimos su información cuando utiliza nuestro sitio web.
          </p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="information-collection">
              <AccordionTrigger>Información que Recopilamos</AccordionTrigger>
              <AccordionContent>
                <p>Recopilamos información personal que usted nos proporciona cuando se registra para una cuenta, se suscribe a nuestro boletín o nos contacta. Esto puede incluir:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Nombre</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Información de perfil</li>
                  <li>Contenido de sus publicaciones de blog y comentarios</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="information-use">
              <AccordionTrigger>Cómo Utilizamos su Información</AccordionTrigger>
              <AccordionContent>
                <p>Utilizamos su información para:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                  <li>Comunicarnos con usted sobre su cuenta y nuestros servicios</li>
                  <li>Personalizar su experiencia en nuestra plataforma</li>
                  <li>Analizar cómo se utilizan nuestros servicios</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="information-sharing">
              <AccordionTrigger>Compartir y Divulgar Información</AccordionTrigger>
              <AccordionContent>
                <p>No vendemos su información personal. Podemos compartir su información en las siguientes situaciones:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Con su consentimiento</li>
                  <li>Para cumplir con obligaciones legales</li>
                  <li>Para proteger nuestros derechos y prevenir fraudes</li>
                  <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="data-security">
              <AccordionTrigger>Seguridad de Datos</AccordionTrigger>
              <AccordionContent>
                <p>Implementamos medidas técnicas y organizativas apropiadas para proteger su información personal. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar una seguridad absoluta.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="your-rights">
              <AccordionTrigger>Sus Derechos</AccordionTrigger>
              <AccordionContent>
                <p>Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, incluyendo:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>El derecho a acceder a su información personal</li>
                  <li>El derecho a corregir información inexacta</li>
                  <li>El derecho a eliminar su información</li>
                  <li>El derecho a oponerse o restringir el procesamiento de su información</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="changes">
              <AccordionTrigger>Cambios en esta Política de Privacidad</AccordionTrigger>
              <AccordionContent>
                <p>Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de &quot;Última actualización&quot; en la parte superior de esta política.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="contact">
              <AccordionTrigger>Contáctenos</AccordionTrigger>
              <AccordionContent>
                <p>Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos en:</p>
                <p className="mt-2">
                  Correo electrónico: bercho001@gmail.com<br />
                  Dirección: San Carlos de Bariloche, Río Negro, Argentina.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  )
}