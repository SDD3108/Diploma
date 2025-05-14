"use client"
import React from 'react'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/src/ui/navigation-menu"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/src/ui/sheet'
import { Button } from '@/src/ui/button'
import { Menu,X,Tickets } from 'lucide-react'
import { useRouter } from "next/navigation";
import { Separator } from "@/src/ui/separator";
import Link from 'next/link'
import '@/i18n'
import { useTranslation } from 'react-i18next'
const HeaderCompanent = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  return (
    <header className='h-[8rem] bg-[#1A1A1A] text-[#FFFFFF] shadow-md px-5 flex items-center'>
      <div className='flex flex-col items-center w-full'>
        <div className="flex justify-between flex-row md:gap-0 sm:gap-2 max-sm:gap-2 md:flex-row sm:flex-col max-sm:flex-col w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={()=>router.push('/')}>
            <Tickets className="h-8 w-8 text-[#00F000]" />
            <span className="text-xl font-bold text-[#FFFFFF]">{t('brand.name')}</span>
          </div>
          <div className='flex gap-2 md:justify-normal sm:justify-end max-sm:justify-end'>
            <Link href="/login">
              <Button variant="outline" className="text-[#00F000] border-[#00F000] bg-[#1A1A1A] hover:bg-[#00F000]/10 hover:text-slate-100 cursor-pointer">
                {t('auth.login')}
              </Button>
            </Link>
            <Link href="/registration">
              <Button className="bg-[#00F000] hover:bg-[#00C000] text-[#ffffff] cursor-pointer">
                {t('auth.signup')}
              </Button>
            </Link>
            
          </div>
        </div>
        <Separator className='my-3 bg-[#3D3D3D]'/>
        <div className='w-full'>
          <NavigationMenu className="hidden sm:block">
            <NavigationMenuList className='gap-3'>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="px-4 py-2 text-[#F5F5F5] hover:text-slate-100 hover:bg-white/10 transition-colors">
                  {t('nav.home')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/events" className="px-4 py-2 text-[#F5F5F5] hover:text-slate-100 hover:bg-white/10 transition-colors">
                  {t('nav.events')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/natisfaction" className="px-4 py-2 text-[#F5F5F5] hover:text-slate-100 hover:bg-white/10 transition-colors">
                  {t('nav.natisfactions')}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/profile" className="px-4 py-2 text-[#F5F5F5] hover:text-slate-100 hover:bg-white/10 transition-colors">
                  {t('nav.profile')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-[#3D3D3D] bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#3D3D3D]">
                  <Menu className="h-5 w-5 text-[#ffffff]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[19rem] bg-[#1A1A1A] border-r-[#3D3D3D] [&>button]:hidden">
                <SheetHeader>
                  <SheetTitle className="text-[#FFFFFF]">{t('menu.title')}</SheetTitle>
                  <X className="absolute right-4 top-4 h-6 w-6 cursor-pointer text-slate-100" onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))}/>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button variant="ghost" className="w-full justify-start text-[#F5F5F5] hover:text-slate-100 hover:bg-[#3D3D3D]">
                    <Link href='/'>{t('nav.home')}</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-[#F5F5F5] hover:text-slate-100 hover:bg-[#3D3D3D]">
                    <Link href='/events'>{t('nav.events')}</Link>
                    
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-[#F5F5F5] hover:text-slate-100 hover:bg-[#3D3D3D]">
                    <Link href='/natisfaction'>{t('nav.natisfactions')}</Link>
                    
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-[#F5F5F5] hover:text-slate-100 hover:bg-[#3D3D3D]">
                    <Link href='/profile'>{t('nav.profile')}</Link>
                    
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderCompanent