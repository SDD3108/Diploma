"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/src/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/ui/card'
import { Switch } from '@/src/ui/switch'
import { Label } from '@/src/ui/label'
import { Moon, Sun } from 'lucide-react'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../../store/AuthStore/authStore'

const ModsPageBuilder = () => {
  const { setTheme,theme } = useAuthStore()
  const { t } = useTranslation('common')
  // const [savedTheme,setSavedTheme] = useState(null)
  // useEffect(()=>{
  //   const localSavedTheme = localStorage.getItem('theme')
  //   setSavedTheme(localSavedTheme)
  // },[])
  const [isDark, setIsDark] = useState(()=>{
    if(typeof window !== 'undefined'){
      return theme ? theme == 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  useEffect(()=>{
    if(isDark){
      document.documentElement.classList.add('dark')
      // localStorage.setItem('theme','dark')
      setTheme('dark')
    }
    else{
      document.documentElement.classList.remove('dark')
      // localStorage.setItem('theme','light')
      setTheme('light')
    }
  }, [isDark])
  return (
    <Card className="w-full max-w-2xl md:mx-0 sm:mx-auto max-sm:mx-auto md:my-0 sm:my-[2rem] max-sm:my-[2rem]">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-primary">{t('settings.card.title')}</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            {isDark ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
          <div className="space-y-1">
            <Label className="text-lg">{t('settings.darkTheme.label')}</Label>
            <p className="text-sm text-muted-foreground">
              {isDark ? t('settings.darkTheme.activeDark') : t('settings.darkTheme.activeLight')}
            </p>
          </div>
          <Switch checked={isDark} onCheckedChange={setIsDark} className="data-[state=checked]:bg-primary" />
        </div>
        <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Sun className="h-4 w-4" />
            {t('settings.themeOption.light')}
          </span>
          <span className="flex items-center gap-1">
            <Moon className="h-4 w-4" />
            {t('settings.themeOption.dark')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default ModsPageBuilder