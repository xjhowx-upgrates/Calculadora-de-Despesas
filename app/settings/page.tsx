"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTheme } from "next-themes";
import { withAuth } from '@/components/auth/with-auth';

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Personalize suas preferências</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Notificações por e-mail</Label>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              aria-label="Ativar ou desativar notificações por e-mail"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Modo Escuro</Label>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light');
              }}
              aria-label="Ativar ou desativar o modo escuro"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(SettingsPage);
