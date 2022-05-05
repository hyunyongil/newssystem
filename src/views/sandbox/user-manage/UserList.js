import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal
function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [isAddVisible, setisAddVisible] = useState(false)
  const [isUpdateVisible, setisUpdateVisible] = useState(false)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [current, setcurrent] = useState(null)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const addForm = useRef(null)
  const updateForm = useRef(null)
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
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === ""
        } else {
          return item.region === value
        }
      },
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
        return <Switch checked={roleState} disabled={item.default}
          onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} style={{ marginLeft: 5 }} disabled={item.default} onClick={() => handleUpdate(item)} />
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
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`)
  }

  const addFormOK = () => {
    addForm.current.validateFields().then(value => {
      setisAddVisible(false)
      addForm.current.resetFields()
      axios.post(`http://localhost:8000/users`, {
        ...value,
        "roleState": true,
        "default": false
      }).then(res => {
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const updateFormOK = () => {
    updateForm.current.validateFields().then(value => {
      setisUpdateVisible(false)
      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`http://localhost:8000/users/${current.id}`,
        value
      )
    })
  }

  const handleUpdate = (item) => {
    console.log(updateForm)
    setTimeout(() => {
      setisUpdateVisible(true)
      if (item.roleId === 1) {
        //禁用
        setisUpdateDisabled(true)
      } else {
        //取消禁用
        setisUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)
    setcurrent(item)
  }

  const handleChange = (item) => {
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState
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
        onOk={() => addFormOK()}>
        <UserForm regionList={regionList} roleList={roleList}
          ref={addForm}></UserForm>
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOK()}>
        <UserForm regionList={regionList} roleList={roleList}
          ref={updateForm} isUpdateDisabled={isUpdateDisabled}></UserForm>
      </Modal>
    </div>
  )
}
export default UserList