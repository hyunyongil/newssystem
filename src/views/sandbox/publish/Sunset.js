import usePublish from '../../../components/news-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button } from 'antd'
export default function Sunset() {
    // 3=>已下线
    const { dataSource, handleDelete } = usePublish(3)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => handleDelete(id)} danger type='primary'>删除</Button>}></NewsPublish>
        </div>
    )
}
