"use client"

import React,{ useState, useEffect } from 'react'
import { Dialog,DialogTrigger,DialogContent,DialogOverlay,DialogPortal,DialogHeader,DialogClose } from "@/src/ui/dialog";
import { Captcha } from '../../utils/Captcha/Captcha'
import { getData } from '@/src/utils/DataTransfer/DataTransfer'

export const CaptchaModal = () => {
    const isVerifiedModal = getData()
    const [open, setOpen] = useState(false)
    // const [isVerified, setIsVerified] = useState(false)
    // console.log('isVerifiedModal',isVerifiedModal);
    
    useEffect(()=>{
        const passed = localStorage.getItem('captchaPassed') == 'true'
        // console.log(!passed);
        setOpen(!passed)
    }, [])
    const handleSuccess = ()=>{
        localStorage.setItem("captchaPassed", "true");
        setOpen(false);
    }
  return (
    // <div>
    //     {/* <Dialog open={isVerifiedModal} onOpenChange={setOpen}> */}
    //     <Dialog open={open} onOpenChange={setOpen}>
    //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    //             <DialogContent className="bg-background p-6 max-w-md w-full" hideClose>
    //                 <Captcha success={checkSuccess} />
    //             </DialogContent>
    //         </div>
    //     </Dialog>
    // </div>
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