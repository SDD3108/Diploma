import React, { useEffect, useState } from 'react'
import { Input } from '@/src/ui/input'
import { Button } from '@/src/ui/button'
import { Avatar,AvatarFallback, AvatarImage } from '@/src/ui/avatar'
import { Skeleton } from '@/src/ui/skeleton'
import { Textarea } from "@/src/ui/textarea"
import {GetToken} from '@/src/utils/GetToken/GetToken'
import { GetInitials } from '@/src/utils/GetInitials/GetInitials'
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/src/ui/alert-dialog"
import axios from 'axios'
import { toast } from 'sonner'
const UserDatasPageBuilders = () => {
  const { tokenUser,loading } = GetToken()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ownDescription: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => {
    if(tokenUser){
      setFormData({
        name: tokenUser.name || '',
        email: tokenUser.email || '',
        ownDescription: tokenUser.ownDescription || '',
      })
    }
  }, [tokenUser])
  const inputChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }
  const saveUpdatedDatas = async ()=>{
    try {
      if(formData.name.trim().length < 2){
        toast.error('Имя должно содержать минимум 2 символа')
        return
      }
      setIsSaving(true)

      const response = await axios.put(`/api/users/${tokenUser?._id}`,formData,{
        headers: {
          Authorization: `Bearer ${tokenUser.token}`
        }
      })
      toast.success('Данные успешно обновлены!')
    }
    catch(error){
      toast.error(error.response?.data?.message || 'ошибка сохранения данных')
      console.error('ошибка сохранения:',error)
    }
    finally{
      setIsSaving(false)
    }
  }
  const test =()=>{
    console.log('working2')
  }
  return (
    <div>
      <div className='flex gap-[3rem] mb-[1rem] w-1/2 lg:w-1/2 sm:w-full max-sm:w-full'>
        <div>
          <Avatar className='w-[5rem] h-[5rem] rounded-xl bg-gray-300'>
            <AvatarImage src="" alt='@shadcn' />
            <AvatarFallback className='rounded-xl bg-gray-100'>{GetInitials(tokenUser.name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex gap-5 items-center'>
          <Button variant='line' className={`no-underline ${!tokenUser?.isAvatar ? 'cursor-pointer' : 'cursor-default'}`} disabled={!tokenUser?.isAvatar} onClick={test}>Убрать</Button>
          <Button variant='line' className={`no-underline ${tokenUser?.isAvatar ? 'cursor-default' : 'cursor-pointer'}`} disabled={tokenUser?.isAvatar} onClick={test}>Загрузить</Button>    
        </div>
      </div>
      <div className='w-1/2 lg:w-1/2 sm:w-full max-sm:w-full flex flex-col gap-1.5'>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>Имя</h2>
          <Input type='text' name="name" value={formData.name} onChange={inputChange} placeholder={tokenUser.name ? tokenUser.name : 'Имя'} className='h-[4rem] px-5'/>
        </div>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>Email</h2>
          <Input type='email' name="email" value={formData.email} onChange={inputChange} placeholder={tokenUser.email ? tokenUser.email : 'sadvakasov.rakhat@gmail.com'} className='h-[4rem] px-5'/>
        </div>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>Описание</h2>
          <Textarea name="ownDescription" value={formData.ownDescription} onChange={inputChange} placeholder={tokenUser.ownDescription ? tokenUser.ownDescription : 'Напишите о себе'} className='h-[9rem] p-5'/>
        </div>
      </div>
      <div className='w-1/2 lg:w-1/2 sm:w-full max-sm:w-full mt-[2rem]'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='w-full bg-[#e30a13] text-xl'>
              Сохранить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Подтвердите изменения</AlertDialogTitle>
              <AlertDialogDescription>Вы уверены что хотите сохранить изменения?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSaving}>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={saveUpdatedDatas} disabled={isSaving}>{isSaving ? 'Сохранение...' : 'Подтвердить'}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default UserDatasPageBuilders