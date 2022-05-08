import React, { useEffect, useState, useRef } from 'react'
import { Form, Input, Select, Button, PageHeader, Steps } from 'antd'
import style from './News.module.css'
import axios from 'axios'
const { Step } = Steps
const { Option } = Select

export default function NewsAdd() {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                console.log(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            setCurrent(current + 1)
        }

    }
    const handlePrevious = () => {
        setCurrent(current - 1)
    }

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    }
    const NewsForm = useRef(null)
    useEffect(() => {
        axios.get("categories").then(res => {
            setCategoryList(res.data)
        })
    }, [])
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="编写新闻"
                subTitle="发布成功奖励1万元起" />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标提，新闻纷飞" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>
            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form ref={NewsForm}
                        {...layout}
                        name="basic"
                    >
                        <Form.Item
                            name="title"
                            label="新闻标题"
                            rules={[{ required: true, message: '请输入标题!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="新闻分类"
                            rules={[{ required: true, message: '请选择分类!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}
                                        >{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className={current === 1 ? '' : style.active}>222222</div>
            <div className={current === 2 ? '' : style.active}>33333</div>
            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary">保存草稿箱</Button>
                        <Button type="danger">提交审核</Button></span>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}
