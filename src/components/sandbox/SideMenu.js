import React from 'react'
import { Layout, Menu } from 'antd'
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import './index.css'
const { Sider } = Layout
const { SubMenu } = Menu

const menuList = [
  {
    key: "/home",
    title: "首页",
    icon: <UserOutlined />
  },
  {
    key: "/user-manage",
    title: "用户管理",
    icon: <UserOutlined />,
    children: [
      {
        key: "/user-manage/list",
        title: "用户管理",
        icon: <UserOutlined />
      }
    ]
  },
  {
    key: "/right-manage",
    title: "权限管理",
    icon: <UserOutlined />,
    children: [
      {
        key: "/right-manage/role/list",
        title: "角色列表",
        icon: <UserOutlined />
      },
      {
        key: "/right-manage/right/list",
        title: "权限列表",
        icon: <UserOutlined />
      }
    ]
  }
]

export default function SideMenu() {
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div className="logo">全球新闻发布管理</div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
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
        </SubMenu>
      </Menu>
    </Sider>
  )
}
