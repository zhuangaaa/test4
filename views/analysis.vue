<template>
    <div class="joblist_container" :style="{height:clientHeight}">
        <div class="banner" ref="banner">
            <div class="banner_top">
                <img src="../assets/images/revisionHomeworkl.png" alt v-if="left == true" />
                <img src="../assets/images/revisionHomeworkr.png" alt v-if="right == true" />
                <!-- 为左边且已批改 -->
                <div v-if="left == true && state ==5">
                    <div class="percentag_one">
                        {{analysis.totalScore}}
                        <small>分</small>
                    </div>
                    <div class="percentag_two">
                        {{analysis.totalAnswerTime | toMin}}
                        <small>分钟</small>
                    </div>
                    <div class="percentag_three">{{analysis.correctRate}}</div>
                </div>
                <!-- 为右边且已批改，有返回数据 -->
                <div v-if="right == true && state ==5 && messages ==true ">
                    <div>
                        <div class="unrevision_time">{{unrevision.revisionCounts}}&nbsp;次</div>
                        <div class="unrevision_state">{{unrevision.revisionQuesCount}}/{{unrevision.allRevisionQuesCount}}&nbsp;题</div>
                    </div>
                </div>
                <!-- 为右边且已批改,没有返回数据 -->
                <div v-if="right == true && state ==5 && messages ==false" class="greenstatue">
                    <div>/</div>
                    <div>/</div>
                </div>
                <!-- 为左边且未批改 -->
                <div v-if="left == true && state !=5" class="bluestatue">
                    <div>/</div>
                    <div>/</div>
                    <div>/</div>
                </div>
                <!-- 为右边且未批改 -->
                <div v-if="right == true && state !=5" class="greenstatue">
                    <div>/</div>
                    <div>/</div>
                </div>
            </div>
            <van-tabs class="tab" background="rgba(0,0,0,0)" :color="'#fff'" @change="tab">
                <van-tab title="作业详情" class="liebiao"></van-tab>
                <van-tab title="订正详情" class="dingzheng"></van-tab>
            </van-tabs>
        </div>

        <div class="bigbox">
            <div v-if="left == true && state ==5" class="imagebox">
                <div v-for="(item,i) in picture" :key="i" class="image">
                    <img :src="item" alt />
                </div>
            </div>
            <div v-if="right == true && state ==5" class="listbox">
                <div v-if="lengths == true">
                    <img src="../assets/images/length.png" alt class="meiyou" />
                </div>
                <div v-if="lengths == false">
                    <div v-for="(item,i) in list" :key="i" class="bottomline">
                        <div class="title">第{{i+1}}题</div>
                        <van-swipe :autoplay="5000" :loop="false" indicator-color="#000">
                            <van-swipe-item v-for="(item2,i) in item.revisionPicList" :key="i">
                                <img :src="item2" ref="flie" alt />
                            </van-swipe-item>
                        </van-swipe>
                    </div>
                </div>
            </div>
            <div v-if="left == true && state !=5" class="nobox">
                <img src="../assets/images/lengths.png" alt class="meiyou" />
            </div>
            <div v-if="right == true && state !=5" class="nobox">
                <img src="../assets/images/length.png" alt class="meiyou" />
            </div>
        </div>
        <!-- 显示数据正在加载中 -->
        <div v-if="showpicture == true && state ==5" class="loading">
            <van-loading size="40px" text-size="20px" color="#1989fa">加载中...</van-loading>
        </div>
    </div>
</template>
  
