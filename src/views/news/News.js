import { PageHeader, Col, Row, Card, List, Spin } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import _ from 'lodash'
export default function News() {
    NProgress.start()
    useEffect(() => {
        NProgress.done()
    })
    const [spin, setspin] = useState(true)
    const [list, setlist] = useState([])
    useEffect(() => {
        axios.get(`/news?publishState2&_expand=category`).then(res => {
            setlist(Object.entries(_.groupBy(res.data, item => item.category.title)));
        })
        setspin(false)
    }, [])

    return (
        <Spin size="large" spinning={spin}>
            <div style={{ width: "95%", margin: '0 auto' }}>
                <PageHeader
                    className="site-page-header"
                    title="全球大新闻"
                    subTitle="查看新闻"
                />
                <div className="site-card-wrapper">
                    <Row gutter={[20, 20]}>
                        {
                            list.map(item =>
                                <Col span={8} key={item[0]}>
                                    <Card title={item[0]} bordered={true} hoverable={true}>
                                        <List
                                            size="small"
                                            dataSource={item[1]}
                                            pagination={{
                                                pageSize: 3,
                                                position: "bottom",
                                                style: {
                                                    textAlign: "center",
                                                    width: "100%"
                                                }
                                            }}
                                            renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                        />
                                    </Card>
                                </Col>
                            )
                        }

                    </Row>
                </div>
            </div>
        </Spin>
    )
}
