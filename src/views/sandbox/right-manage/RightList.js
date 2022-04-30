import { Table, Tag, Button } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
export default function RightList() {
  const [dataSource, setdataSource] = useState([])
  // fetch("http://localhost:8000/rights", "get").then(res => {
  //   setdataSource(res.data)
  // })
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then(res => {
      const list = res.data
      list[0].children = ""
      setdataSource(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="volcano">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: () => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} style={{ marginLeft: 10 }} />
        </div>
      }
    }
  ]
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"]
        }} />
    </div>
  )
}
