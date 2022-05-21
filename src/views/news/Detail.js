import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Descriptions, message } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import moment from 'moment'
//cnpm i --save moment
export default function Detail(props) {
    const [newsInfo, setnewsInfo] = useState(null)
    const [heartState, setheartState] = useState(true)
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            //同步后端
            return res.data
        }).then(res => {
            axios.patch(`/news/${props.match.params.id}`, {
                view: res.view + 1
            })
        })
    }, [props.match.params.id])
    const handleStar = () => {
        if (!heartState) {
            message.warning("已点赞~!")
        }
        setnewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        }).then(res => {
            setheartState(false)
        })
    }
    return (
        <div style={{ width: "95%", margin: '0 auto' }}>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category.title}
                                <HeartTwoTone style={{ marginLeft: "5px" }} twoToneColor="#eb2f96" onClick={() => handleStar()} />
                            </div>
                        }>
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        margin: "0 24px"
                    }}>
                    </div>
                </div>
            }
        </div >
    )
}
