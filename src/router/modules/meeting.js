const meeting = {
    path: "/main/meeting",
    name: "meeting",
    component: () => import("@/pages/meeting/index"),
    meta: {keepAlive: false, title: "会议管理"},
    redirect: "/main/meeting/form/index",
    children: [
        {
            path: '/main/meeting/form/index',
            name: 'meetingIndex',
            component: () => import('@/pages/meeting/form/index'),
            meta: {keepAlive: false, title: "会议首页"},
        },
        {
            path: '/main/meeting/form/meetList',
            name: 'meetList',
            component: () => import('@/pages/meeting/form/meetList'),
            meta: {keepAlive: false, title: "我的会议"},
        },
        {
            path: '/main/meeting/form/meetDetail',
            name: 'meetDetail',
            component: () => import('@/pages/meeting/form/meetDetail'),
            meta: {keepAlive: false, title: "会议库详情"},
        },
        {
            path: '/main/meeting/form/meetTransact',
            name: 'meetTransact',
            component: () => import('@/pages/meeting/form/meetTransact'),
            meta: {keepAlive: false, title: "会议待办"},
        },
        {
            path: '/main/meeting/form/meetProject',
            name: 'meetProject',
            component: () => import('@/pages/meeting/form/meetProject'),
            meta: {keepAlive: false, title: "起草会议方案"},
        },
        {
            path: '/main/meeting/form/issueUnit',
            name: 'issueUnit',
            component: () => import('@/pages/meeting/form/issueUnit'),
            meta: {keepAlive: false, title: "单位议题库"},
        },
        {
            path: '/main/meeting/form/issueDepartment',
            name: 'issueDepartment',
            component: () => import('@/pages/meeting/form/issueDepartment'),
            meta: {keepAlive: false, title: "部门议题库"},
        },
        {
            path: '/main/meeting/form/issueShared',
            name: 'issueShared',
            component: () => import('@/pages/meeting/form/issueShared'),
            meta: {keepAlive: false, title: "共享议题库"},
        },
        {
            path: '/main/meeting/form/conferenceUnit',
            name: 'conferenceUnit',
            component: () => import('@/pages/meeting/form/conferenceUnit'),
            meta: {keepAlive: false, title: "单位会议库"},
        },
        {
            path: '/main/meeting/form/conferenceDepartment',
            name: 'conferenceDepartment',
            component: () => import('@/pages/meeting/form/conferenceDepartment'),
            meta: {keepAlive: false, title: "会议库"},
        },
        {
            path: '/main/meeting/form/conferenceShared',
            name: 'conferenceShared',
            component: () => import('@/pages/meeting/form/conferenceShared'),
            meta: {keepAlive: false, title: "共享会议库"},
        },
        {
            path: '/main/meeting/form/meetReserve',
            name: 'meetReserve',
            component: () => import('@/pages/meeting/form/meetReserve'),
            meta: {keepAlive: false, title: "会议室预定"},
        },
        {
            path: '/main/meeting/form/meetManage',
            name: 'meetManage',
            component: () => import('@/pages/meeting/form/meetManage'),
            meta: {keepAlive: false, title: "会议室管理"},
        },
        {
            path: '/main/meeting/form/meetExamine',
            name: 'meetExamine',
            component: () => import('@/pages/meeting/form/meetExamine'),
            meta: {keepAlive: false, title: "会议室审批"},
        },
        {
            path: '/main/meeting/form/meetDictionary',
            name: 'meetDictionary',
            component: () => import('@/pages/meeting/form/meetDictionary'),
            meta: {keepAlive: false, title: "会议室字典"},
        },
        {
            path: '/main/meeting/form/meetBuilding',
            name: 'meetBuilding',
            component: () => import('@/pages/meeting/form/meetBuilding'),
            meta: {keepAlive: false, title: "会议楼栋管理"},
        }
    ]
}

export default meeting