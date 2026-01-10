"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/toaster";

export function PreferenciasSection() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const { success } = useToast();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setSaved(true);
    success("Preferência salva", "O tema foi alterado com sucesso.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Aparência
        </CardTitle>
        <CardDescription>
          Personalize a aparência do painel administrativo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Tema</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                theme === "light"
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Sun className="h-6 w-6 text-yellow-500" />
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-white">
                  Claro
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tema claro
                </p>
              </div>
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                theme === "dark"
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Moon className="h-6 w-6 text-blue-500" />
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-white">
                  Escuro
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tema escuro
                </p>
              </div>
            </button>

            <button
              onClick={() => handleThemeChange("system")}
              className={`flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                theme === "system"
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Monitor className="h-6 w-6 text-gray-500" />
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-white">
                  Sistema
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Seguir sistema
                </p>
              </div>
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              ✓ Preferência salva com sucesso
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
