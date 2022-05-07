import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  CopyOutlined,
  FormOutlined,
  ProfileOutlined,
  TeamOutlined,
  SoundOutlined
} from '@ant-design/icons';
import './index.css'
import axios from 'axios';
const { Sider } = Layout
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <SettingOutlined />,
  "/right-manage/role/list": <TeamOutlined />,
  "/right-manage/right/list": <SettingOutlined />,
  "/news-manage": <CopyOutlined />,
  "/news-manage/add": <CopyOutlined />,
  "/news-manage/draft": <CopyOutlined />,
  "/news-manage/category": <ProfileOutlined />,
  "/audit-manage": <FormOutlined />,
  "/audit-manage/audit": <FormOutlined />,
  "/audit-manage/list": <FormOutlined />,
  "/publish-manage": <SoundOutlined />,
  "/publish-manage/unpublished": <SoundOutlined />,
  "/publish-manage/published": <SoundOutlined />,
  "/publish-manage/sunset": <SoundOutlined />,
}
function SideMenu(props) {
  const [meun, setMeun] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      setMeun(res.data)
    })
  }, []);

  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }

  function getItem(label, key, icon, children) {
    return {
      label,
      key,
      icon,
      children
    }
  }

  const renderMenu = (menuList) => {
    const items = []
    menuList.forEach(item => {
      const childrens = []
      item.children.forEach(child => {
        if (checkPagePermission(child)) {
          childrens.push(getItem(child.title, child.key, iconList[child.key]))
        }
      })
      if (checkPagePermission(item)) {
        if (item.children?.length > 0) {
          items.push(getItem(item.title, item.key, iconList[item.key], childrens))
        } else {
          items.push(getItem(item.title, item.key, iconList[item.key]))
        }
      }
    })
    return items;
  }
  const selectKeys = [props.location.pathname]
  const openKeys = ["/" + props.location.pathname.split("/")[1]]
  const onClickMenu = (obj) => {
    props.history.push(obj.key)
  }
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo">全球新闻发布管理</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} className="aaaaaaa" defaultOpenKeys={openKeys} items={renderMenu(meun)} onClick={onClickMenu} />
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
