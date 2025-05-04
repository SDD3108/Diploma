"use client"
import React from 'react'
import { Button } from '@/src/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/ui/card'
import { Badge } from '@/src/ui/badge'
import { Phone, Mail, Clock } from 'lucide-react'

const SupportPageBuilder = () => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-2xl">Служба поддержки</CardTitle>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>24/7</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Общие вопросы</h3>
                  <p className="text-muted-foreground mt-1">+7 (775) 630 64 01</p>
                </div>
                <Button className="w-full" asChild>
                  <a href="tel:+77771234567">Позвонить</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Техническая поддержка</h3>
                  <p className="text-muted-foreground mt-1">+7 (705) 760 58 59</p>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <a href="tel:+77077654321">Позвонить</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Электронная почта</h3>
                <p className="text-muted-foreground mt-1">support@ticketon.kz</p>
              </div>
              <Button className="w-full" variant="outline" asChild>
                <a href="mailto:support@ticketon.kz">Написать письмо</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>Среднее время ответа: 15 минут</p>
          <p>Работаем без выходных и праздников</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SupportPageBuilder