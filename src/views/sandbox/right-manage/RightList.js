import { Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function RightList() {
  const [dataSource, setdataSource] = useState([])
  // fetch("http://localhost:8000/rights", "get").then(res => {
  //   setdataSource(res.data)
  // })
  useEffect(() => {
    axios.get("http://localhost:8000/rights").then(res => {
      setdataSource(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key'
    },
    {
      title: '操作',
      dataIndex: 'pagepermisson'
    }
  ]
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}
