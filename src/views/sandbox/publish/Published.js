import usePublish from '../../../components/news-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button } from 'antd'
export default function Published() {
    // 2=>已发布
    const { dataSource, handleSunset } = usePublish(2)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => handleSunset(id)} danger>下线</Button>}></NewsPublish>
        </div>
    )
}
