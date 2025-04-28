import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Некорректный email'),password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  ...(isRegister && {name: z.string().min(2,'Имя должно быть не менее 2 символов')})
})

const AuthForm = ({isRegister})=>{
  const [showPassword, setShowPassword] = useState(false)
  const {login,register,isLoading,error} = useAuthStore()
  const {register: formRegister, handleSubmit, formState:{ errors }} = useForm({
    resolver: zodResolver(schema)
  })
    const onSubmit = async(data)=>{
        if(isRegister){
          await register(data)
        }
        else{
          await login(data.email, data.password)
        }
    }

  return (

    <div className="max-w-md mx-auto space-y-6">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input id="name" placeholder="Иван Иванов" {...formRegister('name')}/>
                {errors.name && 
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                }
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@mail.com" {...formRegister('email')}/>
              {errors.email && 
                <p className="text-sm text-red-500">{errors.email.message}</p>
              }
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••" {...formRegister('password')}/>
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                    <EyeOff className="h-4 w-4"/>
                ) : (
                    <Eye className="h-4 w-4"/>
                )}
                </Button>
              </div>
              {errors.password &&
                <p className="text-sm text-red-500">{errors.password.message}</p>
                }
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}   
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : isRegister ? 'Создать аккаунт' : 'Авторизоваться'}
            </Button>
        </form>

      <div className="space-y-4">
        <div className="flex gap-2 justify-center">
          <Button variant="outline" className="flex-1" disabled>
            <Github className="mr-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex-1" disabled>
            <Instagram className="mr-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex-1" disabled>
            <Google className="mr-2 h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-sm">
          <a href="#" className="underline">Забыли пароль?</a>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a href="#" className="underline">пользовательским соглашением</a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm

