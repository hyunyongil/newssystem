import { Table, Button, Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} style={{ marginLeft: 10 }
          } />
        </div>
      }
    }
  ]
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      //content: 'Some descriptions',
      onOk() {
        //console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }
  //删除
  const deleteMethod = (item) => {
    //当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/roles/${item.id}`)
  }

  useEffect(() => {
    axios.get(`http://localhost:8000/roles`).then(res => {
      setdataSource(res.data)
    })
  }, [])
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"]
        }}   ></Table>
    </div>
  )
}
