"use client"
import Image from "next/image";
import MyButton from "@/src/components/UI/button/MyButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import EventsPage from "@/app/pages/EventsPage/page"
import EventsPage from '@/app/(pages)/EventsPage/page';
import EventsPageBuilder from "@/src/pageBuilders/EventsPageBuilders/EventsPageBuilder/EventsCompanent";
import { Accordion,AccordionContent,AccordionItem,AccordionTrigger,} from "@/src/ui/accordion"
import { Card, CardContent } from "@/src/ui/card"
import MainImage from '@/images/mainPage/main.png'
import SearchPage from '@/app/(pages)/SearchPage/page'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import { Ticket } from 'lucide-react';
import { GetEvents } from "@/src/utils/GetEvents/GetEvents";


export default function Home() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [array,setArray] = useState([
    {
      id:1,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:2,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:3,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:4,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:5,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:6,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
  ])
  // const getFirstSectionImages = async()=>{
  //   const events = await GetEvents()
  //   const images = events.map(event => event.image)
  //   console.log();
  //   // setArray()
  // }
  // cot testUrl = 'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru'
  return (  
    <div className="flex flex-col gap-20 my-20">
      <section className="px-5">
        <div className="w-full flex flex-col gap-[1.5rem]">
          <div className="overflow-hidden">
            <div className="flex w-[200%] gap-[1rem] animate-scrollRight">
              {array.map((card,index)=>(
                <div key={index} className="w-full h-[12rem] rounded-[1rem]">
                  <Image src={card.image} alt="not found" width={382} height={0} className="w-full h-full rounded-[1rem]"/>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex w-[200%] gap-[1rem] animate-scrollLeft">
              {array.map((card,index)=>(
                <div key={index} className="w-full h-[12rem] rounded-[1rem]">
                  <Image src={card.image} alt="not found" width={382} height={0} className="w-full h-full rounded-[1rem]"/>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex w-[200%] gap-[1rem] animate-scrollRight">
              {array.map((card,index)=>(
                <div key={index} className="w-full h-[12rem] rounded-[1rem]">
                  <Image src={card.image} alt="not found" width={382} height={0} className="w-full h-full rounded-[1rem]"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="">
        <SearchPage/>
      </section>
      <section className="px-5 relative">
        <div className="absolute inset-0 bg-black/30 z-10 rounded-xl mx-5" ></div>
        <Card className="w-full min-h-[24rem] rounded-xl relative overflow-hidden bg-gradient-to-br from-[#2a0b0e] to-[#0a0a2a]">
          <CardContent className="w-full h-full flex flex-col justify-between relative z-20 max-sm:px-3 sm:px-6">
            <div className="flex flex-col gap-6 sticky z-50">
              <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl leading-tight drop-shadow-xl">{t('landing.hero.title')}</h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">{t('landing.hero.description')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
              <MyButton onClick={() => router.push('/events')} className="bg-[#E50914] hover:bg-[#ff1a27] text-white py-6 px-4 text-lg rounded-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                {t('landing.hero.buyTicket')}
              </MyButton>
              <MyButton onClick={() => router.push('/events')} className="bg-transparent border-2 border-white hover:bg-white/10 text-white py-6 px-4 text-lg rounded-lg transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                {t('landing.hero.viewEvents')}
              </MyButton>
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none">
              <Ticket className="absolute md:block max-sm:hidden z-1 right-10 bottom-10 w-48 h-48 text-[#E50914]/10 rotate-12 text-neutral-400" strokeWidth={1}/>
              <div className="absolute inset-0 opacity-5 "style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.05a2.5 2.5 0 0 0 0 4.9V16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.05a2.5 2.5 0 0 0 0-4.9V8Z' stroke='%23E50914' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '120px'
              }}/>
            </div>
          </CardContent>

          <div className="absolute inset-0 z-0">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#E50914] rounded-full blur-[100px] opacity-20" />
          
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#0a0a2a] rounded-full blur-[100px] opacity-30" />
      </div>
      </Card>
      </section>
      <section className="">
        <EventsPageBuilder/>
      </section>
      <section className="px-5">
        <div className="w-full flex sm:flex-row max-sm:flex-col gap-20 lg:gap-20 md:gap-15 sm:gap-10 max-sm:gap-5">
          <div className="w-1/2 sm:w-1/2 max-sm:w-full flex flex-col gap-4">
            <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">{t('faq.q1')}</AccordionTrigger>
              <AccordionContent className="text-white">{t('faq.a1')}</AccordionContent>
            </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">{t('faq.q2')}</AccordionTrigger>
              <AccordionContent className="text-white">{t('faq.a2')}</AccordionContent>
            </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">{t('faq.q3')}</AccordionTrigger>
              <AccordionContent className="text-white">{t('faq.a3')}</AccordionContent>
            </AccordionItem>
            </Accordion>
          </div>
          <div className="w-1/2 sm:w-1/2 max-sm:w-full flex flex-col gap-4">
            <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">{t('faq.q4')}</AccordionTrigger>
              <AccordionContent className="text-white">{t('faq.a4')}</AccordionContent>
            </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">{t('faq.q5')}</AccordionTrigger>
              <AccordionContent className="text-white">{t('faq.a5')}</AccordionContent>
            </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">{t('faq.q6')}</AccordionTrigger>
              <AccordionContent className="text-white">{t('faq.a6')}</AccordionContent>
            </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
