import Child from './Child'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'
function App() {
  useEffect(()=>{
    axios.get("/passApi/js/wrapper.js?cdnversion=1650788828566&_=1650788827572").then(res=>{
      console.log(res.data)
    })
  }, [])
  return <div>app
    <ul>
      <li>111</li>
      <li>222</li>  
    </ul>
<Child/>
  </div>
}

export default App;
