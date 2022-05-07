import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import axios from 'axios'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Home from '../../views/sandbox/home/Home'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import Published from '../../views/sandbox/publish/Published'
import Sunset from '../../views/sandbox/publish/Sunset'
import Unpublished from '../../views/sandbox/publish/Unpublished'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'

const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/right/list": RightList,
    "/right-manage/role/list": RoleList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

export default function NewsRouter() {
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:8000/rights`),
            axios.get(`http://localhost:8000/children`)
        ]).then(res => {
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    return (
        <Switch>
            {
                // BackRouteList.map(item => {
                //     if (checkRout() && checkUserPermission()) {
                //         return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
                //     }
                //     return <Nopermission />
                // }
                // )

                BackRouteList.map(item =>
                    <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
                )
            }
            <Redirect from="/" to="/home" exact />
            {
                BackRouteList.length > 0 && <Route path="*" component={Nopermission} />
            }
        </Switch>
    )
}
