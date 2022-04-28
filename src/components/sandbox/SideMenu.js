import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  CopyOutlined,
  FormOutlined,
  SoundOutlined
} from '@ant-design/icons';
import './index.css'
import axios from 'axios';
const { Sider } = Layout
const { SubMenu } = Menu

// const menuList = [
//   {
//     key: "/home",
//     title: "首页",
//     icon: <VideoCameraOutlined />
//   },
//   {
//     key: "/user-manage",
//     title: "用户管理",
//     icon: <UserOutlined />,
//     children: [
//       {
//         key: "/user-manage/list",
//         title: "用户管理",
//         icon: <UserOutlined />
//       }
//     ]
//   },
//   {
//     key: "/right-manage",
//     title: "权限管理",
//     icon: <UploadOutlined />,
//     children: [
//       {
//         key: "/right-manage/role/list",
//         title: "角色列表",
//         icon: <UploadOutlined />
//       },
//       {
//         key: "/right-manage/right/list",
//         title: "权限列表",
//         icon: <UploadOutlined />
//       }
//     ]
//   }
// ]

const iconList = {
  "/home": <VideoCameraOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UploadOutlined />,
  "/right-manage/role/list": <UploadOutlined />,
  "/right-manage/right/list": <UploadOutlined />,
  "/news-manage": <CopyOutlined />,
  "/audit-manage": <FormOutlined />,
  "/publish-manage": <SoundOutlined />
}
function SideMenu(props) {
  const [meun, setMeun] = useState([])
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then(res => {
      console.log(res.data)
      setMeun(res.data)
    })
  }, []);

  const checkPagePermission = (item) => {
    return item.pagepermisson === 1
  }

  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      } else {
        return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
          props.history.push(item.key)
        }
        }> {item.title}</Menu.Item >
      }
    })
  }
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className="logo">全球新闻发布管理</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        {/* <Menu.Item key="1" icon={<UserOutlined />}>
          首页
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          首页2
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          首页3
        </Menu.Item>
        <SubMenu key="sub4" icon={<UploadOutlined />} title="用户管理">
          <Menu.Item key="9">Option9</Menu.Item>
          <Menu.Item key="10">Option10</Menu.Item>
          <Menu.Item key="11">Option11</Menu.Item>
          <Menu.Item key="12">Option12</Menu.Item>
        </SubMenu> */}
        {renderMenu(meun)}
      </Menu>
    </Sider>
  )
}

export default withRouter(SideMenu)
