import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            Política de <span className="text-amber-900">Privacidad</span>
          </h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none space-y-8 font-normal">
            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">1. Introducción</h2>
              <p>
                En Affogato, valoramos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad explica cómo recopilamos, usamos y protegemos la información a través de nuestra plataforma de trazabilidad basada en blockchain.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">2. Información que recopilamos</h2>
              <p> Recopilamos información necesaria para el funcionamiento de nuestra plataforma, incluyendo: </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Información de contacto (nombre, correo electrónico).</li>
                <li>Datos de producción de café para fines de trazabilidad.</li>
                <li>Información del perfil del agricultor y la finca.</li>
                <li>Registros de transacciones en la red blockchain.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">3. Cómo usamos sus datos</h2>
              <p> Los datos recopilados se utilizan prioritariamente para: </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Proporcionar transparencia y trazabilidad en la cadena de suministro del café.</li>
                <li>Validar la autenticidad del producto mediante tecnología blockchain.</li>
                <li>Mejorar la experiencia del usuario y la comunicación entre productores y consumidores.</li>
                <li>Cumplir con requisitos legales y de auditoría.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">4. Seguridad de los datos</h2>
              <p>
                Implementamos medidas de seguridad robustas para proteger su información. Al utilizar blockchain, los registros de trazabilidad son inmutables y transparentes, garantizando que la información sobre el origen de su café no pueda ser alterada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">5. Sus derechos</h2>
              <p>
                Usted tiene derecho a acceder, rectificar o solicitar la eliminación de sus datos personales almacenados en nuestros sistemas centralizados. Tenga en cuenta que los datos registrados en el blockchain son permanentes por su propia naturaleza tecnológica.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-chivo text-gray-900 mb-4">6. Contacto</h2>
              <p>
                Si tiene preguntas sobre esta política, puede ponerse en contacto con nuestro equipo de soporte a través del correo electrónico proporcionado en la plataforma.
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

export default PrivacyPolicy;
