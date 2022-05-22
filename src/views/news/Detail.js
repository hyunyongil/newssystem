import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Descriptions, message, Tooltip, Comment, Avatar, Form, Button, List, Input, Modal, notification, Spin } from 'antd'
import { HeartTwoTone } from '@ant-design/icons'
import moment from 'moment'
import { v4 as uuidv4 } from "uuid"
import {
    ExclamationCircleOutlined
} from '@ant-design/icons'
const { confirm } = Modal
const { TextArea } = Input
//cnpm i --save moment
//cnpm i --save uuid

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
)

export default function Detail(props) {
    let userid = ''
    const useridToken = localStorage.getItem("userid" + props.match.params.id)
    if (useridToken) {
        userid = JSON.parse(useridToken).userid
    } else {
        const useridRand = { "userid": ("游客" + uuidv4()).substring(0, 10) }
        localStorage.setItem("userid" + props.match.params.id, JSON.stringify(useridRand))
        userid = useridRand.userid
    }

    //Comment  ${comments.length > 0 ? '评论' : '回复'}
    const CommentList = ({ comments }) => (
        <List style={{ width: "97%", margin: '0 auto' }}
            dataSource={comments}
            header={
                <div>
                    <span style={{ color: "orange", fontWeight: "bold" }}> {comments.length}</span>
                    <span style={{ color: "#333", fontWeight: "normal" }}> {comments.length > 0 ? '评论' : '回复'}</span>
                </div>
            }
            itemLayout="horizontal"
            renderItem={coms => <Comment actions={
                coms.author === userid ? [<span style={{ color: "orange" }} onClick={() => confirmMethod(coms.id)}>删除</span>] : ''
            } {...coms} />}
        />
    )

    function makeTime(time) {
        const duration = (+Date.now() - time) / 1000
        let times
        if (duration <= 60 || !duration) {
            times = `${Math.round(Math.max(duration, 1))}秒前`
        } else if (duration > 60 && duration <= 3600) {
            times = `${Math.round(Math.max(duration / 60, 1))}分钟前`
        } else if (duration > 3600 && duration <= 86400) {
            times = `${Math.round(Math.max(duration / 3600, 1))}小时前`
        } else if (duration > 86400 && duration <= 2592000) {
            times = `${Math.round(Math.max(duration / 86400, 1))}天前`
        } else if (duration > 2592000 && duration <= 3110400) {
            times = `${Math.round(Math.max(duration / 2592000, 1))}月前`
        } else {
            times = `${Math.round(Math.max(duration / 3110400, 1))}年前`
        }
        return times
    }
    function getAvata() {
        let avataImage = [
            'https://img2.baidu.com/it/u=220747880,1917357868&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=504',
            'https://img0.baidu.com/it/u=3105696824,611331058&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            'https://img0.baidu.com/it/u=3641835000,3267405394&fm=253&fmt=auto&app=138&f=JPEG?w=511&h=500',
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp305013418.jpg&refer=http%3A%2F%2Fimg1.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655782222&t=83eba48f46620bd2664bf66463a52cdf',
            'https://img2.baidu.com/it/u=4136761481,3671394003&fm=253&fmt=auto&app=138&f=JPEG?w=259&h=224',
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_bt%2F0%2F10974251286%2F641.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655782275&t=6c675714813075d4968cb9a369374b4d',
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Ff87d23b66a01479026000a296a82c82330514d96445c-JxFai9_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655782316&t=7b39df00128dd7c6cbc640d162ebee64',
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F03%2F69%2F49%2F5be9ff0f4f150_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655782357&t=67b6a61c0612ee2946155741e17ac983',
            'https://img1.baidu.com/it/u=2901188737,3450591902&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.rmb4.cn%2F2020%2F09%2F7c7ab-1598866041-bb13d2242e82b48.jpg&refer=http%3A%2F%2Fimg.rmb4.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655782408&t=6a52c70909f19cf4d6154897d6f99416'
        ]
        let random_1 = Math.random() + ""
        let randKey = random_1.charAt(3)
        return avataImage[randKey]
    }
    const [newsInfo, setnewsInfo] = useState(null)
    const [heartState, setheartState] = useState(true)
    const [avataUrl, setavataUrl] = useState(getAvata())
    const [spin, setspin] = useState(true)
    //Comment
    const [state, setState] = useState({
        comments: [],
        submitting: false,
        value: '',
    });

    useEffect(() => {
        axios.get(`/comments?newsid=${props.match.params.id}`).then(res => {
            res.data.forEach(item => {
                item.timestamp = item.datetime
                item.datetime = makeTime(item.datetime)
            })
            setState({ comments: res.data })
        })
    }, [props.match.params.id])

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
        setspin(false)
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
    const handleSubmit = (userid) => {
        if (!state.value) {
            return false
        }
        if (state.value.length < 2) {
            message.error("评论输入2个字以上")
            return false
        }
        setState({
            ...state,
            submitting: true
        })

        const nowtime = +Date.now()
        axios.post('/comments', {
            "author": userid,
            "avatar": avataUrl,
            "content": state.value,
            "datetime": nowtime,
            "newsid": parseInt(props.match.params.id)
        }).then(res => {
            setState({
                submitting: false,
                value: '',
                comments: [
                    ...state.comments,
                    {
                        id: res.data.id,
                        author: userid,
                        avatar: avataUrl,
                        content: <p>{state.value}</p>,
                        datetime: makeTime(nowtime),
                        timestamp: nowtime
                    },
                ],
            })
            notification.info({
                message: `通知`,
                description:
                    `您的评论已成功发布~!`,
                placement: "bottomRight",
            });
        })
        //初始化评论时间
        state.comments.forEach(item => {
            if (item.timestamp)
                item.datetime = makeTime(item.timestamp)
        })
        setState({ comments: state.comments })
    }
    //Comment
    const handleChange = e => {
        setState({
            ...state,
            value: e.target.value,
        })
    }

    const changeAvata = () => {
        setavataUrl(getAvata())
    }

    const confirmMethod = (id) => {
        confirm({
            title: '确定删除该评论吗?',
            icon: <ExclamationCircleOutlined />,
            //content: 'Some descriptions',
            onOk() {
                //console.log('OK');
                deleteComment(id)
            },
            onCancel() {
                //console.log('Cancel');
            },
        });
    }

    //删除评论
    const deleteComment = (id) => {
        setState({
            ...state.comments,
            comments: state.comments.filter(item => item.id !== id)
        })
        axios.delete(`/comments/${id}`).then(res => {
            notification.success({
                message: `通知`,
                description:
                    `您已经删除了该评论`,
                placement: "bottomRight"
            });
        })
    }
    return (
        <Spin size="large" spinning={spin}>
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
                                <Descriptions.Item label="评论数量"><span style={{ fontWeight: "bold", color: "orange" }}>{state.comments.length}</span></Descriptions.Item>
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
                    avatar={<Avatar src={avataUrl} alt={avataUrl} title="点击换头像" onClick={() => changeAvata()} />}
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
        </Spin>
    )
}
