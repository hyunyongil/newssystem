import React, { PureComponent } from 'react'
import { Button } from 'antd'
import axios from 'axios'
export default class Home extends PureComponent {
  render() {
    const ajax = () => {
      //取数据
      axios.get("http://localhost:8000/posts/4").then(res => {
        console.log(res.data)
      })
      //增
      // axios.post("http://localhost:8000/posts", {
      //   title: "444",
      //   author: "新来的44"
      // })
    }
    return (
      <div>
        <Button type="primary" onClick={ajax}>Button</Button>
      </div>
    )
  }
}
