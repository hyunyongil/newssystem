import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/rights?_embed=children", {
      method: "get"
    }).then(res => {
      res.json().then((data) => {
        data.forEach(item => {
          if (item.children.length === 0) {
            item.children = ""
          }
        })
        setdataSource(data)
      })
    })
    // axios.get(`http://localhost:8000/rights?_embed=children`).then(res => {
    //   const list = res.data
    //   list.forEach(item => {
    //     if (item.children.length === 0) {
    //       item.children = ""
    //     }
    //   })
    //   setdataSource(res.data)
    // })
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
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
          <Popover content={<div style={{ textAlign: "center" }}>
            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)
            }></Switch>
          </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} style={{ marginLeft: 5 }
            } disabled={item.pagepermisson === undefined} />
          </Popover>
        </div>
      }
    }
  ]
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setdataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:8000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:8000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }
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
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`http://localhost:8000/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`http://localhost:8000/children/${item.id}`)
    }
  }
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
