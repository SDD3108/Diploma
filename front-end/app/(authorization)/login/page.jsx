"use client"
export const dynamic = 'force-dynamic'

import { AuthForm } from '../../../src/feature/auth form/AuthForm';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/ui/card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../src/ui/card';
// import '@/i18n'
import { useTranslation } from 'react-i18next'

export default function LoginPage(){
  const { t } = useTranslation('common')
  
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-100 dark:bg-neutral-950">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">{t('auth.login.title')}</CardTitle>
          <CardDescription className="text-gray-500">
            {t('auth.login.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm isRegister={false} />
        </CardContent>
      </Card>
    </div>
  )
}