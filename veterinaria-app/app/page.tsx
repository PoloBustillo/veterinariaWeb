import Link from "next/link";
import {
  HeartIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <HeartIcon className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VetCare</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#servicios"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Servicios
              </Link>
              <Link
                href="#nosotros"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Nosotros
              </Link>
              <Link
                href="#contacto"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Contacto
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Acceder
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              El mejor cuidado para tus mascotas
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Brindamos atención veterinaria profesional con tecnología de punta
              y un equipo comprometido con el bienestar de tu compañero.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/dashboard/consultas"
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition text-lg font-semibold"
              >
                Agendar Cita
              </Link>
              <Link
                href="#contacto"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition text-lg font-semibold"
              >
                Contáctanos
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl w-full h-96 flex items-center justify-center">
                <HeartIcon className="h-32 w-32 text-blue-400" />
              </div>
            </div>
            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">+5000</p>
                  <p className="text-sm text-gray-600">Consultas exitosas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicios" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que tu mascota necesita en un solo lugar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl hover:shadow-xl transition border border-blue-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Consultas Generales
              </h3>
              <p className="text-gray-600 mb-4">
                Exámenes de rutina, diagnósticos y tratamientos personalizados
                para el bienestar de tu mascota.
              </p>
              <Link
                href="/dashboard/consultas"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Agendar consulta →
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl hover:shadow-xl transition border border-purple-100">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HeartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cirugías
              </h3>
              <p className="text-gray-600 mb-4">
                Procedimientos quirúrgicos con equipamiento moderno y personal
                altamente capacitado.
              </p>
              <Link
                href="/dashboard"
                className="text-purple-600 font-semibold hover:text-purple-700"
              >
                Más información →
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl hover:shadow-xl transition border border-green-100">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vacunación
              </h3>
              <p className="text-gray-600 mb-4">
                Planes de vacunación completos para proteger la salud de tu
                mascota en todas sus etapas.
              </p>
              <Link
                href="/dashboard"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Ver planes →
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl hover:shadow-xl transition border border-orange-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <UserGroupIcon className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hospitalización
              </h3>
              <p className="text-gray-600 mb-4">
                Cuidado intensivo las 24 horas con monitoreo constante para
                casos que requieren atención especial.
              </p>
              <Link
                href="/dashboard"
                className="text-orange-600 font-semibold hover:text-orange-700"
              >
                Conocer más →
              </Link>
            </div>

            {/* Service 5 */}
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl hover:shadow-xl transition border border-pink-100">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ClockIcon className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Emergencias 24/7
              </h3>
              <p className="text-gray-600 mb-4">
                Servicio de urgencias disponible las 24 horas del día, los 7
                días de la semana.
              </p>
              <Link
                href="#contacto"
                className="text-pink-600 font-semibold hover:text-pink-700"
              >
                Contactar urgencias →
              </Link>
            </div>

            {/* Service 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl hover:shadow-xl transition border border-indigo-100">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <PhoneIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tienda Veterinaria
              </h3>
              <p className="text-gray-600 mb-4">
                Productos de calidad, alimentos especializados y accesorios para
                el cuidado de tu mascota.
              </p>
              <Link
                href="/dashboard/productos"
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Ver productos →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-white mb-2">15+</p>
              <p className="text-blue-100 text-lg">Años de experiencia</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white mb-2">5000+</p>
              <p className="text-blue-100 text-lg">Mascotas atendidas</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white mb-2">10</p>
              <p className="text-blue-100 text-lg">Veterinarios expertos</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white mb-2">24/7</p>
              <p className="text-blue-100 text-lg">Servicio de urgencias</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Somos una clínica veterinaria con más de 15 años de experiencia,
                dedicada al cuidado integral de tus mascotas. Contamos con
                tecnología de vanguardia y un equipo de profesionales
                apasionados.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Veterinarios certificados
                    </h4>
                    <p className="text-gray-600">
                      Profesionales con especialización y experiencia comprobada
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Equipamiento moderno
                    </h4>
                    <p className="text-gray-600">
                      Tecnología de punta para diagnósticos precisos
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Atención personalizada
                    </h4>
                    <p className="text-gray-600">
                      Cada mascota recibe un tratamiento único y adaptado
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-2xl h-96 flex items-center justify-center">
                <UserGroupIcon className="h-32 w-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h2>
            <p className="text-xl text-gray-600">Estamos aquí para ayudarte</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600">+52 (555) 123-4567</p>
              <p className="text-gray-600">Lunes a Domingo 24/7</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Horario</h3>
              <p className="text-gray-600">Lun - Vie: 8:00 - 20:00</p>
              <p className="text-gray-600">Sáb - Dom: 9:00 - 18:00</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ubicación
              </h3>
              <p className="text-gray-600">Av. Principal #123</p>
              <p className="text-gray-600">Ciudad de México</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para cuidar de tu mascota?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Agenda tu cita hoy y dale a tu compañero el cuidado que merece
          </p>
          <Link
            href="/dashboard/consultas"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-gray-100 transition text-lg font-semibold"
          >
            Agendar Cita Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <HeartIcon className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">VetCare</span>
              </div>
              <p className="text-gray-400">
                Cuidando a tus mascotas con amor y profesionalismo desde 2009
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Consultas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Cirugías
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Vacunación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Emergencias
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Testimonios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+52 (555) 123-4567</li>
                <li>info@vetcare.com</li>
                <li>Av. Principal #123</li>
                <li>Ciudad de México</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VetCare. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
