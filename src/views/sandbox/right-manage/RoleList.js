import { Table, Button, Modal, Tree } from 'antd'
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
  const [rightList, setRightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalVisible, setisModalVisible] = useState(false)
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
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} style={{ marginLeft: 10 }} onClick={() => {
            setisModalVisible(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }} />
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

  useEffect(() => {
    axios.get(`http://localhost:8000/rights?_embed=children`).then(res => {
      setRightList(res.data)
    })
  }, [])

  const handleOk = () => {
    setisModalVisible(false)
    //同步dataSource
    setdataSource(dataSource.map(item => {
      if (item.id === currentId) {
        console.log(currentRights)
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    //patch
    axios.patch(`http://localhost:8000/roles/${currentId}`, {
      rights: currentRights
    })
  }
  const handleCancel = () => {
    setisModalVisible(false)
  }
  const onCheck = (checkedKeys) => {
    setcurrentRights(checkedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"]
        }}   ></Table>

      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable={true}
          checkStrictly={true}
          checkedKeys={currentRights}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
