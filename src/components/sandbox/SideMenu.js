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
      if (item.children?.length > 0 && checkPagePermission(item)) {
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
  const selectKeys = [props.location.pathname]
  const openKeys = ["/" + props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo">全球新闻发布管理</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} className="aaaaaaa" defaultOpenKeys={openKeys}>
            {renderMenu(meun)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
