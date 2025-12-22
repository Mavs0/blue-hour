import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Blue Hour</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Comissão de eventos especializada em trazer experiências
              exclusivas do{" "}
              <span className="text-pink-400 font-semibold">TXT</span> para
              Manaus. Eventos cuidadosamente curados para criar momentos mágicos
              e inesquecíveis.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/eventos"
                  className="hover:text-white transition-colors"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/eventos"
                  className="hover:text-white transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  Área Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Manaus, AM</li>
              <li>contato@bluehour.com.br</li>
              <li>Eventos Exclusivos</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Blue Hour - Comissão de Eventos. Todos
            os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
