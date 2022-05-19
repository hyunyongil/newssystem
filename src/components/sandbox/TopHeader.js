import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const { Header } = Layout;
//cnpm i --save redux react-redux
function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    //改变state的isCollapsed
    props.changeCollapsed()
  }
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
  const logout = () => {
    localStorage.removeItem("token")
    props.history.replace("/login")
  }
  const menu = [
    {
      label: roleName,
      key: 1
    },
    {
      label: '退出',
      key: 2,
      danger: true,
      onClick: logout
    }
  ]

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
      className: 'trigger',
      onClick: this.toggle,
    })} */}
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来</span>
        <Dropdown overlay={<Menu items={menu} />}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
/*
connect(
 //mapStateToProps
 //mapDispatchToProps
)(被包装的组件)
*/
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed"
      //payload
    }//action
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
