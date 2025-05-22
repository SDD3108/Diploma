'use client'
import React, { useEffect, useState } from 'react'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/table"
import { ScrollArea } from "@/src/ui/scroll-area"
import { Separator } from '@/src/ui/separator'
import { GetEvents } from '../../../src/utils/GetEvents/GetEvents'
import { GetUsers } from '../../../src/utils/GetUsers/GetUsers'
import { GetCinemas } from '../../../src/utils/GetCinemas/GetCinemas'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import { Button } from '@/src/ui/button'
import { Trash2, PlusCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/ui/dialog'
import { Input } from '@/src/ui/input'
import { Label } from '@/src/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/ui/select'
import axios from 'axios'
import { Checkbox } from '@/src/ui/checkbox'

const AdminPageBuilder = () => {
    const router = useRouter()
    const { tokenUser } = GetToken()
    const [events, setEvents] = useState([])
    const [users, setUsers] = useState([])
    const [cinemas, setCinemas] = useState([])
    const { t } = useTranslation('common')

    const [newEvent, setNewEvent] = useState({
        title: '',
        type: '',
        genre: 'action',
        age: 12,
        image: '',
        description: '',
        rating: 5,
        sessions: [],
        details: {},
        isDetails: false,
        isRoles: false,
        isReviews: false,
        isLocation: false
    })
    const [newCinema, setNewCinema] = useState({
        cinemaName: '',
        cinemaAddress: '',
        cinemaRate: 5,
    })
    const requiredEventFields = ['title', 'type', 'genre', 'age', 'image', 'description', 'rating']
    const eventTypes = ['movie', 'theater', 'concert', 'sport', 'vacation', 'festival', 'exhibition', 'workshop']
    const cinemasName = [
        'Chaplin MEGA Silk Way',
        'Arman Asia Park',
        'Kinopark 6 Keruencity',
        'Dostar Cinema',
        'Aru Cinema',
        'Arsenal',
        'Chaplin Khan Shatyr',
        'Kinopark 8 IMAX Saryarka',
        'Kinopark 7 IMAX Keruen',
        'Keruen Cinema (Talan Gallery)',
        'Eurasia Cinema7'
    ]
    const eventGenre = ['anime', 'biographical', 'action', 'war', 'detective', 'childrens', 'documentary', 'drama','historical','comedy',
        'concert','short','crime','melodrama','mysticism','cartoon','musical','scientific','noir','adventure','reality show',
        'family','sports','talk show','thriller','horror','sci-fi','fantasy',
    ]
    const validateFields = (fields,requiredFields)=>{
        for(const field of requiredFields){
            if(!fields[field] || fields[field].toString().trim() == ''){
                toast.error(t('admin.requiredField',{field: t(`admin.${field}`)}))
                return false
            }
        }
        return true
    }
    useEffect(()=>{
        const getDatas = async()=>{
            setEvents(await GetEvents())
            setUsers(await GetUsers())
            setCinemas(await GetCinemas())
        }
        getDatas()
    },[])
    const createEvent = async()=>{
        if(!validateFields(newEvent, requiredEventFields)){
            return
        }
        const resp = await axios.post('/api/events',newEvent)
        const createdEvent = resp.data
        setEvents([...events, createdEvent])
        toast(t('admin.eventCreated'))
        setNewEvent({
            title: '',
            type: '',
            genre: 'action',
            age: 12,
            image: '',
            description: '',
            rating: 5,
            sessions: [],
            details: {},
            isDetails: false,
            isRoles: false,
            isReviews: false,
            isLocation: false
        })
    }

    const deleteEvent = async(eventId)=>{
        const resp = await axios.delete(`/api/events/${eventId}`)
        setEvents(events.filter((event) => event._id !== eventId))
        toast(t('admin.eventDeleted'))
       
    }
    const createCinema = async()=>{
        const resp = await axios.post('/api/cinemas',newCinema)
        const createdCinema = resp.data
        setCinemas([...cinemas, createdCinema])
        toast(t('admin.cinemaCreated'))
 
    }

    const deleteCinema = async(cinemaId)=>{
        const resp = await axios.delete(`/api/cinemas/${cinemaId}`)
        setCinemas(cinemas.filter(cinema => cinema._id !== cinemaId))
        toast.success(t('admin.cinemaDeleted'))
    }

    const deleteUser = async(userId)=>{
        const resp = await axios.delete(`/api/users/${userId}`)
        setUsers(users.filter(user => user._id !== userId))
        toast(t('admin.userDeleted'))
    }

    if(!tokenUser || !tokenUser.isAdmin){
        router.push('/')
        return null
    }

    return (
        <div className="px-5 space-y-8 my-16">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t('admin.events')}</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {t('admin.addEvent')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='bg-white'>
                            <DialogHeader>
                                <DialogTitle>{t('admin.newEvent')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>{t('admin.title')} *</Label>
                                        <Input value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('admin.type')} *</Label>
                                        <Select value={newEvent.type} onValueChange={value => setNewEvent({...newEvent, type: value})}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('admin.selectType')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {eventTypes.map(type => (
                                                    <SelectItem key={type} value={type}>
                                                    
                                                        {t(`event.type.${type}`)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>                                               
                                    <div className="space-y-2">
                                        <Label>{t('admin.genre')} *</Label>
                                        <Select value={newEvent.genre} onValueChange={value => setNewEvent({...newEvent, genre: value})}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('admin.selectGenre')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {eventGenre.map(genre => (
                                                        <SelectItem key={genre} value={genre}>
                                                            {t(`event.genre.${genre}`)}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>                                               
                                    <div className="space-y-2">
                                        <Label>{t('admin.age')} *</Label>
                                        <Input type="number" min="0" value={newEvent.age} onChange={(e) => setNewEvent({...newEvent, age: e.target.value})}/>
                                    </div>                                               
                                    <div className="space-y-2">
                                        <Label>{t('admin.rating')} *</Label>
                                        <Input type="number" min="0" max="5" step="0.1" value={newEvent.rating} onChange={(e) => setNewEvent({...newEvent, rating: e.target.value})}/>
                                    </div>                                           
                                    <div className="space-y-2">
                                        <Label>{t('admin.image')} *</Label>
                                        <Input value={newEvent.image} onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}/>
                                    </div>                                          
                                    <div className="space-y-2 col-span-2">
                                        <Label>{t('admin.description')}</Label>
                                        <Input value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}/>
                                    </div>                                             
                                    <div className="space-y-2 col-span-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="isDetails" checked={newEvent.isDetails} onCheckedChange={checked => setNewEvent({...newEvent, isDetails: checked})}/>
                                            <Label htmlFor="isDetails">{t('admin.addDetails')}</Label>
                                        </div>
                                        {newEvent.isDetails && (
                                            <div className="grid grid-cols-2 gap-4 ml-4">
                                                <Input placeholder={t('admin.engTitle')} value={newEvent.details.engTitle || ''} onChange={(e) => setNewEvent({...newEvent,details:{...newEvent.details, engTitle: e.target.value}})}/>
                                                <Input type="number" placeholder={t('admin.duration')} value={newEvent.details.duration || ''}onChange={(e) => setNewEvent({...newEvent,details: {...newEvent.details, duration: e.target.value}})}/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button onClick={createEvent}>{t('admin.create')}</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.title')}</TableHead>
                                <TableHead>{t('admin.type')}</TableHead>
                                <TableHead>{t('admin.genre')}</TableHead>
                                <TableHead>{t('admin.age')}</TableHead>
                                <TableHead>{t('admin.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event._id}>
                                    <TableCell>{event.title}</TableCell>
                                    <TableCell>{t(`event.type.${event.type}`)}</TableCell>
                                    <TableCell>{t(`event.genre.${event.genre}`)}</TableCell>
                                    <TableCell>{event.age}+</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" size="icon"onClick={() => deleteEvent(event._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t('admin.cinemas')}</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {t('admin.addCinema')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='bg-white'>
                            <DialogHeader>
                                <DialogTitle>{t('admin.newCinema')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>{t('admin.cinemaName')}</Label>
                                    <Select onValueChange={value => setNewCinema({...newCinema, cinemaName: value})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите кинотеатр" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cinemasName.map((name)=>(
                                                <SelectItem key={name} value={name}>{name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={createCinema}>{t('admin.create')}</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                
                <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.name')}</TableHead>
                                <TableHead>{t('admin.address')}</TableHead>
                                <TableHead>{t('admin.rating')}</TableHead>
                                <TableHead>{t('admin.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cinemas.map((cinema) => (
                                <TableRow key={cinema._id}>
                                    <TableCell>{cinema.cinemaName}</TableCell>
                                    <TableCell>{cinema.cinemaAddress}</TableCell>
                                    <TableCell>{cinema.cinemaRate}</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" size="icon" onClick={() => deleteCinema(cinema._id)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t('admin.users')}</h2>
                <ScrollArea className="h-[400px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('admin.name')}</TableHead>
                                <TableHead>{t('admin.email')}</TableHead>
                                <TableHead>{t('admin.role')}</TableHead>
                                <TableHead>{t('admin.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user)=>(
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" size="icon" onClick={() => deleteUser(user._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    )
}

export default AdminPageBuilder