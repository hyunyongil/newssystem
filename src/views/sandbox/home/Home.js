import React, { PureComponent } from 'react'
import { Button } from 'antd'
import axios from 'axios'
export default class Home extends PureComponent {
  render() {
    const ajax = () => {
      //取数据
      // axios.get("http://localhost:8000/posts/4").then(res => {
      //   console.log(res.data)
      // })

      //增
      // axios.post("http://localhost:8000/posts", {
      //   title: "444",
      //   author: "新来的44"
      // })

      //修改替换 put
      // axios.put("http://localhost:8000/posts/4", {
      //   title: "1111-修改"
      // })
      //修改 patch
      // axios.patch("http://localhost:8000/posts/4", {
      //   title: "1111-修改"
      // })

      //删除 delete
      //axios.delete("http://localhost:8000/posts/2")

      //关联查询 向下 _embed
      // axios.get("http://localhost:8000/posts?_embed=comments").then(res => {
      //   console.log(res.data)
      // })
      //关联查询 向上 _expand
      axios.get("http://localhost:8000/comments?_expand=post").then(res => {
        console.log(res.data)
      })
    }
    return (
      <div>
        <Button type="primary" onClick={ajax}>Button</Button>
      </div>
    )
  }
}
