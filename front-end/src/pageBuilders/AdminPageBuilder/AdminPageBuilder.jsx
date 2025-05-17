'use client'
import React,{useEffect,useState} from 'react'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow } from "@/src/ui/table"
import { ScrollArea } from "@/src/ui/scroll-area"
import { Separator } from '@/src/ui/separator'
import { GetEvents } from '@/src/utils/GetEvents/GetEvents'

const AdminPageBuilder = () => {
    const events = GetEvents()
    const router = useRouter()
    const { tokenUser } = GetToken()
    console.log(tokenUser);
    console.log(tokenUser.isAdmin);

    const tags = Array.from({ length: 50 }).map(
        (_, i, a) => `v1.2.0-beta.${a.length - i}`
      )

    useEffect(()=>{
        if(!tokenUser || !tokenUser.isAdmin){
            toast('окак')
            toast('Ты не Админ')
            toast('это не для тебя')
            setTimeout(() => {
                // router.push('/')    
            }, 2000)
        }
    },[tokenUser])
  return (
    <div className='px-5'>
      <div className='flex gap-[2rem] my-6'>
        <div className='w-full'>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Genre</TableHead>
                        <TableHead className="text-right">age</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        <div className='w-1/3'>
            <ScrollArea className="h-72 w-48 rounded-md border">
                <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                    {tags.map((tag) => (
                        <>
                            <div key={tag} className="text-sm">{tag}</div>
                            <Separator className="my-2" />
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
