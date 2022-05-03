import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [isAddVisible, setisAddVisible] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const addForm = useRef(null)
  useEffect(() => {
    // fetch("http://localhost:8000/users?_expand=role", {
    //   method: "get"
    // }).then(res => {
    //   res.json().then((data) => {
    //     const list = data
    //     setdataSource(list)
    //   })
    // })
    axios.get(`http://localhost:8000/users?_expand=role`).then(res => {
      const list = res.data
      setdataSource(list)
    })
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:8000/regions`).then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:8000/roles`).then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} style={{ marginLeft: 5 }} disabled={item.default} />
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

  }

  const addFormOK = () => {
    addForm.current.validateFields().then(Value => {
      setisAddVisible(false)
      axios.post(`http://localhost:8000/users`, {
        ...Value,
        "roleState": true,
        "default": false
      }).then(res => {
        setdataSource([...dataSource, res.data])
      })
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div>
      <Button type="primary" onClick={() => {
        setisAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5,
          position: ["bottomCenter"]
        }}
        rowKey={item => item.id}
      />

      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisAddVisible(false)
        }}
        onOk={() => addFormOK()}
      >
        <UserForm regionList={regionList} roleList={roleList}
          ref={addForm}></UserForm>
      </Modal>
    </div>
  )
}
