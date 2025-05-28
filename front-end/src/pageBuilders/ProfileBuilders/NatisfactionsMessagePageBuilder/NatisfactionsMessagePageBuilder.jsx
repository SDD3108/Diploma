"use client"
import React from 'react';
import { getData } from '@/src/utils/DataTransfer/DataTransfer'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const NatisfactionsMessagePageBuilder = () => {  
  const { t } = useTranslation('common')
  const message = getData()
  return (
    <div className='space-y-[2rem] md:mb-0 sm:mb-[2rem] max-sm:mb-[2rem]'>
      <div className='text-3xl text-[#101828] leading-[129%] font-semibold dark:text-white'>
        {t('notifications.heading')}
      </div>
      <div className='w-full flex flex-col shadow-lg min-h-[24rem] rounded-md'>
        <div className='flex flex-col justify-between p-4 min-h-[24rem] relative'>
          <div className='flex flex-col gap-1.5'>
            <div className=''>
              <h3 className='font-medium text-[#101828] text-[1.125rem] leading-[150%] dark:text-white'>{message.title}</h3>
            </div>
            <div className='text-[#344054] text-[1.125rem] leading-[150%] font-normal dark:text-white/60'>
              <p>{message.description}</p>
            </div>
          </div>  
          <div className='text-[#667085] text-[0.875rem] leading-[150%] font-normal text-end'>
            <p>{message.date}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NatisfactionsMessagePageBuilder