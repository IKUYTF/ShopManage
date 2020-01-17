/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
    {
        path: '/userManage',
        name: 'ユーザー管理',
        view: 'Wechat/UserManage'
    },
    {
        path: '/shopManage',
        name: '店舗管理',
        view: 'Wechat/ShopManage'
    },
    {
        path: '/login',
        name: '登録',
        view: 'Login'
    }
]
