'use client'
import React,{useEffect,useState} from 'react'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow } from "@/src/ui/table"
import { ScrollArea } from "@/src/ui/scroll-area"
import { Separator } from '@/src/ui/separator'
import { GetEvents } from '@/src/utils/GetEvents/GetEvents'
import { GetUsers } from '@/src/utils/GetUsers/GetUsers'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const AdminPageBuilder = () => {
    const router = useRouter()
    const { tokenUser } = GetToken()
    const [events,setEvents] = useState([])
    const [users,setUsers] = useState([])
    const { t } = useTranslation('common')

    useEffect(()=>{
        const getEventsData = async()=>{
            const events = await GetEvents()
            setEvents(events)
        }
        const getUsersData = async()=>{
            const users = await GetUsers()
            setUsers(users)
        }
        getEventsData()
        getUsersData()
    },[])

    const tags = Array.from({ length: 50 }).map(
        (_, i, a) => `v1.2.0-beta.${a.length - i}`
      )

    useEffect(()=>{
        if(!tokenUser || !tokenUser.isAdmin){
            toast(t('toast.okak'))
            toast(t('toast.notAdmin'))
            toast(t('toast.notForYou'))
            setTimeout(() => {
                router.push('/login')    
            }, 2000)
        }
    },[tokenUser])
  return (
    <div className='px-5'>
      <div className='flex gap-[2rem] my-6'>
        <div className='w-full'>
            <Table className=''>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead className="text-right">age</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className=''>
                    {events.map((event,index)=>(
                        <TableRow key={index}>
                            <TableCell className="font-medium">{event?._id}</TableCell>
                            <TableCell>{event?.title}</TableCell>
                            <TableCell>{event?.type}</TableCell>
                            <TableCell>{event?.genre}</TableCell>
                            <TableCell className="text-right">{event?.age}+</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div className='w-1/3'>
            <ScrollArea className="h-[32rem] rounded-md border">
                <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                    {users.map((user,index)=>(
                        <>
                            <div key={index} className=''>
                                <div className='flex justify-between'>
                                    <span className="text-sm text-nowrap">{user.name}</span>
                                    {/* <div className='border-b-[1px] w-full mx-1 mb-1'></div> */}
                                    <span className='text-xs text-nowrap'>{user.email}</span>
                                    
                                </div>
                                <Separator className="my-2" />
                                
                                
                            </div>
                        </>
                    ))}
                </div>
            </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default AdminPageBuilder
