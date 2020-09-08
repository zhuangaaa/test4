import Vue from 'vue'
import Router from 'vue-router'
import axios from '../utils/http'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', meta: { title: '个人中心' }, component: () => import('@/views/personal.vue') },
    { path: '/auth', meta: { title: '微信授权' }, component: () => import('@/views/auth.vue') },
    { path: '/bind', meta: { title: '绑定学生' }, component: () => import('@/views/bind.vue') },
    { path: '/unbind', meta: { title: '解绑学生' }, component: () => import('@/views/unbind.vue') },
    { path: '/joblist', meta: { title: '作业列表', keepAlive: true }, component: () => import('@/views/joblist.vue') },
    { path: '/analysis', meta: { title: '' }, component: () => import('@/views/analysis.vue') },
    { path: '/situation', meta: { title: '成绩情况' }, component: () => import('@/views/situation.vue') },
    { path: '/resolution', meta: { title: '常见问题' }, component: () => import('@/views/resolution.vue') },
    { path: '/one', meta: { title: '网络连接超时，出现转圈圈现象' }, component: () => import('@/views/one.vue') },
    { path: '/two', meta: { title: '电磁笔悬空写字或笔迹重叠分不开' }, component: () => import('@/views/two.vue') },
    {
      path: '/three',
      meta: { title: '学习本界面出现重叠，题目中的图片会变淡' },
      component: () => import('@/views/three.vue'),
    },
    {
      path: '/four',
      meta: { title: '打开作业界面，题目中的图片会变淡然后消失' },
      component: () => import('@/views/four.vue'),
    },
    {
      path: '/five',
      meta: { title: '机器出现卡顿，提交作业一直在转圈圈的界面，长时间不动' },
      component: () => import('@/views/five.vue'),
    },
    { path: '/six', meta: { title: '如何查看版本号' }, component: () => import('@/views/six.vue') },
    {
      path: '/seven',
      meta: { title: '打开作业时，只能看到老师的批改笔迹，看不到自己的笔迹' },
      component: () => import('@/views/seven.vue'),
    },
    {
      path: '/eight',
      meta: { title: '语文文言文断句或作业出现题目压着黑线，会丢失笔画' },
      component: () => import('@/views/eight.vue'),
    },
    {
      path: '/nine',
      meta: { title: '做作业的过程中，学习本出现闪退情况，重启后还是会出现' },
      component: () => import('@/views/nine.vue'),
    },
    { path: '/ten', meta: { title: '作业本状态提示' }, component: () => import('@/views/ten.vue') },
    { path: '/eleven', meta: { title: '订正规范要求' }, component: () => import('@/views/eleven.vue') },
    { path: '/pdf', meta: { title: '' }, component: () => import('@/views/pdf.vue') },
    {
      path: '/homework',
      meta: { title: '今日作业', keepAlive: true },
      component: () => import('@/views/homework.vue'),
    },
  ],
})
// const wx_user = {"accessToken":"33_62G4dM4zPD_bQwNcWES3vQ3WQmrI9f0Y1ESiSpqLZvQyJgeDT2Ow3qR39gorhRDLvEvYtcrzGrOetWFI_m8DEg","city":"Hefei","country":"CN","headImgUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ5qEHxjsCFDe9bZLF3GDNicaMz9K5aibHZAIJjQ9gcAM3qkr82s6N6GX2obhEmBAlbt1JmLiaMzO4tQ/132","nickname":"浮生未歇","openId":"C2712D6F50C270FBC5DD67430072ADFC4B74F6B883DF19D61CBF615B2BF4E746","privilegeList":[],"province":"Anhui","sex":1,"unionid":"4916FC69414389F8545C1DFCABF4AFC3F3B555B16AA5D997DE2E8C3AA7535913"}
// sessionStorage.setItem('wx_user',JSON.stringify(wx_user))

router.beforeEach(async (to, from, next) => {
  let _user = sessionStorage.getItem('wx_user')
  if (to.meta.title) document.title = to.meta.title

  // if (_user) {
  //   next()
  // } else {
  //   Http.get(`/wx/authorizeLO`).then(res => {
  //     let usermessage = res.data
  //     if (usermessage) {
  //       sessionStorage.setItem("wx_user", JSON.stringify(res.data));
  //     } else {
  //       Notify({ type: 'danger', message: '请重新授权' })
  //       // window.location.href =
  //       //   'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0391026943e96555&redirect_uri=http://h5.learnonly.com/auth&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect'
  //     }
  //   })
  // }
  if (_user) {
    next()
    return
  }
  const code = to.query.code // 截取url上的code ,可能没有,则返回''空字符串

  if (code) {
    console.log(`------------` + code)
    axios.get('/wx/getInfo3/?code=' + code).then((res) => {
      console.log(res)
      let { data } = res.data
      if (data) {
        sessionStorage.setItem('wx_user', JSON.stringify(data))
        next()
      }
    })
  } else {
    console.log(window.location.origin)
    console.log(to.fullPath)
    // 这个redirectUrl用 当前页路径或者tof.fullPath(将要进入的路径)
    let redirectUrl = window.location.href
    redirectUrl = encodeURIComponent(redirectUrl)
    console.log(redirectUrl)
    const appid = 'wx0391026943e96555'
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`
  }
})

export default router
