"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import EventCompanent from '../../companents/event/Event';
import HeaderCompanent from '@/src/companents/header/HeaderCompanent';
import FooterCompanent from '@/src/companents/footer/FooterCompanent';
import axios from 'axios';

const Events = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()  
    useEffect(()=>{
        const getEvents = async ()=>{
            try{
                const resp = await axios.get('/api/events');
                setEvents(resp.data)
                console.log(resp.data);
                
            }
            catch(err){
                setError(err.response?.data?.message || err.message || 'Unknown error')
            }
            finally{
                setLoading(false)
            }
        }
        getEvents()
        console.log(events);
    },[])

    const array = [
        {
            id:1,
            name:'event 1',
            desc:'event desc 1',
            image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
        },
        {
            id:2,
            name:'event 2',
            desc:'event desc 2',
            image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
        },
        {
            id:3,
            name:'event 3',
            desc:'event desc 3',
            image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
        },
        {
            id:4,
            name:'event 4',
            desc:'event desc 4',
            image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
        },
        {
            id:5,
            name:'event 5',
            desc:'event desc 5',
            image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
        },
    ]
    const navigationToEvent = (id)=>{
        router.push(`events/${id}`)
    }
    const obj = {
        id:1,
        type:'movie',
        rating:'9.1',
        isRating:true,
        age:16,
        genre:'action',
        image:'',
        title:'Фнаф 2',
        description:'На этот раз вселенная «Патруля» оказывается в области Абай',
        isDetails:true,
        details:{
            engTitle:'Fnaf 2',
            duration:'110',
            releaseDate:'31.08.2007',
            production:'Казахстан',
            director:'режиссер',
        },
        isRoles:true,
        roles:[
            'Рамазан Амантай',
            'Жақсылық Айтқұрман',
            'Жасұлан Айтенов',
            'Шарифбек Закиров',
            'Әльмахан Шахмардан',
            'Бақытгүл Серікбаева',
        ],
        reviews:[],
        isLocation:true,
        location:'Бар "skvôt."',
    }
    if(loading){
        return (
            <>
                <HeaderCompanent/>
                <section className='w-full h-[32rem]'>
                    <div className='text-6xl text-center font-semibold mt-[16rem]'>Загрузка...</div>
                </section>
                <FooterCompanent/>
            </>
            
        )
    }
    else if(error){
        return (
            <>
                <HeaderCompanent/>
                <section className='w-full h-[32rem]'>
                    <div className='text-6xl text-center font-semibold mt-[16rem]'>Ошибка {error}</div>
                </section>
                <FooterCompanent/>
            </>
            
        )
    }
    else if(!loading && !error && events.length == 0){
        return (
            <>
                <HeaderCompanent/>  
                <section className='w-full h-[32rem]'>
                    <div className='text-6xl text-center font-semibold mt-[16rem]'>
                        Событий не найдено
                    </div>
                </section>
                <FooterCompanent/>
            </>
            
        )
    }
  return (
    <div>
        <HeaderCompanent/>
        <section className='px-5'>
            <div className='w-full flex flex-col'>
                <div>
                    <h2 className='text-3xl font-bold text-[#151515]'>События</h2>
                </div>
                <div className='mt-4 flex items-center gap-4 overflow-x-scroll whitespace-nowrap'>
                    {events.map((event,index)=>(
                        <div onClick={()=>navigationToEvent(event.id)}>
                            <EventCompanent object={event} key={index} style=''/>
                        </div>
                    ))}
                </div>    
            </div>        
        </section>
        <FooterCompanent/>
    </div>
  )
}

export default Events