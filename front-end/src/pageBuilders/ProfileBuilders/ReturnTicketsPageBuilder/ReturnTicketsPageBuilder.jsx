"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/src/ui/alert'
import { Badge } from '@/src/ui/badge'
import { Clock, Info, Phone, MessageSquareText } from 'lucide-react'
import { Button } from '@/src/ui/button'
import { Separator } from '@/src/ui/separator'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const ReturnTicketsPageBuilder = () => {
  const { t } = useTranslation('common')
  const stepsOfReturnTicket = [
    t('refund.process.step1'),
    t('refund.process.step2'),
    t('refund.process.step3'),
    t('refund.process.step4'),
    t('refund.process.step5'),
  ] 
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Info className="h-6 w-6 text-primary" />
          {t('refund.card.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('refund.alert.infoTitle')}</AlertTitle>
          <AlertDescription>{t('refund.alert.description')}</AlertDescription>
        </Alert>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('refund.generalRules.title')}
          </h3>
          <div className="grid gap-3 pl-6">
            <div className="flex items-start gap-2">
              <Badge variant="destructive" className="mt-1">!</Badge>
              <p>{t('refund.generalRules.after')}</p>
            </div>
            <ul className="list-disc space-y-2 text-muted-foreground">
              <li>{t('refund.generalRules.item.sessionStart')}</li>
              <li>{t('refund.generalRules.item.validation')}</li>
              <li>{t('refund.generalRules.item.print')}</li>
              <li>{t('refund.generalRules.item.notAllowed')}</li>
            </ul>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('refund.specialConditions.title')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-destructive flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('refund.specialConditions.impossible.title')}
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  <li>{t('refund.specialConditions.impossible.item1')}</li>
                  <li>{t('refund.specialConditions.impossible.item2')}</li>
                  <li>{t('refund.specialConditions.impossible.item3')}</li>
                  <li>{t('refund.specialConditions.impossible.item4')}</li>
                  <li>{t('refund.specialConditions.impossible.item5')}</li>
                  <li>{t('refund.specialConditions.impossible.item6')}</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-green-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('refund.specialConditions.oneHour.title')}
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  <li>{t('refund.specialConditions.oneHour.item1')}</li>
                  <li>{t('refund.specialConditions.oneHour.item2')}</li>
                  <li>{t('refund.specialConditions.oneHour.item3')}</li>
                  <li>{t('refund.specialConditions.oneHour.item4')}</li>
                  <li>{t('refund.specialConditions.oneHour.item5')}</li>
                  <li>{t('refund.specialConditions.oneHour.item6')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('refund.process.title')}</h3>
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
          <h3 className="text-lg font-semibold">{t('refund.support.title')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2" asChild>
              <Link href="tel:+77756306401">
                <Phone className="h-4 w-4" />
                +7 775 630 64 01
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="https://wa.me/77756306401" target="_blank">
                <MessageSquareText className="h-4 w-4" />
                WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReturnTicketsPageBuilder