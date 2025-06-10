export const dynamic = 'force-dynamic'
import React from 'react'
import UserTicketsPageBuilder from "@/src/pageBuilders/ProfileBuilders/UserTicketsPageBuilder/UserTicketsPageBuilder"

const UserTickets = () => {
  return (
    <div>
      <UserTicketsPageBuilder/>
    </div>
  )
}

export default UserTickets