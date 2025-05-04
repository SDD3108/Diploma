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
const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
})
const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
})

export const AuthForm = ({isRegister})=>{
  const [profile, setProfile] = useState(null)
  const {login,register,isLoading,error} = useAuthStore()
  const [showPassword,setShowPassword] = useState(false)
  const router = useRouter()
  
  const form = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues:{
      email:'',
      password:'',
      ...(isRegister && {name:''}),
    }
  })

  const onSubmit = async(data)=>{
    const result = isRegister ? await register(data) : await login(data.email, data.password)
    if(result.success){
      form.reset()
      router.push(isRegister ? '/login' : '/')
    }
  }
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <FormField control={form.control} name="name" render={({field})=>(

              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Сатимов Дамир" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
          )}
          <FormField control={form.control} name="email" render={({field})=>(

            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}/>
          <FormField control={form.control} name="password" render={({field})=>(
            <FormItem>
              <FormLabel>Пароль</FormLabel>
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
               {isRegister ? 'Зарегистрироваться' : 'Войти'}
             </Button>
            
          )}
        </form>
      </Form>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t" />
          <span className="text-sm text-muted-foreground">ИЛИ</span>
          <div className="flex-1 border-t" />
        </div>
        <div className="flex gap-2 sm:flex-row max-sm:flex-col">
          <Button variant="outline" className="flex-1 cursor-pointer" >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" className="flex-1 cursor-pointer" >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="flex-1 cursor-pointer" >
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </Button>
        </div>

        <div className="text-center text-sm">
          <Button variant="link" className="text-muted-foreground h-auto p-0 cursor-pointer">
            Забыли пароль?
          </Button>
        </div>
        <div className='text-center text-sm'>
          {isRegister ? (
            <Button variant="link" className='cursor-pointer hover:no-underline'>
              Уже есть аккаунт?<Link href='/login' className='hover:underline'>Войти</Link>
            </Button>
          ) : (
            <Button variant="link" className='cursor-pointer hover:no-underline'>
              Ещё нет аккаунта?<Link href='/registration' className='hover:underline'>Зарегистрироваться</Link>
            </Button>
          )}
          
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь с
          <Button variant="link" className="text-xs h-auto p-0 cursor-pointer">
            пользовательским соглашением
          </Button>
        </p>
      </div>
    </div>
  );
}