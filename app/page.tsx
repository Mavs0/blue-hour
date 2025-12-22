import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Music,
  Ticket,
  Star,
  Users,
  Calendar,
  Heart,
  ArrowRight,
  Play,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DreamParticles } from "@/components/dream-particles";
import { FloatingStars } from "@/components/floating-stars";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50">
        <DreamParticles />
        <FloatingStars />

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-sky-200/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-200/40 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-pink-200/50 shadow-lg">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Eventos Exclusivos TXT
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black mb-8 leading-[0.9] text-center">
              <span className="block bg-gradient-to-r from-sky-500 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                BLUE
              </span>
              <span className="block bg-gradient-to-r from-purple-500 via-pink-400 to-sky-500 bg-clip-text text-transparent mt-2">
                HOUR
              </span>
            </h1>

            {/* Subtitle */}
            <div className="text-center mb-12">
              <p className="text-2xl md:text-3xl font-light text-gray-600 mb-4">
                Tomorrow X Together
              </p>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                Um sonho lindo esperando por você em Manaus
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/eventos">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105 border-0 font-semibold"
                >
                  Ver Eventos
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/eventos">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/90 backdrop-blur-md border-2 border-gray-200 text-gray-700 text-lg px-10 py-7 rounded-full hover:bg-white hover:border-pink-300 transition-all shadow-lg font-semibold"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center bg-white/50 backdrop-blur-sm">
            <div className="w-1 h-3 bg-pink-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Blue Hour
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Uma comissão de eventos dedicada a trazer experiências
                exclusivas do{" "}
                <span className="font-bold text-pink-500">TXT</span> para
                Manaus. Criamos momentos mágicos e inesquecíveis.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-sky-50 to-pink-50 border border-sky-100 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Eventos Exclusivos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cada evento é cuidadosamente planejado para celebrar a música
                  e a arte do Tomorrow X Together.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Experiência Blue Hour
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Viva a atmosfera única do Blue Hour, onde cada momento é um
                  sonho lindo compartilhado com outros MOAs.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-sky-50 border border-purple-100 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Comunidade MOA
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Junte-se à comunidade MOA em Manaus e compartilhe sua paixão
                  pelo TXT em eventos inesquecíveis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <div className="text-gray-600 font-medium">
                  Eventos Realizados
                </div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  5K+
                </div>
                <div className="text-gray-600 font-medium">
                  MOAs Satisfeitos
                </div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-500 to-sky-500 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-gray-600 font-medium">
                  Experiência Premium
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Por que escolher
                </span>
                <br />
                <span className="text-gray-800">a Blue Hour?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-gray-100 hover:border-pink-200 transition-all hover:shadow-2xl transform hover:-translate-y-2 bg-white">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Ticket className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">
                    Ingressos Exclusivos
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Acesso prioritário aos eventos do TXT em Manaus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Garanta seu lugar nos eventos mais aguardados com nosso
                    sistema seguro e confiável.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-pink-200 transition-all hover:shadow-2xl transform hover:-translate-y-2 bg-white">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">
                    Eventos Curados
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Seleção cuidadosa dos melhores eventos TXT
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Cada evento passa por um processo rigoroso para garantir a
                    melhor experiência Blue Hour.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-pink-200 transition-all hover:shadow-2xl transform hover:-translate-y-2 bg-white">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-sky-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">
                    Experiência Premium
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Produção de alta qualidade em cada detalhe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Do som à iluminação, cada aspecto é pensado para criar uma
                    experiência única e inesquecível.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-sky-500 via-pink-500 to-purple-500 relative overflow-hidden">
        <FloatingStars />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Não perca nossos próximos eventos TXT!
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Fique por dentro de todos os eventos exclusivos da Blue Hour e
              garanta seu ingresso antes que esgotem.
            </p>
            <Link href="/eventos">
              <Button
                size="lg"
                className="bg-white text-pink-500 hover:bg-gray-50 text-lg px-12 py-8 rounded-full shadow-2xl font-bold transform hover:scale-105 transition-all border-0"
              >
                <Ticket className="mr-2 w-5 h-5" />
                Ver Todos os Eventos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
