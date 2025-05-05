import React from 'react'
import { Input } from '@/src/ui/input'
import { Button } from '@/src/ui/button'
import { Avatar,AvatarFallback, AvatarImage } from '@/src/ui/avatar'
import { Skeleton } from '@/src/ui/skeleton'
import { Textarea } from "@/src/ui/textarea"

const UserDatasPageBuilders = () => {
  return (
    <div>
      <div className='flex gap-[3rem]'>
        <div>
          <Avatar className='w-[5rem] h-[5rem] rounded-xl bg-gray-300'>
            <AvatarImage src="" alt='@shadcn' />
            <AvatarFallback className='rounded-xl bg-gray-100'>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex gap-5 items-center'>
          {/* логика если есть user?.avatar ? (Убрать && AvatarImage) : (Загрузить AvatarCallBack) */}
          <span className='text-gray-400 cursor-pointer'>Убрать</span>
          <span className='cursor-pointer'>Загрузить</span>
        </div>
      </div>
      <div className='w-1/2 flex flex-col gap-1.5'>
        <div className='w-full flex gap-5'>
          <div className='w-1/2 flex flex-col gap-1.5'>
            <h2>Имя</h2>
            <Input type='text' placeholder='Имя' className='h-[4rem] px-5'/>
          </div>
          <div className='w-1/2 flex flex-col gap-1.5'>
          <h2>Фамилия</h2>
            <Input type='text' placeholder='Фамилия' className='h-[4rem] px-5'/>
          </div>
        </div>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>Email</h2>
          <Input type='email' placeholder='sadvakasov.rakhat@gmail.com' className='h-[4rem] px-5'/>
        </div>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>Описание</h2>
          <Textarea placeholder='Напишите о себе' className='h-[9rem] p-5'/>
        </div>
      </div>
      <div className='w-1/2 mt-[2rem]'>
        <Button className='w-full bg-[#e30a13] text-xl'>
          Сохранить
        </Button>
      </div>
    </div>
  )
}

export default UserDatasPageBuilders