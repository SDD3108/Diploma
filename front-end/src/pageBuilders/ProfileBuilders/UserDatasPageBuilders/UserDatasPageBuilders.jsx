"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '@/src/ui/input'
import { Button } from '@/src/ui/button'
import { Avatar,AvatarFallback, AvatarImage } from '@/src/ui/avatar'
import { Skeleton } from '@/src/ui/skeleton'
import { Textarea } from "@/src/ui/textarea"
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { GetInitials } from '@/src/utils/GetInitials/GetInitials'
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/src/ui/alert-dialog"
import axios from 'axios'
import { toast } from 'sonner'
import '@/i18n'
import { useTranslation } from 'react-i18next'


const UserDatasPageBuilders = () => {
  const { t } = useTranslation('common')
  const { tokenUser,loading } = GetToken()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ownDescription: '',
    avatar:'',
    isAvatar:false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const backendAddress = process.env.NEXT_PUBLIC_SOCKET_URL
  useEffect(() => {
    if(tokenUser){
      setFormData({
        name: tokenUser.name || '',
        email: tokenUser.email || '',
        ownDescription: tokenUser.ownDescription || '',
        avatar: tokenUser.avatar || '',
        isAvatar: tokenUser.isAvatar || false
      })
    }
  },[tokenUser])
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
      // console.error('ошибка сохранения:',error)
    }
    finally{
      setIsSaving(false)
    }
  }
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if(!file){
      return
    }

    try {
      if(!file.type.startsWith('image/')){
        toast(t('toast.selectImage'))
        return;
      }
      if(file.size > 2 * 1024 * 1024){
        toast(t("toast.maxFileSize"))
        return
      }

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await axios.post(`/api/users/${tokenUser._id}/avatar`,formData);

      setFormData(prev => ({
        ...prev,
        avatar: response.data.avatarUrl
      }))
      
      toast(t('toast.avatarUpdated'))
    }
    catch(error){
      toast(t('toast.avatarUploadError'))
      // console.error('Upload error:', error);
    }
  }
  const handleRemoveAvatar = async () => {
    try {
      await axios.delete(`/api/users/${tokenUser._id}/avatar`, {
        headers: {
          Authorization: `Bearer ${tokenUser.token}`
        }
      });

      // Обновляем данные пользователя
      setFormData(prev => ({
        ...prev,
        avatar: ''
      }));
      
      toast(t('toast.avatarDeleted'))
    }
    catch(error){
      toast(t('toast.avatarDeleteError'))
      // console.error('Delete error:', error);
    }
  }
  // console.log(`http://localhost:3002${formData.avatar}`);
  
  return (
    // md:px-0 sm:px-5 max-sm:px-5 md:my-0 sm:my-[2rem] max-sm:my-[2rem]
    <div className='px-5 my-[2rem]'>
      <div className='flex gap-[3rem] mb-[1rem] w-1/2 lg:w-1/2 sm:w-full max-sm:w-full'>
        <div>
          <Avatar className='w-[5rem] h-[5rem] rounded-xl bg-gray-300'>
            {formData.isAvatar ? (
              <AvatarImage src={`${backendAddress}${formData?.avatar}`} alt={t('profile.edit.avatar.alt')} />
            ) : (
              <AvatarFallback className='rounded-xl bg-gray-100'>
                {GetInitials(tokenUser?.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className='flex gap-5 items-center'>
          {/* <Button variant='line' className={`no-underline ${!tokenUser?.isAvatar ? 'cursor-pointer' : 'cursor-default'}`} disabled={!tokenUser?.isAvatar} onClick={test}>Убрать</Button>
          <Button variant='line' className={`no-underline ${tokenUser?.isAvatar ? 'cursor-default' : 'cursor-pointer'}`} disabled={tokenUser?.isAvatar} onClick={test}>Загрузить</Button> */}
          <Input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleFileUpload}/>
          <Button variant='line' className={`no-underline ${tokenUser?.isAvatar ? 'cursor-default' : 'cursor-pointer'}`} disabled={tokenUser?.isAvatar} onClick={() => document.getElementById('avatar-upload').click()}>{t('profile.edit.avatar.upload')}</Button>
          <Button variant='line' className={`no-underline ${tokenUser?.isAvatar ? 'cursor-pointer' : 'cursor-default'}`} disabled={!tokenUser?.isAvatar} onClick={handleRemoveAvatar}>{t('profile.edit.avatar.remove')}</Button>
        </div>
      </div>
      <div className='w-1/2 lg:w-1/2 sm:w-full max-sm:w-full flex flex-col gap-1.5'>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>{t('profile.edit.field.name.label')}</h2>
          <Input type='text' name="name" value={formData.name} onChange={inputChange} placeholder={tokenUser.name ? tokenUser.name : t('profile.edit.field.name.label')} className='h-[4rem] px-5'/>
        </div>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>Email</h2>
          <Input type='email' name="email" value={formData.email} onChange={inputChange} placeholder={tokenUser.email ? tokenUser.email : 'sadvakasov.rakhat@gmail.com'} className='h-[4rem] px-5'/>
        </div>
        <div className='w-full flex flex-col gap-1.5'>
          <h2>{t('profile.edit.field.description.label')}</h2>
          <Textarea name="ownDescription" value={formData.ownDescription} onChange={inputChange} placeholder={tokenUser.ownDescription ? tokenUser.ownDescription : t('profile.edit.field.description.placeholder')} className='h-[9rem] p-5'/>
        </div>
      </div>
      <div className='w-1/2 lg:w-1/2 sm:w-full max-sm:w-full mt-[2rem]'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='w-full bg-[#e30a13] text-xl'>{t('profile.edit.save.button')}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('profile.edit.dialog.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('profile.edit.dialog.description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSaving}>{t('profile.edit.dialog.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={saveUpdatedDatas} disabled={isSaving}>{isSaving ? t('profile.edit.dialog.saving') : t('profile.edit.dialog.confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default UserDatasPageBuilders