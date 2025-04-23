import React from 'react'

const ErrorCompanent = ({error}) => {
  return (
    <section className='w-full h-[32rem]'>
      <div className='text-6xl text-center font-semibold mt-[16rem]'>Ошибка {error}</div>
    </section>
  )
}

export default ErrorCompanent