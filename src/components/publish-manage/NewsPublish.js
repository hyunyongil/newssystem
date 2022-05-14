import { Button, Table } from 'antd'
import React from 'react'

export default function NewsPublish(props) {
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
            title: '操作',
            render: () => {
                return <div>
                    <Button>button</Button>
                </div>
            }
        }
    ]
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns}
                pagination={{
                    pageSize: 5,
                    position: ["bottomCenter"]
                }} rowKey={item => item.id} />
        </div>
    )
}
