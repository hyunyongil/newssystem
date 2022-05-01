import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  CopyOutlined,
  FormOutlined,
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
  "/right-manage/role/list": <SettingOutlined />,
  "/right-manage/right/list": <SettingOutlined />,
  "/news-manage": <CopyOutlined />,
  "/audit-manage": <FormOutlined />,
  "/publish-manage": <SoundOutlined />
}
function SideMenu(props) {
  const [meun, setMeun] = useState([])
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then(res => {
      setMeun(res.data)
    })
  }, []);

  const checkPagePermission = (item) => {
    return item.pagepermisson === 1
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
      item.children.forEach(datas => {
        if (checkPagePermission(datas)) {
          childrens.push(getItem(datas.title, datas.key, iconList[datas.key]))
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