<script>
// function onBridgeReady() {
//   this.WeixinJSBridge.call("hideOptionMenu");
// }
// if (typeof WeixinJSBridge == "undefined") {
//   if (document.addEventListener) {
//     document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
//   } else if (document.attachEvent) {
//     document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
//     document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
//   }
// } else {
//   onBridgeReady();
// }
export default {
    data () {
        return {
            state: this.$route.query.state,
            analysis: {},
            userid: this.$route.query.userId,
            exerciseid: this.$route.query.exerciseId,
            classid: this.$route.query.classId,
            picture: [], //左边总图片
            list: [], //右边图片
            unrevision: [], //右边数据
            clientHeight: "",
            left: true,
            right: false,
            lengths: false, //控制右边显示图片
            showpicture: true,
            messages: true //判段右边是否返回订正数据
        };
    },
    methods: {
        // 判断当前页面
        tab (e) {
            // console.log(e);
            if (e == 0) {
                this.picture = [];
                this.left = true;
                this.right = false;
                if (this.state != 5) {
                    console.log("未批改");
                } else {
                    this.anlyse();
                }
            } else {
                this.right = true;
                this.left = false;
                if (this.state != 5) {
                    console.log("未批改");
                } else {
                    this.lists();
                    this.listnumber();
                }
            }
        },
        // 作业列表
        async anlyse () {
            var res = await this.$http.get(
                `v1/dzb/latticepen/wechat/wxLearnonlyAnlyse`,
                {
                    params: {
                        userid: this.userid,
                        exerciseid: this.exerciseid
                    }
                }
            );
            this.analysis = res.data.date;
            this.showpicture = false;
            this.analysis.urlList.forEach(item => {
                for (let key in item) {
                    this.picture.push(item[key]);
                }
            });
        },
        // 订正详情图片
        async lists () {
            var res = await this.$http.get(`/v1/wx/wxQuestionHistoryPic`, {
                params: {
                    userid: this.userid,
                    exerciseid: this.exerciseid,
                    classid: this.classid
                }
            });
            this.list = res.data.data;
            if (this.list == undefined) {
                this.lengths = true;
            } else {
                this.lengths = false;
            }
        },
        // 订正详情数据
        async listnumber () {
            var res = await this.$http.get(`v1/app/revision/singlerevision`, {
                params: {
                    exerciseid: this.exerciseid,
                    classid: this.classid,
                    studentid: this.userid
                }
            });
            if (res.data.code == 200) {
                this.unrevision = res.data.data;
            } else {
                this.messages = false;
            }
        }
    },
    filters: {
        toMin (mss) {
            if (mss) return (mss / (1000 * 60)).toFixed(0);
        }
    },
    created () {
        this.anlyse();
        document.title = this.$route.query.title;
        this.clientHeight = `${document.documentElement.clientHeight}` + "px";
    },
    mounted () {
        document.getElementsByClassName("bigbox")[0].style.height =
            `${document.documentElement.clientHeight}` - 185 + "px";
    }
};
</script>

<style lang='less' scoped>
.joblist_container {
    height: 100%;
    position: absolute;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
.loading {
    position: fixed;
    top: 220px;
    left: 50%;
    width: 200px;
    transform: translateX(-100px);
    text-align: center;
}
.banner {
    // position: fixed;
    top: 0;
    left: 0;
    position: relative;
    z-index: 999;
}
.banner img {
    width: 100%;
    height: 180px;
}
.tab {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    z-index: 1000;
}
.littlebanner img {
    width: 100px;
    height: 38px;
}
.littlebanner img:nth-child(1) {
    position: absolute;
    top: 76px;
    left: 12px;
}
.littlebanner img:nth-child(2) {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50px);
}
.littlebanner img:nth-child(3) {
    position: absolute;
    top: 86px;
    right: 9px;
}
.percentag_one,
.percentag_two,
.percentag_three {
    color: #237afd;
    font-size: 25px;
    font-weight: 700;
}
.percentag_one,
.percentags_one {
    position: absolute;
    width: 80px;
    top: 140px;
    left: 50%;
    transform: translateX(-40px);
    text-align: center;
    small {
        font-size: 22px;
    }
}
.percentag_two,
.percentags_two {
    position: absolute;
    top: 140px;
    right: 15px;
    small {
        font-size: 22px;
    }
}
.percentag_three,
.percentags_three {
    position: absolute;
    top: 140px;
    left: 19px;
}
.bluestatue div:nth-child(1) {
    position: absolute;
    top: 142px;
    left: 50px;
}
.bluestatue div:nth-child(2) {
    position: absolute;
    top: 142px;
    left: 50%;
    text-align: center;
    width: 100px;
    transform: translateX(-50px);
}
.bluestatue div:nth-child(3) {
    position: absolute;
    top: 142px;
    right: 50px;
}
.bluestatue div {
    font-weight: 700;
    color: #237afd;
    font-size: 22px;
}
.greenstatue div:nth-child(1) {
    position: absolute;
    top: 142px;
    left: 80px;
}
.greenstatue div:nth-child(2) {
    position: absolute;
    top: 142px;
    right: 80px;
}

.greenstatue div {
    font-size: 22px;
    font-weight: 700;
    color: #209779;
}
.bigbox {
    width: 100%;
    overflow: scroll;
    position: fixed;
    left: 0;
    bottom: 0;
}
.imagebox {
    overflow-y: scroll;
}
.listbox img {
    width: 100%;
}
.listbox .meiyou,
.nobox .meiyou {
    display: block;
    margin: 100px auto 0;
    width: 200px;
}
.image img {
    width: 100%;
}
.bottomline {
    border-bottom: 2px solid #209779;
}
.bottomline .title {
    color: #209779;
    height: 38px;
    font-size: 20px;
    line-height: 30px;
    margin-left: 10px;
}
.unrevision_time {
    position: absolute;
    top: 141px;
    left: 68px;
    font-size: 25px;
    color: #209779;
    font-weight: 700;
}
.unrevision_state {
    position: absolute;
    top: 141px;
    right: 68px;
    font-size: 25px;
    color: #209779;
    font-weight: 700;
}
</style>
