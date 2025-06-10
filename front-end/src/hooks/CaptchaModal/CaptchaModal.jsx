"use client"

import React,{ useState, useEffect } from 'react'
import { Dialog,DialogTrigger,DialogContent,DialogOverlay,DialogPortal,DialogHeader,DialogClose } from "@/src/ui/dialog";
import { Captcha } from '../../utils/Captcha/Captcha'
import { getData } from '@/src/utils/DataTransfer/DataTransfer'
import useAuthStore from '@/src/store/AuthStore/authStore';

export const CaptchaModal = () => {
    const isVerifiedModal = getData()
    const {setCaptchaPassed,captchaPassed} = useAuthStore()
    const [open, setOpen] = useState(false)
    useEffect(()=>{
      // const passed = localStorage.getItem('captchaPassed') == 'true' || 'false'
      // const { captchaPassed } = useAuthStore()
      setOpen(!captchaPassed)
    },[captchaPassed])
    const handleSuccess = ()=>{
      setCaptchaPassed(true)
      setOpen(false)
    }
  return (
    <Dialog open={open} onOpenChange={setOpen} className="p-0 rounded-none ">
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-40"/>
        <DialogContent className="fixed left-50% z-50 p-0 w-full border-0 rounded-md">
            <DialogClose className="hidden"/>
            <div className="bg-background p-0 w-full shadow-lg">
                <Captcha success={handleSuccess} />
            </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

// export default CaptchaModal