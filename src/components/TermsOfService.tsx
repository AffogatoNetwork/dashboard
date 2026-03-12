import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1320px] mx-auto px-4 md:px-9 py-20 lg:py-32">
        <div className="max-w-4xl">
          <Link to="/" className="inline-flex items-center text-amber-900 font-semibold mb-8 hover:translate-x-[-2px] transition-transform">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          
          <h1 className="font-bold font-chivo text-gray-900 text-[46px] leading-[52px] lg:text-[64px] lg:leading-[70px] mb-8">
            Términos de <span className="text-amber-900">Servicio</span>
          </h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-8 font-normal">
            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar la plataforma de Affogato, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">2. Uso de la Plataforma</h2>
              <p>
                Nuestra plataforma proporciona servicios de trazabilidad de café utilizando tecnología blockchain. Usted se compromete a proporcionar información veraz y precisa sobre sus procesos de producción, procesamiento o comercialización.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">3. Propiedad Intelectual</h2>
              <p>
                Todo el contenido, marcas, logotipos y tecnología blockchain asociados con Affogato son propiedad de sus respectivos dueños. El uso de la plataforma no concede ninguna licencia sobre estos activos más allá de lo necesario para el uso previsto del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">4. Inmutabilidad de los Datos</h2>
              <p>
                Usted reconoce que la información registrada en la red blockchain es inmutable por diseño. Una vez que un registro de trazabilidad es confirmado, no puede ser modificado ni eliminado de la cadena de bloques pública o privada utilizada por el sistema.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">5. Limitación de Responsabilidad</h2>
              <p>
                Affogato no se hace responsable de las decisiones comerciales tomadas basadas en los datos de trazabilidad proporcionados por terceros, ni por interrupciones temporales en el acceso a la red blockchain que están fuera de nuestro control directo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">6. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la plataforma después de dichos cambios constituirá su aceptación de los nuevos términos.
              </p>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-gray-200 text-gray-400 text-sm">
            Última actualización: Marzo 2026. Versión 1.2
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
