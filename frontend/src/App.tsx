import './index.css'
import { useState } from 'react'
function App(){
  const [count, setCount] = useState(0)
  return (
    <section>
      <div className='bg-black w-[6rem] h-[12rem] text-white mx-auto mt-[3rem]'>{count}</div>
      <button onClick={()=>setCount(count+1)}>click</button>
    </section>
  )
}

export default App
