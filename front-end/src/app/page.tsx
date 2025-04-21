"use client"
import Image from "next/image";
import MyButton from "../companents/UI/button/MyButton";
import HeaderCompanent from '../companents/header/HeaderCompanent';
import FooterCompanent from '../companents/footer/FooterCompanent';
import { useRouter } from "next/navigation";
import { useState } from "react";
import EventsCompanent from '@/src/companents/events/EventsCompanent';
import { Accordion,AccordionContent,AccordionItem,AccordionTrigger,} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
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
    <div className="flex flex-col gap-20">
      <HeaderCompanent/>

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
      <section className="px-5 ">
        <Card className="w-full h-[24rem] rounded-xl relative z-0"> 
          <CardContent className="w-full h-full flex flex-col gap-5 bg-cover bg-center bg-no-repeat">
            <div className="sticky z-2 w-full h-full flex flex-col justify-between">
              <div className="flex flex-col gap-5 w-1/2">
                <h1 className="text-3xl text-white font-bold whitespace-normal  ">Бронирование мест в реальном времени</h1>
                <p className="text-white text-lg">Быстрое и удобное бронирование мест на мероприятиях с мгновенным подтверждением.</p>
              </div>
              <div className="flex gap-5 mt-5 w-1/4 mt-5">
                <MyButton onClick={()=>router.push('/events')} className="bg-[#E50914] w-full text-white hover:bg-[#E50914]">Купить билет</MyButton>
                <MyButton onClick={()=>router.push('/events')} className="bg-[#E50914] w-full text-white hover:bg-[#E50914]">Посмотреть события</MyButton>
              </div>
            </div>
            <Image className="rounded-xl w-full z-1 h-full absolute top-0 left-0" src='https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru' alt="not found" width={100} height={100}/>
          </CardContent>
        </Card>
      </section>
      <section className="">
        <EventsCompanent/>
      </section>
      <section className="px-5">
        <div className="w-full flex gap-20 lg:gap-20 md:gap-15 sm:gap-10 max-sm:gap-">
          <div className="w-1/2 flex flex-col gap-4">
          <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">Как работает система бронирования в реальном времени?</AccordionTrigger>
              <AccordionContent className="text-white">
              Используя WebSocket и Redis, мы синхронизируем статусы мест для всех пользователей мгновенно. 
              Ваш выбор блокируется на 15 минут, чтобы дать время на оплату.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">Что происходит, если место уже занято?</AccordionTrigger>
              <AccordionContent className="text-white">
                Вы автоматически попадаете в очередь. Как только место освободится, мы отправим вам 
                уведомление и предоставим приоритетный доступ на 10 минут.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">Насколько безопасны мои данные?</AccordionTrigger>
              <AccordionContent className="text-white">
                Все транзакции защищены 256-битным шифрованием. Мы не храним данные вашей карты - 
                оплата обрабатывается через PCI DSS сертифицированные системы.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
          <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">Какие технологии используются в проекте?</AccordionTrigger>
              <AccordionContent className="text-white">
                В основе: Next.js для фронтенда, Node.js + Socket.io для бэкенда, Redis для управления 
                очередями и таймерами. Для UI - собственная сборка на shadcn/ui.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">Какие уведомления я буду получать?</AccordionTrigger>
              <AccordionContent className="text-white">
                • Подтверждение бронирования<br/>
                • Напоминание об оплате<br/>
                • Продвижение в очереди<br/>
                • Информацию о начале мероприятия
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="bg-[#141414] rounded-xl px-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white cursor-pointer">Можно ли отменить бронирование?</AccordionTrigger>
              <AccordionContent className="text-white">
                Да! Отмена доступна в личном кабинете за 24 часа до мероприятия. 
                При отмене место автоматически предлагается следующему в очереди.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </div>
        </div>
      </section>
      <FooterCompanent/>
    </div>
  );
}
