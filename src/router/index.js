import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '自动化测试平台' }
                },
                // {
                //     path: '/table',
                //     component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                //     meta: { title: '基础表格' }
                // },
                // {
                //     path: '/form',
                //     component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                //     meta: { title: '基本表单' }
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                //     meta: { title: '文件上传' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                //     meta: { title: '拖拽列表' }
                // },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/uiProject',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/uiProject/UiProject.vue'),
                    meta: { title: 'UI项目' }
                },
                {
                    path: '/uiProjectPage',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/uiPage/UIProjectPage.vue'),
                    meta: { title: 'UI页面管理' }

                },
                {

                    path: '/uiProjectPageElement',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/uiPageElement/uiProjectPageElement.vue'),
                    meta: { title: 'UI页面元素管理' }


                },
                {
                    path: '/uiProjectTestCase',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/uiTestCase/UiProjectTestCase.vue'),
                    meta: { title: 'UI测试用例' }
                },
                {
                    path: '/uiProjectTask',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/uiTask/UiProjectTask.vue'),
                    meta: { title: 'UI任务管理' }
                },
                {
                    path: '/uiPositioning',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/uiPositioning/UiPositioning.vue'),
                    meta: { title: 'UI定位' }
                },
                {
                    path: '/uiElementOperation',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/uiElementOperation/UiElementOperation.vue'),
                    meta: { title: 'UI元素操作' }
                },

                {
                    path: '/apiProject',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/apiProject/ApiProject.vue'),
                    meta: { title: 'Api项目' }
                },
                {
                    path: '/apiProjectModule',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/apiModule/ApiProjectModule.vue'),
                    meta: { title: 'Api模块' }
                },
                {
                    path: '/apiProjectTestCase',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/apiTestCase/ApiProjectTestCase.vue'),
                    meta: { title: 'Api测试用例' }
                },
                {
                    path: '/apiBusinessTest',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/apiBusinessTest/apiProjectBusinessTest.vue'),
                    meta: { title: 'Api业务测试' }
                },
                {
                    path: '/apiTask',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/apiTask/ApiProjectTask.vue'),
                    meta: { title: 'Api任务管理' }
                },
                {
                    path: '/apiEnvironment',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/apiEnvironment/ApiEnvironment.vue'),
                    meta: { title: 'Api环境设置' }
                },

                {
                    path: '/performanceProject',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/performanceProject/performanceProject.vue'),
                    meta: { title: '性能测试项目' }
                },
                {
                    path: '/performanceProjectScript',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/performanceScript/performanceProjectScript.vue'),
                    meta: { title: '性能测试脚本' }
                },
                {
                    path: '/performanceTask',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/performanceTask/performanceTask.vue'),
                    meta: { title: '性能测试任务' }
                },


            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
