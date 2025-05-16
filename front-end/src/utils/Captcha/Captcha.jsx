import React,{ useState,useCallback,useEffect } from 'react'
import { Button } from "@/src/ui/button"
import { Input } from "@/src/ui/input"
import { Label } from "@/src/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/ui/card"
import { ReloadIcon } from "@radix-ui/react-icons"
import '../../../i18n'
import  { useTranslation } from 'react-i18next'
import { setData } from '../DataTransfer/DataTransfer'

const generateRandomText = (length = 6)=>{
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let text = ''
    for(let i = 0; i < length; i++){
      text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return text
}

export const Captcha = ({success})=>{
    const { t } = useTranslation('common')
    const [captchaText, setCaptchaText] = useState('')
    const [userInput, setUserInput] = useState('')
    const [isVerified, setIsVerified] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const generateNewCaptcha = useCallback(()=>{
      const newText = generateRandomText()
      setCaptchaText(newText)
      setUserInput('')
      setIsVerified(null)
    },[])
    useEffect(()=>{
      generateNewCaptcha()
    },[generateNewCaptcha])
    const verifyCheck = () => {
      setIsLoading(true)
      setTimeout(() => {
        const verified = userInput === captchaText
        setIsVerified(verified)
        setIsLoading(false)
        if(verified && success){
          success()
        }
      },500) 
    }
    return (
      <Card className="w-full rounded-md sticky z-60">
        <CardHeader>
          <CardTitle>{t('captcha.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
              <div className="relative flex items-center justify-center h-20 bg-muted/50">
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="absolute w-full h-px bg-gray-400/30" style={{
                      top: `${Math.random() * 100}%`,
                      transform: `rotate(${Math.random() * 60 - 30}deg)`
                    }}/>
                  ))}
                </div>
                {captchaText.split('').map((char, index)=>(
                  <span key={index} className="text-3xl font-bold mx-1" style={{transform: `rotate(${Math.random() * 15 - 7.5}deg)`,color: `hsl(${Math.random() * 360}, 70%, 40%)`}}>
                    {char}
                  </span>
                ))}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="captcha">{t('captcha.description')}</Label>
                  <Input id="captcha" value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={isLoading}/>
                  {isVerified !== null && (
                    <p className={`text-sm ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {isVerified ? `✓ ${t('captcha.success')}` : t('captcha.fail')}
                    </p>
                  )}
                </div>
                <div className="flex justify-between gap-2">
                  <Button variant="outline" onClick={generateNewCaptcha} disabled={isLoading}>
                    <ReloadIcon className="mr-2 h-4 w-4" />
                    {t("captcha.update")}
                  </Button>
                  <Button onClick={verifyCheck} disabled={isLoading || !userInput}>
                    {isLoading ? t('captcha.checking') : t('captcha.confirm')}
                  </Button>
                </div>
          </div>
        </CardContent>
      </Card>
    )
}

// export default Captcha