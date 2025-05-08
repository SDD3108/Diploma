import React,{useState,useEffect} from 'react'
import { SearchAndSort } from '../../hooks/SearchAndSort/SearchAndSort'
import { GetEvents } from '../../../src/utils/GetEvents/GetEvents'
import { Input } from "@/src/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/src/ui/card"
import { Label } from "@/src/ui/label"
import { Slider } from "@/src/ui/slider"
import { Star } from 'lucide-react'
import { Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious, } from "@/src/ui/carousel"
import EventItemPage from '@/app/(pages)/EventItemPage/page';

const SearchPageBuilder = () => {
    const [events, setEvents] = useState([])
    const {
      filteredEvents,
      genres,
      searchTerm,
      setSearchTerm,
      genre,
      setGenre,
      rating,
      setRating,
      sortOrder,
      setSortOrder
    } = SearchAndSort(events)

    useEffect(() => {
        const getRequest = async () => {
           const data = await GetEvents()
           console.log(data);
           
           setEvents(data)
        }
        getRequest()
    },[])
    const handleGenreChange = (val)=>{
        setGenre((val) == 'all' ? '' : val)
    }
  
    const getDisplayedGenre = ()=>{
        return genre == '' ? 'all' : genre
    }
  return (
    <div className='w-full flex flex-col gap-5 px-5'>
        <div className="flex flex-col gap-1">
            <h1 className="text-[#151515] text-3xl font-bold">Поиск событий</h1>
            <p className="text-[#151515] text-lg">Удобный поиск мероприятий по дате, времени и типу.</p>
        </div>
        <div className="container space-y-6">
        <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input id="search" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            <div className="space-y-2">
            <Label>Жанр</Label>
            <Select value={getDisplayedGenre()} onValueChange={handleGenreChange}>
              <SelectTrigger>
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все жанры</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label>Сортировка по рейтингу</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">По Возрастанию</SelectItem>
                  <SelectItem value="desc">По Убыванию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Минимальный рейтинг: {rating}</Label>
            <Slider min={0} max={5} step={0.5} value={[rating]} onValueChange={(value) => setRating(value[0])}/>
          </div>
        </CardContent>
        </Card>
        <Carousel className="w-full mt-4">
            <CarouselContent className='w-full px-[1rem] gap-4'>
                {filteredEvents.map((event,index) => ( 
                    <CarouselItem key={index} onClick={()=>{}} className="basis-[calc(100%/7)] xl:basis-[calc(100%/7)] lg:basis-[calc(100%/5)] md:basis-[calc(100%/4)] sm:basis-[calc(100%/3)] max-sm:basis-[calc(100%/1.5)] p-0 py-2">
                        <div className="p-0">
                            <Card className="p-0 relative">
                                <CardContent className="flex aspect-square items-center justify-normal p-0">
                                    <EventItemPage object={event} loading={false} error={false}/>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className='w-[3rem] h-[3rem] disabled:hidden opacity-50 left-[3rem] '/>
            <CarouselNext className='w-[3rem] h-[3rem] disabled:hidden opacity-50 right-[3rem]'/>
        </Carousel>
        {filteredEvents.length == 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found by your criteria</p>
          </div>
        )}
        </div>
    </div>
  )
}

export default SearchPageBuilder