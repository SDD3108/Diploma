"use client"
import { AuthForm } from '../../../src/feature/auth form/AuthForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../src/ui/card';
import axios from 'axios';
import { useEffect } from 'react';

export default function RegisterPage() {
  useEffect(() => {
    const test = async() => {
      try {
        const response = await axios.get('/api/users')
        console.log(response.data);
      }
      catch(error){
        console.error('Error fetching users:', error)
      }
    }
    test()
  },[])
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Создание аккаунта</CardTitle>
          <CardDescription className="text-gray-500">
            Заполните все поля для регистрации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm isRegister={true} />
        </CardContent>
      </Card>
    </div>
  );
}