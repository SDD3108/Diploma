"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect,useState } from 'react'
import { Button } from '@/src/ui/button'
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from '@/src/ui/form'
import { Input } from '@/src/ui/input'
import { Eye,EyeOff,Github,Instagram } from 'lucide-react'
import { GoogleIcon } from '../../../src/components/icons/icons'
import useAuthStore from '@/src/store/AuthStore/authStore'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/src/ui/skeleton"
import Link from 'next/link'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import { InputOTP,InputOTPGroup,InputOTPSeparator,InputOTPSlot } from "@/src/ui/input-otp"
import axios from 'axios'
import { toast } from 'sonner'


const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
})
const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
})
const forgotPasswordSchema = z.object({
  otp: z.string().length(6, 'Код должен содержать 6 цифр'),
})


export const AuthForm = ({isRegister})=>{
  
  const [profile, setProfile] = useState(null)
  const {login,register,setTempPassword,isLoading,error} = useAuthStore()
  const [showPassword,setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resendTimeout, setResendTimeout] = useState(0)
  const [otpCode, setOtpCode] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [enteredOtp, setEnteredOtp] = useState('')
  const [tempPassword, setTempPasswordd] = useState('')
  const router = useRouter()
  const { t } = useTranslation('common')
  const backendApi = process.env.NEXT_PUBLIC_SOCKET_URL
  const generateOTPnumbers = ()=>{
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
  const generateTempPassword = ()=>{
    const password = Math.random().toString(36).slice(-8)
    setTempPasswordd(password)
    return password
  }
  useEffect(()=>{
    let interval
    if(resendTimeout > 0){
      interval = setInterval(() => {
        setResendTimeout((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  },[resendTimeout])
  const schema = showForgotPassword ? forgotPasswordSchema : isRegister ? registerSchema : loginSchema

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:{
      email:'',
      password:'',
      otp: '',
      ...(isRegister && {name:''}),
    }
  })
  const ForgotPassword = async()=>{
    try{
      await z.string().email().parseAsync(form.getValues('email'))
    }
    catch{
      form.setError('email', { message: t('auth.form.invalidEmail') })
      return
    }
    const email = form.getValues('email')
    if(!email){
      toast(t('auth.form.enterEmail'))
      return
    }
    const newOtp = generateOTPnumbers()
    const newTempPassword = generateTempPassword()
    const response = await axios.patch('/api/users/update-temp-password',{
      email,
      tempPassword: newTempPassword
    })
    await axios.post(`${backendApi}/send-email`,{
      from: 'mrbimson1@gmail.com',
      to: email,
      subject: 'Код восстановления пароля',
      text: `Ваш код: ${newOtp}\nВременный пароль: ${newTempPassword}`,
      html: `
        <p>Ваш код: <strong>${newOtp}</strong></p>
        <p>Временный пароль: <strong>${newTempPassword}</strong></p>
      `
    })

    setOtpCode(newOtp)
    setUserEmail(email)
    setShowForgotPassword(true)
    setResendTimeout(60)
    toast(t('auth.form.otp.sent'))    
  }
  const resendMessage = async()=>{
    const newOtp = generateOTPnumbers()
    const newTempPassword = generateTempPassword()
    setOtpCode(newOtp)
    await axios.patch('/api/users/update-temp-password', {
      email: userEmail,
      tempPassword: newTempPassword
    })
    const response = await axios.post(`${backendApi}/send-email`,{
      from: 'mrbimson1@gmail.com',
      to: userEmail,
      subject: 'Новый код восстановления пароля',
      text: `Ваш новый код: ${newOtp}`,
      html: `<p>Ваш новый код для восстановления: <strong>${newOtp}</strong></p>
      <p>Временный пароль: <strong>${newTempPassword}</strong></p>`
    })
    setOtpCode(newOtp)
    setResendTimeout(60)
    toast.success(t('auth.form.otp.newSent'))
  }
  const submit = async(data)=>{
    if(showForgotPassword){
      if(data.otp !== otpCode){
        toast(t('auth.form.otp.invalid'))
        return
      }
      const result = await login(userEmail,tempPassword)
      if(result.success){
        if(result.needsPasswordChange == true){
          router.push('/change-password')
        }
        toast(t('auth.form.success'))
        setShowForgotPassword(false)
        setEnteredOtp('')
        setOtpCode('')
        setUserEmail('')
        setTempPasswordd('')
        router.push('/change-password')
      }
    }
    else{
      const result = isRegister ? await register(data) : await login(data.email,data.password)
      if(result.success){
        form.reset()
        router.push(isRegister ? '/login' : '/')
      }
    }
    
  }
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <Form key={schema._def.description || schema.toString()} {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          {!showForgotPassword ? (
            <>
              {isRegister && (
                <FormField control={form.control} name="name" render={({field})=>(
                  <FormItem>
                    <FormLabel>{t('auth.form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('auth.form.name.placeholder')} {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              )}
              <FormField control={form.control} name="email" render={({field})=>(
                <FormItem>
                  <FormLabel>{t('auth.form.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('auth.form.email.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="password" render={({field})=>(
                <FormItem>
                  <FormLabel>{t('auth.form.password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••" {...field}/>
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </>
          ) : (
            <>
              <FormField control={form.control} name="otp" render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <Button variant='link' type="button" className="w-full cursor-pointer" onClick={resendMessage} disabled={resendTimeout > 0}>{resendTimeout > 0 ? `${t('auth.form.otp.resend')} (${resendTimeout})` : t('auth.form.otp.resend')}</Button>
                <FormControl>
                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                      <InputOTPGroup className=''>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                </FormControl>
              </FormItem>
              )}/>
            </>
          )}
          {error && (
            <div className="text-sm font-medium text-destructive text-center">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center">
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isRegister ? t('auth.form.register') : t('auth.form.login')}
            </Button>
          )}
        </form>
      </Form>
      {!showForgotPassword && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t" />
            <span className="text-sm text-muted-foreground">{t('auth.form.or')}</span>
            <div className="flex-1 border-t" />
          </div>
          <div className="flex gap-2 sm:flex-row max-sm:flex-col">
            <Button variant="outline" className="flex-1 cursor-pointer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" className="flex-1 cursor-pointer">
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="flex-1 cursor-pointer">
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </Button>
          </div>
        </div>
      )}
      <div className="text-center text-sm m-0">
        {!isRegister && !showForgotPassword && (
          <Button type='button' variant="link" className="text-muted-foreground h-auto p-0 cursor-pointer" onClick={ForgotPassword}>
            {t('auth.form.forgotPassword')}
          </Button>
        )}
      </div>
      {!showForgotPassword && (
        <div className='text-center text-sm mb-2'>
          {isRegister ? (
            <Button variant="link" className='cursor-pointer hover:no-underline'>
              {t('auth.form.alreadyHaveAccount')}<Link href='/login' className='hover:underline'>{t('auth.form.login')}</Link>
            </Button>
          ) : (
            <Button variant="link" className='cursor-pointer hover:no-underline'>
              {t('auth.form.noAccount')}<Link href='/registration' className='hover:underline'>{t('auth.form.register')}</Link>
            </Button>
          )}
        </div>
      )}
      {!showForgotPassword && (
        <p className="text-center text-xs text-muted-foreground">
          {t('auth.form.agreement')}
          <Button variant="link" className="text-xs h-auto p-0 cursor-pointer">
            {t('auth.form.userAgreement')}
          </Button>
        </p>
      )}
    </div>
  )
}