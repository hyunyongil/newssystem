import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Descriptions, message, Tooltip, Comment, Avatar, Form, Button, List, Input } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import moment from 'moment'
import { v4 as uuidv4 } from "uuid"
const userid = ("游客" + uuidv4()).substring(0, 10)
const { TextArea } = Input
//cnpm i --save moment
//cnpm i --save uuid

//Comment
const CommentList = ({ comments }) => (
    <List style={{ width: "97%", margin: '0 auto' }}
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? '评论' : '回复'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);
//Comment
const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                提交
            </Button>
        </Form.Item>
    </>
);



export default function Detail(props) {
    function makeTime(time) {
        const duration = (+Date.now() - time) / 100000
        var times
        if (duration <= 60 || !duration) {
            times = `${Math.round(Math.max(duration, 1))}秒前`
        } else if (duration > 60 && duration <= 1440) {
            times = `${Math.round(Math.max(duration / 60, 1))}分钟前`
        } else if (duration > 1440 && duration <= 43200) {
            times = `${Math.round(Math.max(duration / 1440, 1))}天前`
        } else {
            times = `${Math.round(Math.max(duration / 43200, 1))}月前`
        }
        return times
    }
    const [newsInfo, setnewsInfo] = useState(null)
    const [heartState, setheartState] = useState(true)
    useEffect(() => {
        const heartToken = localStorage.getItem("heart" + props.match.params.id)
        if (heartToken) {
            const { clicked } = JSON.parse(heartToken)
            clicked && setheartState(false)
        }
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
            return false
        }
        setnewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        }).then(res => {
            message.success("点赞成功~!")
            setheartState(false)
        })
        const heartData = { "clicked": 1 }
        localStorage.setItem("heart" + props.match.params.id, JSON.stringify(heartData))
    }


    //Comment
    const [state, setState] = useState({
        comments: [],
        submitting: false,
        value: '',
    });
    //Comment
    const handleSubmit = (userid) => {
        if (!state.value) {
            return;
        }

        setState({
            ...state,
            submitting: true,
        });

        setTimeout(() => {
            setState({
                submitting: false,
                value: '',
                comments: [
                    ...state.comments,
                    {
                        author: userid,
                        avatar: 'https://joeschmoe.io/api/v1/random',
                        content: <p>{state.value}</p>,
                        datetime: makeTime(+Date.now())
                    },
                ],
            });
        }, 1000);
    };
    //Comment
    const handleChange = e => {
        setState({
            ...state,
            value: e.target.value,
        });
    };

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
                                <HeartTwoTone style={{ marginLeft: "5px" }} twoToneColor={heartState ? ("#eb2f96") : ("#690")} onClick={() => handleStar()} />
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



            {state.comments.length > 0 && <CommentList comments={state.comments} />}
            <Comment style={{ width: "97%", margin: '0 auto' }}
                author={userid}
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={userid} />}
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment().format('YYYY-MM-DD HH:mm:ss')}</span>
                    </Tooltip>
                }
                content={
                    <Editor
                        onChange={handleChange}
                        onSubmit={handleSubmit.bind(this, userid)}
                        submitting={state.submitting}
                        value={state.value}
                    />
                }
            />
        </div >
    )
}
