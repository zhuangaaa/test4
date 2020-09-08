import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'

import './plugins/vant.js'
import 'vant/lib/index.css'
import './assets/css/global.css'

import http from './utils/http'

import Highcharts from 'highcharts'
import VueHighcharts from 'vue-highcharts'
import wordcloud from 'highcharts/modules/wordcloud'
import funnel from 'highcharts/modules/funnel'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge'
wordcloud(Highcharts);
funnel(Highcharts);
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
Vue.use(VueHighcharts);

import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn");
Vue.prototype.$moment = moment

Vue.prototype.$http = http
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
