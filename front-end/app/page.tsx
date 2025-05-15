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
      <section className="px-5 ">
        <Card className="w-full h-[24rem] rounded-xl relative z-0"> 
          <CardContent className="w-full h-full flex flex-col gap-5 bg-cover bg-center bg-no-repeat">
            <div className="sticky z-2 w-full h-full flex flex-col justify-between">
              <div className="flex flex-col gap-5 w-1/2 sm:w-1/2 max-sm:w-full">
                <h1 className="text-3xl lg:text-2xl sm:text-lg max-sm:text-lg text-white font-bold whitespace-normal">{t('landing.hero.title')}</h1>
                <p className="text-white text-lg">{t('landing.hero.description')}</p>
              </div>
              <div className="flex md:flex-row max-sm:flex-col gap-5 mt-5 w-1/4 mt-5 sm:w-1/4 max-sm:w-full">
                <MyButton onClick={()=>router.push('/events')} className="bg-[#E50914] w-full text-white hover:bg-[#E50914] cursor-pointer">{t('landing.hero.buyTicket')}</MyButton>
                <MyButton onClick={()=>router.push('/events')} className="bg-[#E50914] w-full text-white hover:bg-[#E50914] cursor-pointer">{t('landing.hero.viewEvents')}</MyButton>
              </div>
            </div>
            <Image className="rounded-xl w-full z-1 h-full absolute top-0 left-0" src={MainImage} alt="not found" width={100} height={100}/>

          </CardContent>
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
