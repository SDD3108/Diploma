"use client"
import { AuthForm } from '@/src/companents/auth form/AuthForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
          <CardDescription className="text-gray-500">
            Введите свои учетные данные для продолжения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm isRegister={false} />
        </CardContent>
      </Card>
    </div>
  );
}