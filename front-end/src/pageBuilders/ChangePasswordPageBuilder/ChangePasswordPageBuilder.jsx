'use client'
import React,{useState,useEffect} from "react"
import useAuthStore from "../../../src/store/AuthStore/authStore"
import axios from "axios"
import { Input } from "@/src/ui/input"
import { Button } from "@/src/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
// import '@/i18n'
import { useTranslation } from 'react-i18next'
import { Label } from "@/src/ui/label"
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/src/ui/card"
import { Eye,EyeOff,Lock,ShieldAlert,CheckCircle2 } from "lucide-react"

const ChangePasswordPageBuilder = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [showPasswordRepeat,setShowPasswordRepeat] = useState(false)
    const { user,setForcePasswordChange } = useAuthStore()
    const router = useRouter()
    const { t } = useTranslation('common')
    useEffect(()=>{
      if(confirmPassword && newPassword !== confirmPassword){
        setPasswordError(t('auth.passwordsNotMatch'))
      }
      else{
        setPasswordError('')
      }
    },[newPassword,confirmPassword,t])
    const changePassword = async(e)=>{
      e.preventDefault()
      if(newPassword.length < 6){
        toast(t('auth.form.passwordMin'),{icon:<ShieldAlert className="text-red-500" />})
        return
      }
      const resp = await axios.patch('/api/users/change-password',{
        userId: user._id,
        newPassword
      })
      // localStorage.removeItem('force-password-change',{icon:<CheckCircle2 className="text-green-500"/>})
      setForcePasswordChange(false)
      router.push('/profile')
    }
    // SDSD310807Sd$
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-neutral-50 px-5">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Lock className="w-12 h-12 text-[#1A1A1A]" />
          </div>
          <CardTitle className="text-2xl text-center">
            {t('auth.changePassword')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.changePasswordDescription')}
          </CardDescription>
        </CardHeader>

        <form onSubmit={changePassword} className="space-y-6">
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('auth.newPassword')}</Label>
              <div className="relative">
                <Input id="newPassword" type={showPassword ? 'text' : 'password'} placeholder={t('auth.newPasswordPlaceholder')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-11"/>
                <Button type="button" variant="ghost" size="icon" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Input id="confirmPassword" type={showPasswordRepeat ? 'text' : 'password'} placeholder={t('auth.confirmPasswordPlaceholder')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11"/>
                <Button type="button" variant="ghost" size="icon" onClick={()=>setShowPasswordRepeat(!showPasswordRepeat)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                  {showPasswordRepeat ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {passwordError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  {passwordError}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full cursor-pointer h-11 text-lg bg-[#1A1A1A] hover:bg-[#1A1A1A]/95" disabled={passwordError.length > 0}>
              {t('auth.changePasswordButton')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    )
}
export default ChangePasswordPageBuilder