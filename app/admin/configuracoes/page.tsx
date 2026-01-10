"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  Shield,
  HelpCircle,
  Bell,
  Palette,
  Database,
  Info,
} from "lucide-react";
import { AdminLoading } from "@/components/admin/admin-loading";
import { PerfilSection } from "@/components/admin/configuracoes/perfil-section";
import { SegurancaSection } from "@/components/admin/configuracoes/seguranca-section";
import { AjudaSection } from "@/components/admin/configuracoes/ajuda-section";
import { PreferenciasSection } from "@/components/admin/configuracoes/preferencias-section";
import { SistemaSection } from "@/components/admin/configuracoes/sistema-section";

export default function AdminConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("perfil");

  useEffect(() => {
    // Simular carregamento inicial
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <AdminLoading message="Carregando configurações..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-sky-500" />
          Configurações
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Gerencie suas preferências, segurança e informações da conta
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="preferencias" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Preferências</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="ajuda" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ajuda</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
          <PerfilSection />
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <SegurancaSection />
        </TabsContent>

        <TabsContent value="preferencias" className="space-y-6">
          <PreferenciasSection />
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como e quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    As configurações de notificações serão implementadas em
                    breve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ajuda" className="space-y-6">
          <AjudaSection />
        </TabsContent>

        <TabsContent value="sistema" className="space-y-6">
          <SistemaSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
