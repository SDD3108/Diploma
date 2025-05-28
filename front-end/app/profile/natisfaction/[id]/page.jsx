// Принудительно запускаем эту страницу как SSR, а не статик-генерацию
export const dynamic = 'force-dynamic' 

import React from 'react'
import NatisfactionsMessagePageBuilder from '@/src/pageBuilders/ProfileBuilders/NatisfactionsMessagePageBuilder/NatisfactionsMessagePageBuilder'
const ProfileNatisfactionMessage = () => {
  return (
    <div>
      <NatisfactionsMessagePageBuilder/>
    </div>
  )
}

export default ProfileNatisfactionMessage