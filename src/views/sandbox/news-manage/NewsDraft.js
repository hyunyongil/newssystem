import { Table, Button, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    DeleteOutlined,
    EditOutlined,
    UploadOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;
export default function NewsDraft() {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?auditState=0&author=${username}&_expand=category`).then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [username])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title'
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '分类',
            dataIndex: 'category',
            render: (category) => {
                return category.title
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Button shape="circle" icon={<EditOutlined />} style={{ marginLeft: 5 }} />
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} style={{ marginLeft: 5 }} />
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
        axios.delete(`/news/${item.id}`)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                rowKey={(item) => item.id}
                pagination={{
                    pageSize: 5,
                    position: ["bottomCenter"]
                }} />
        </div>
    )
}
