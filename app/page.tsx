'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, BarChart2, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-primary" />
          <span className="sr-only">Calculadora de Despesas</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard">
            <Button variant="outline">Acessar</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Criar Conta</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-gray-100">Controle suas finanças com inteligência</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl my-6">Nossa plataforma oferece as ferramentas que você precisa para gerenciar suas despesas, visualizar seus gastos e alcançar suas metas financeiras.</p>
            <Link href="/dashboard">
              <Button size="lg">Comece agora, é grátis</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">Tudo que você precisa em um só lugar</h2>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Registro Simples</h3>
                <p className="text-muted-foreground">Adicione suas despesas de forma rápida e intuitiva, com categorias personalizadas.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Dashboards Visuais</h3>
                <p className="text-muted-foreground">Analise seus gastos com gráficos interativos e entenda para onde seu dinheiro está indo.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Segurança</h3>
                <p className="text-muted-foreground">Seus dados são privados e protegidos. Foco total na sua segurança e privacidade.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Calculadora de Despesas. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs text-muted-foreground">Desenvolvido com ❤️ por XJHOWX</p>
        </nav>
      </footer>
    </div>
  );
}