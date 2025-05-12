"use client"
import React,{useState} from 'react'
import { Button } from "@/src/ui/button"
import { Input } from "@/src/ui/input"
import { Facebook,Instagram,Twitter,Mail,Phone,MapPin } from 'lucide-react'
import {HoverCard,HoverCardContent,HoverCardTrigger,} from "@/src/ui/hover-card"
import { Separator } from '@/src/ui/separator'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'sonner'

const FooterCompanent = () => {
  const [email, setEmail] = useState('')
  const mailingClick = async ()=>{
    if (email.trim().length < 8) {
      toast('Введите корректный email (минимум 8 символов)')
      return
    }
    try {
      const response = await axios.post('http://localhost:3002/send-email', {
        from:'mrbimson1@gmail.com',
        to: email,
        subject: 'Добро пожаловать!',
        text: 'Вы успешно авторизованы на платформе.',
        html: `<p>Здравствуйте!</p><p>Вы успешно авторизованы на платформе.</p>`
      });
      toast('Письмо отправлено!');
    } catch (err) {
      console.error(err);
      toast('Ошибка при отправке письма');
    }
  }
  return (
    <footer className='bg-[#141414] h-[24rem] px-5 py-10 text-[#FFFFFF] sm:h-[52rem] md:h-[24rem] max-sm:h-[52rem]'>
      <div>
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#00F000]">TicketFlow</h2>
          <p className="text-[#F5F5F5]">
            Мгновенное бронирование — одним кликом
          </p>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#F5F5F5] hover:bg-[#3D3D3D] hover:text-[#00F000]"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#F5F5F5] hover:bg-[#3D3D3D] hover:text-[#00F000]"
            >
              <Instagram className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[#F5F5F5] hover:bg-[#3D3D3D] hover:text-[#00F000]"
            >
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFFFFF]">Навигация</h3>
          <nav className="space-y-2">
            <Button variant="link" className="text-[#F5F5F5] hover:text-[#00F000] p-0 cursor-pointer">
              <Link href='/'>Главная страница</Link>
            </Button>
            <Button variant="link" className="text-[#F5F5F5] hover:text-[#00F000] p-0 block cursor-pointer">
              <Link href='/events'>События</Link>
            </Button>
            <Button variant="link" className="text-[#F5F5F5] hover:text-[#00F000] p-0 block cursor-pointer">
              <Link href='/profile'>Профиль</Link>
            </Button>
            <Button variant="link" className="text-[#F5F5F5] hover:text-[#00F000] p-0 block cursor-pointer">
              <Link href='/natisfaction'>Уведомления</Link>
            </Button>
          </nav>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFFFFF]">Контакты</h3>
          <div className="space-y-2 text-[#F5F5F5]">
            <div className="flex items-center gap-2 cursor-pointer">
              <Phone className="h-5 w-5 text-[#00F000]" />
              <span>+7 (775) 630-64-01</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <Mail className="h-5 w-5 text-[#00F000]" />
              <span>ticketflow@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <MapPin className="h-5 w-5 text-[#00F000]" />
              <span>Астана, ул. Сыганак, 47</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFFFFF]">Новостная рассылка</h3>
          <form className="flex gap-2 md:flex-col lg:flex-row" onSubmit={(e) => {
            e.preventDefault()
            mailingClick()
          }}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ваш email" className="bg-[#3D3D3D] border-[#4A4A4A] text-[#FFFFFF] placeholder-[#F5F5F5]"/>
              </HoverCardTrigger>
              <HoverCardContent className="w-50">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Введите свою почту</h4>
                    <p className="text-sm">
                      И нажмите на кнопку "Подписаться" чтоб подписаться на рассылку
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Button onClick={mailingClick} type="submit" className="bg-[#00F000] hover:bg-[#00C000] text-[#1A1A1A] cursor-pointer">
              Подписаться
            </Button>
          </form>
        </div>
        </div>
        <Separator className="bg-[#3D3D3D] data-[orientation=horizontal]:h-[2px]" />
      </div>
      
      <div className="pt-6 mt-8 text-center text-[#F5F5F5]">
        <p>© 2024 TicketFlow. Все права защищены</p>
      </div>
    </footer>
  )
}

export default FooterCompanent