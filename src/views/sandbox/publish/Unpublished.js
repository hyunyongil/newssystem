import usePublish from '../../../components/news-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button } from 'antd'
export default function Unpublished() {
    // 1=>待发布
    const { dataSource, handlePublish } = usePublish(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => handlePublish(id)} type='primary'>发布</Button>}></NewsPublish>
        </div>
    )
}
