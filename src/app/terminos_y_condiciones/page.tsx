import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Pagina() {
    return (
        <div className="min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold">Términos y Condiciones de eBlog</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>Bienvenido a eBlog</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            Estos Términos y Condiciones rigen su uso de eBlog. Al acceder o utilizar nuestro servicio, usted acepta estar sujeto a estos términos. Por favor, léalos cuidadosamente.
                        </p>
                        <p className="mb-6">
                            Última actualización: 25 de octubre de 2024
                        </p>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="uso-del-servicio">
                                <AccordionTrigger>1. Uso del Servicio</AccordionTrigger>
                                <AccordionContent>
                                    <p>Al utilizar eBlog, usted se compromete a:</p>
                                    <ul className="list-disc list-inside mt-2">
                                        <li>Proporcionar información precisa y completa al crear una cuenta.</li>
                                        <li>Mantener la seguridad de su cuenta y contraseña.</li>
                                        <li>No utilizar el servicio para fines ilegales o no autorizados.</li>
                                        <li>No infringir los derechos de propiedad intelectual de otros.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="contenido-del-usuario">
                                <AccordionTrigger>2. Contenido del Usuario</AccordionTrigger>
                                <AccordionContent>
                                    <p>Al publicar contenido en eBlog, usted:</p>
                                    <ul className="list-disc list-inside mt-2">
                                        <li>Mantiene los derechos de autor de su contenido.</li>
                                        <li>Otorga a eBlog una licencia mundial, no exclusiva y libre de regalías para usar, modificar, reproducir y distribuir su contenido.</li>
                                        <li>Es responsable de todo el contenido que publique.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="propiedad-intelectual">
                                <AccordionTrigger>3. Propiedad Intelectual</AccordionTrigger>
                                <AccordionContent>
                                    <p>El servicio y su contenido original, características y funcionalidad son propiedad exclusiva de eBlog y están protegidos por leyes internacionales de derechos de autor, marcas registradas, patentes, secretos comerciales y otros derechos de propiedad intelectual.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="terminacion">
                                <AccordionTrigger>4. Terminación</AccordionTrigger>
                                <AccordionContent>
                                    <p>Podemos terminar o suspender su acceso inmediatamente, sin previo aviso ni responsabilidad, por cualquier motivo, incluyendo, sin limitación, si usted incumple estos Términos y Condiciones.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="limitacion-de-responsabilidad">
                                <AccordionTrigger>5. Limitación de Responsabilidad</AccordionTrigger>
                                <AccordionContent>
                                    <p>En ningún caso eBlog, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles, resultantes de su acceso o uso o incapacidad de acceder o usar el servicio.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="cambios">
                                <AccordionTrigger>6. Cambios en los Términos</AccordionTrigger>
                                <AccordionContent>
                                    <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos términos en cualquier momento. Si una revisión es material, proporcionaremos un aviso de al menos 30 días antes de que los nuevos términos entren en vigencia.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="ley-aplicable">
                                <AccordionTrigger>7. Ley Aplicable</AccordionTrigger>
                                <AccordionContent>
                                    <p>Estos términos se regirán e interpretarán de acuerdo con las leyes de Argentina, sin tener en cuenta sus disposiciones sobre conflictos de leyes.</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
                <div className="mt-8 text-center">
                    <p>Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos en:</p>
                    <p className="mt-2">
                        Correo electrónico: bercho001@gmail.com<br />
                        Dirección: San Carlos de Bariloche, Río Negro, Argentina.
                    </p>
                </div>
            </main>
        </div>
    )
}