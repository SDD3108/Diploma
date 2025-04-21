"use client"
import React from 'react'
import { useParams,useRouter } from "next/navigation";
import MyButton from '../../../companents/UI/button/MyButton';
// что тут происходит?
// 1. мы используем useParams чтобы получить id события из url
// 2. используем useRouter чтобы навигировать на страницу описания события
// 3. создаем функцию navigationToEventDescription которая принимает id события и переходит на страницу описания события
// 4. возвращаем разметку с заголовком события и кнопкой для перехода на страницу описания события
// 5. используем класс w-[64rem] lg:w-[64rem] max-sm:w-auto mx-auto для центрирования контента на странице
// 6. используем класс text-center для центрирования текста заголовка
// как я могу улучшить код?
// 1. можно вынести логику навигации в отдельный хук
// 2. можно использовать useMemo для оптимизации производительности
// 3. можно использовать useCallback для оптимизации производительности
// еще можно использовать useEffect для выполнения побочных эффектов
// 4. можно использовать useReducer для управления состоянием
// // 5. можно использовать useContext для управления состоянием
// // 6. можно использовать useRef для получения ссылки на элемент


const Event = ({params}) => {
  const router = useRouter()
  const navigationToEventDescription = (id)=>{
    router.push(`${params.id}/${id}`)
  }
  return (
    <div className='w-[64rem] lg:w-[64rem] max-sm:w-auto mx-auto flex flex-col justify-center'>
     <h2 className='text-center'>event {params.id}</h2>
     <MyButton className='w-[16rem] max-sm:w-1/3 mx-auto cursor-pointer' onClick={()=>{navigationToEventDescription(params.id+1)}} children='description'/>
    </div>
  )
}


export default Event