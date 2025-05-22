"use client"
import React,{useState} from 'react'
import { Button } from '@/src/ui/button'
import { Card,CardContent,CardHeader,CardTitle} from "@/src/ui/card"
import { RadioGroup, RadioGroupItem } from "@/src/ui/radio-group"
import { Label } from "@/src/ui/label"
import '@/i18n'
import { useTranslation } from 'react-i18next'

const LanguagesPageBuilder = () => {
  const { t,i18n } = useTranslation('common')
  const [selectedLanguage, setSelectedLanguage] = useState('ru')
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'kz', label: 'Қазақ' },
    { value: 'ru', label: 'Русский' },
  ]
  const changeLanguage = (lng)=>{
    if(i18n.changeLanguage){
      i18n.changeLanguage(lng)
      .then(()=>{
        setSelectedLanguage(lng)
      })
    }
    else{
      console.log('ошибка с измением языка',i18n)
    }
  }
  return (
    <Card className="w-full max-w-2xl md:mx-0 sm:mx-auto max-sm:mx-auto md:my-0 sm:my-[2rem] max-sm:my-[2rem]">
      <CardHeader>
        <CardTitle className="text-xl">{t("description")}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedLanguage} onValueChange={(lng)=>{
          setSelectedLanguage(lng)
          i18n.changeLanguage(lng)
        }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang)=>(
            <div key={lang.value}>
              <RadioGroupItem value={lang.value} id={lang.value} className="peer sr-only"/>
              <Label htmlFor={lang.value} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                <span className="text-sm font-medium">{lang.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => changeLanguage(selectedLanguage)} className="px-6 cursor-pointer">
            {t("button_save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LanguagesPageBuilder