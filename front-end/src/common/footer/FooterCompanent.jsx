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
import '../../../i18n'
import { useTranslation } from 'react-i18next'
const FooterCompanent = () => {
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const mailingClick = async ()=>{
    if (email.trim().length < 8) {
      toast(t('toast.invalidEmail'))
      return
    }
    try {
      const backendApi = process.env.NEXT_PUBLIC_SOCKET_URL
      const response = await axios.post(`${backendApi}/send-email`, {
        from:'mrbimson1@gmail.com',
        to: email,
        subject: 'Добро пожаловать!',
        text: 'Вы успешно авторизованы на платформе.',
        html: `<p>Здравствуйте!</p><p>Вы успешно авторизованы на платформе.</p>`
      });
      toast(t('toast.emailSent'));
    }
    catch(err){
      // console.error(err);
      toast(t('toast.sendEmailError'));
    }
  }
  return (
    <footer className='bg-[#141414] h-[24rem] px-5 py-10 text-[#FFFFFF] sm:h-[52rem] md:h-[24rem] max-sm:h-[52rem]'>
      <div>
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-100">{t('brand.name')}</h2>
          <p className="text-[#F5F5F5]">
            {t('footer.slogan')}
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="text-[#F5F5F5] hover:bg-[#3D3D3D] hover:text-slate-100">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#F5F5F5] hover:bg-[#3D3D3D] hover:text-slate-100">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#F5F5F5] hover:bg-[#3D3D3D] hover:text-slate-100">
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFFFFF]">{t('footer.nav.heading')}</h3>
          <nav className="space-y-2">
            <Button variant="link" className="text-[#F5F5F5] hover:text-slate-100 p-0 cursor-pointer">
              <Link href='/'>{t('footer.main.page')}</Link>
            </Button>
            <Button variant="link" className="text-[#F5F5F5] hover:text-slate-100 p-0 block cursor-pointer">
              <Link href='/events'>{t('nav.events')}</Link>
            </Button>
            <Button variant="link" className="text-[#F5F5F5] hover:text-slate-100 p-0 block cursor-pointer">
              <Link href='/profile'>{t('nav.profile')}</Link>
            </Button>
            <Button variant="link" className="text-[#F5F5F5] hover:text-slate-100 p-0 block cursor-pointer">
              <Link href='/natisfaction'>{t('nav.natisfactions')}</Link>
            </Button>
          </nav>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFFFFF]">{t('footer.contacts.heading')}</h3>
          <div className="space-y-2 text-[#F5F5F5]">
            <div className="flex items-center gap-2 cursor-pointer">
              <Phone className="h-5 w-5 text-slate-100" />
              <span>{t('footer.contacts.phone')}</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <Mail className="h-5 w-5 text-slate-100" />
              <span>{t('footer.contacts.email')}</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <MapPin className="h-5 w-5 text-slate-100" />
              <span>{t('footer.contacts.address')}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#FFFFFF]">{t('footer.newsletter.heading')}</h3>
          <form className="flex gap-2 md:flex-col lg:flex-row" onSubmit={(e) => {
            e.preventDefault()
            mailingClick()
          }}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('footer.newsletter.placeholder')} className="bg-[#3D3D3D] border-[#4A4A4A] text-[#FFFFFF] placeholder-[#F5F5F5]"/>
              </HoverCardTrigger>
              <HoverCardContent className="w-50">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{t('footer.newsletter.tooltip.title')}</h4>
                    <p className="text-sm">
                      {t('footer.newsletter.tooltip.text')}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Button onClick={mailingClick} type="submit" className="bg-[#00F000] hover:bg-[#00C000] text-[#1A1A1A] cursor-pointer">
              {t('footer.newsletter.subscribe')}
            </Button>
          </form>
        </div>
        </div>
        <Separator className="bg-[#3D3D3D] data-[orientation=horizontal]:h-[2px]" />
      </div>
      
      <div className="pt-6 mt-8 text-center text-[#F5F5F5]">
        <p>{t('footer.copy')}</p>
      </div>
    </footer>
  )
}

export default FooterCompanent