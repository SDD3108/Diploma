"use client"
import Image from "next/image";
import MyButton from "../companents/UI/button/MyButton";
import HeaderCompanent from '../companents/header/HeaderCompanent';
import FooterCompanent from '../companents/footer/FooterCompanent';
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() {
  const router = useRouter()
  const [array,setArray] = useState([
    {
      id:1,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:2,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:3,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:4,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:5,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
    {
      id:6,
      image:'https://static.wikia.nocookie.net/netflix/images/5/54/Netflix_logo.png/revision/latest?cb=20190623201834&path-prefix=ru',
    },
  ])
  return (
    <div>
      <HeaderCompanent/>
      <section className="px-5">
        <div className="w-full flex flex-col gap-[1.5rem]">
          <div className="overflow-hidden">
            <div className="flex w-[200%] gap-[1rem] animate-scrollRight">
              {array.map((card,index)=>(
                <div key={index} className="w-full h-[12rem] rounded-[1rem]">
                  <Image src={card.image} alt="not found" width={382} height={0} className="w-full h-full rounded-[1rem]"/>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex w-[200%] gap-[1rem] animate-scrollLeft">
              {array.map((card,index)=>(
                <div key={index} className="w-full h-[12rem] rounded-[1rem]">
                  <Image src={card.image} alt="not found" width={382} height={0} className="w-full h-full rounded-[1rem]"/>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex w-[200%] gap-[1rem] animate-scrollRight">
              {array.map((card,index)=>(
                <div key={index} className="w-full h-[12rem] rounded-[1rem]">
                  <Image src={card.image} alt="not found" width={382} height={0} className="w-full h-full rounded-[1rem]"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 mt-20">
        <div className="w-full h-[48rem]">
          <div>
            <h2></h2>
          </div>
        </div>
      </section>
      <FooterCompanent/>
    </div>
  );
}
