import React from 'react'
import style2 from './Child.module.scss'
export default function Child() {
  return (
    <div>
        <ul>
            <li className={style2.item}>Child-111</li>
            <li className={style2.item}>Child-222</li>  
        </ul>
    </div>
  )
}
