"use client"

import React,{ useState, useEffect } from 'react'
import { Dialog,DialogTrigger,DialogContent  } from "@/src/ui/dialog"
import { Captcha } from '../../utils/Captcha/Captcha'
import { getData } from '@/src/utils/DataTransfer/DataTransfer'

export const CaptchaModal = () => {
    const isVerifiedModal = getData()
    const [open, setOpen] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    console.log('isVerifiedModal',isVerifiedModal);
    
    useEffect(()=>{
        const captchaPassed = localStorage.getItem('captchaPassed') === 'true'
        setOpen(!captchaPassed)
    }, [])
    useEffect(()=>{
        if(isVerified){
            setOpen(false)            
        }
    },[isVerified])
    const checkSuccess = ()=>{
        localStorage.setItem('captchaPassed','true')
        setIsVerified(true)
    }

  return (
    <div>
        {/* <Dialog open={isVerifiedModal} onOpenChange={setOpen}> */}
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <DialogContent className="bg-background p-6 max-w-md w-full" hideClose>
                    <Captcha success={checkSuccess} />
                </DialogContent>
                {/* <div className="bg-background rounded-lg p-6 max-w-md w-full">
                    
                </div> */}
            </div>
        </Dialog>
    </div>
  )
}

// export default CaptchaModal