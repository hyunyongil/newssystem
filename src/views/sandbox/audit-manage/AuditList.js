import React, { useEffect, useState } from 'react'
import { Table, Button, Tag } from 'antd'
import axios from 'axios'
import {
    SendOutlined,
    ClearOutlined,
    AppleOutlined
} from '@ant-design/icons';
export default function AuditList() {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?auditState_ne=0&author_new=${username}&publishState_lte=1&_expand=category`).then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [username])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ["", "orange", "green", "red"]
                const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button icon={<ClearOutlined />}>撤销</Button>
                    }
                    {
                        item.auditState === 2 && <Button type='danger' icon={<SendOutlined />} >发布</Button>
                    }

                    {
                        item.auditState === 3 && <Button type='primary' icon={<AppleOutlined />}>更新</Button>
                    }

                </div>
            }
        }
    ]


    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5,
                    position: ["bottomCenter"]
                }} rowKey={item => item.id} />
        </div>
    )
}
