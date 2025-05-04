"use client"
import React,{useState} from 'react'
import { Button } from '@/src/ui/button'
import { Card,CardContent,CardHeader,CardTitle} from "@/src/ui/card"
import { RadioGroup, RadioGroupItem } from "@/src/ui/radio-group"
import { Label } from "@/src/ui/label"
const LanguagesPageBuilder = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('ru')
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'kz', label: 'Қазақ' },
    { value: 'ru', label: 'Русский' },
  ]
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Выбор языка</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Button onClick={() => console.log('Selected language:',selectedLanguage)} className="px-6 cursor-pointer">
            Сохранить изменения
          </Button>
        </div>
      </CardContent>
    </Card>
    // <div className='shadow-lg rounded-lg w-full px-4 py-6 flex gap-[1rem]'>
    //   <div>English</div>
    //   <div>Қазақ</div>
    //   <div>Русский</div>
    // </div>
  )
}

export default LanguagesPageBuilder