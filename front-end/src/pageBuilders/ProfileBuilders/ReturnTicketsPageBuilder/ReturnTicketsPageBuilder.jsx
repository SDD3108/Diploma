"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/src/ui/alert'
import { Badge } from '@/src/ui/badge'
import { Clock, Info, Phone, MessageSquareText } from 'lucide-react'
import { Button } from '@/src/ui/button'
import { Separator } from '@/src/ui/separator'

const ReturnTicketsPageBuilder = () => {
  const stepsOfReturnTicket = [
    'Зайдите в раздел «Мои билеты»',
    'Выберите нужный билет',
    'Нажмите «Вернуть билеты»',
    'Подтвердите возврат',
    'Ожидайте обработки запроса'
  ] 
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Info className="h-6 w-6 text-primary" />
          Возврат билетов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Важная информация!</AlertTitle>
          <AlertDescription>
            Возврат денежных средств осуществляется на ту же карту в течение 3 рабочих дней
          </AlertDescription>
        </Alert>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Общие правила возврата
          </h3>
          <div className="grid gap-3 pl-6">
            <div className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-1">!</Badge>
              <p>Билеты не подлежат возврату после:</p>
            </div>
            <ul className="list-disc space-y-2 text-muted-foreground">
              <li>Начала сеанса/мероприятия</li>
              <li>Проведения валидации билетов</li>
              <li>Распечатки билетов на кассе</li>
              <li>Если возврат не предусмотрен правилами мероприятия</li>
            </ul>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Особые условия кинотеатров</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-destructive flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Возврат невозможен
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  <li>Chaplin Khan Shatyr</li>
                  <li>Kinopark 8 IMAX Saryarka</li>
                  <li>Kinopark 7 IMAX Keruen</li>
                  <li>Keruen Cinema (Talan Gallery)</li>
                  <li>Eurasia Cinema7</li>
                  <li>Step Cinema</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-green-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Возврат за 1 час
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  <li>Chaplin MEGA Silk Way</li>
                  <li>Arman Asia Park</li>
                  <li>Kinopark 6 Keruencity</li>
                  <li>Dostar Cinema</li>
                  <li>Aru Cinema</li>
                  <li>Arsenal</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Порядок возврата</h3>
          <div className="grid gap-3 pl-4">
            {stepsOfReturnTicket.map((step,index)=>(
              <div key={index} className="flex items-center gap-3">
                <Badge variant="outline" className="h-6 w-6 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Служба поддержки</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2" asChild>
              <a href="tel:+77059278009">
                <Phone className="h-4 w-4" />
                +7 705 927 80 09
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://wa.me/77768089738" target="_blank">
                <MessageSquareText className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReturnTicketsPageBuilder