<template>
    <div class="joblist_container" :style="{height:mainHeight}">
        <div v-if="judgement == false">
            <img src="../assets/images/reproduction.png" alt class="reproduction" />
        </div>
        <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh" v-if="judgement == true">
            <van-list v-model="isUpLoading" :finished="upFinished" :offset="10" finished-text="我是有底线的" :immediate-check="false" @load="onLoadList">
                <van-cell class="vanList" v-for="(item,i) in getexerciseLists" :key="i" @click="goAnalysis(item)">
                    <div class="top">
                        <div class="top-content">
                            <!--左边部分 -->
                            <div class="first">
                                <div>
                                    <img src="../assets/images/languages.png" alt v-if="item.subjectId == 1" />
                                    <img src="../assets/images/math.png" alt v-if="item.subjectId == 2" />
                                    <img src="../assets/images/english.png" alt v-if="item.subjectId == 3" />
                                    <img src="../assets/images/physis.png" alt v-if="item.subjectId == 4" />
                                    <img src="../assets/images/chemistry.png" alt v-if="item.subjectId == 5" />
                                    <img src="../assets/images/biology.png" alt v-if="item.subjectId == 6" />
                                    <img src="../assets/images/politics.png" alt v-if="item.subjectId == 7" />
                                    <img src="../assets/images/history.png" alt v-if="item.subjectId == 8" />
                                    <img src="../assets/images/geography.png" alt v-if="item.subjectId == 9" />
                                </div>
                                <div>{{item.title}}</div>
                            </div>
                            <div class="class">{{item.className}}</div>
                            <div class="two">
                                <div>题数:{{item.totalQuestionCount}}题</div>
                                <div>截止时间:{{item.pushData}}</div>
                            </div>
                            <!-- 右边部分 -->
                            <!-- 判断为未批改 -->
                            <div v-if="item.state == 0">
                                <img src="../assets/images/newjob.png" alt class="no" />
                                <img :src="item.avatar" alt class="photo" />
                            </div>
                            <!-- 判断未提交 -->
                            <div v-if="item.state <= 2">
                                <img src="../assets/images/submit.png" alt class="no" />
                                <img :src="item.avatar" alt class="photo" />
                            </div>
                            <!-- 判断新作业 -->
                            <div v-if="item.state == 3">
                                <img src="../assets/images/submitted.png" alt class="no" />
                                <img :src="item.avatar" alt class="photo" />
                            </div>
                            <!-- 判断为已批改 -->
                            <div v-if="item.state == 5 && item.correctview == 1">
                                <div class="personalscore">{{isInteger(item.personalScore)}}</div>
                                <img src="../assets/images/fen.png" class="fen" />
                                <img src="../assets/images/two.png" class="yes" />
                                <img :src="item.avatar" alt class="photo" />
                            </div>
                        </div>
                    </div>
                    <!-- 下边部分 -->
                    <div class="bottom" v-if="item.state == 5">
                        <div class="cuotilv">
                            <img src="../assets/images/cuotilv.png" />
                            <span>错题数:{{item.wrongQuestionCount}}题</span>
                        </div>
                        <div class="haoshi">
                            <img src="../assets/images/haoshi.png" />
                            <span>耗时:{{item.consumingTime | toMin}}</span>
                        </div>
                        <div class="all">
                            <img src="../assets/images/ave.png" />
                            <span>班均分:{{aaa(item.aveClassScore)}}分</span>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
export default {
    data () {
        return {
            pageSize: 10, // 每页条数
            page: 1, // 页码
            getexerciseLists: [], //作业列表
            isDownLoading: false, // 下拉刷新
            isUpLoading: false, // 上拉加载
            upFinished: false, // 上拉加载完毕
            offset: 100, // 滚动条与底部距离小于 offset 时触发load事件
            judgement: true, //判断是否绑定学生,显示页面
            scrollTop: 0
        };
    },
    beforeRouteLeave (to, from, next) {
        this.scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        next();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            document.body.scrollTop = vm.scrollTop;
        });
    },
    methods: {
        async getStudets () {
            var res = await this.$http.get(
                `v1/dzb/latticepen/wechat/getBindingInfo`,
                {
                    params: {
                        unionid: JSON.parse(sessionStorage.getItem("wx_user")).unionid,
                        appid: 101
                    }
                }
            );
            console.log(res.data.date);
            if (res.data.date.length == 0 || JSON.stringify(res.data.date) == "{}") {
                this.judgement = false;
            } else {
                this.getexerciseList();
            }
        },
        // 获取列表信息
        getexerciseList () {
            const _this = this;
            _this.$http
                .get(`v1/dzb/latticepen/wechat/exerciseList`, {
                    params: {
                        OPENID: JSON.parse(sessionStorage.getItem("wx_user")).openId,
                        page: _this.page,
                        appid: 101
                    }
                })
                .then(res => {
                    console.log(res.data.date.studentExerciseVos);
                    if (res.data.code == 200) {
                        const rows = res.data.date.studentExerciseVos;
                        if (rows == null || rows.length === 0) {
                            _this.upFinished = true; //加载结束
                            return;
                        }
                        if (rows.length < this.pageSize) {
                            _this.upFinished = true; //最后一页不足10条的情况
                        }
                        //处理数据
                        if (_this.page === 1) {
                            _this.getexerciseLists = rows;
                        } else {
                            _this.getexerciseLists = _this.getexerciseLists.concat(rows);
                        }
                    }
                })
                .finally(() => {
                    _this.isDownLoading = false;
                    _this.isUpLoading = false;
                });
        },
        onDownRefresh () {
            this.page = 1;
            this.upFinished = false;
            this.getexerciseList();
        },
        // 上拉加载请求方法
        onLoadList () {
            this.page++;
            this.getexerciseList();
        },
        // 跳转到作业分析页面
        goAnalysis (item) {
            var que = item.questionIds;
            var exe = item.exerciseId;
            var tit = item.title;
            if (item.state < 3) {
                this.$router.push({
                    path: "/pdf",
                    query: { questionid: que, exerciseid: exe, title: tit }
                });
            } else {
                this.$router.push({
                    path: "/analysis",
                    query: item
                });
            }
        }
    },
    filters: {
        toMin (mss) {
            if (mss) return (mss / (1000 * 60)).toFixed(0) + "分钟";
        }
    },
    created () {
        this.getStudets();
        this.clientHeight = `${document.documentElement.clientHeight}`;
    },

    computed: {
        mainHeight () {
            return this.$store.state.clientHeight + "px";
        },
        aaa () {
            return function (i) {
                return i.toFixed(2);
            };
        },
        isInteger () {
            return function (i) {
                if (i % 1 == 0) {
                    return i;
                } else {
                    return i.toFixed(2);
                }
            };
        }
    }
};
</script>

<style lang='less' scoped>
.joblist_container {
    background-color: #f5f5f5;
}
.reproduction {
    width: 100%;
}
.top {
    overflow: hidden;
    height: 112px;
    background-color: #fff;
}
.top-content {
    width: 97%;
    height: 93px;
    background-color: #f6f5f8;
    margin-top: 9px;
    margin-left: 4px;
    border-radius: 7px;
}
.first {
    overflow: hidden;
    margin-left: 13px;
    height: 30px;
}
.first div:nth-child(1) {
    float: left;
}
.first div:nth-child(1) img {
    width: 25px;
    height: 25px;
    margin-top: 4px;
}
.first div:nth-child(2) {
    float: left;
    font-size: 20px;
    font-weight: 700;
    margin-top: 5px;
    margin-left: 7px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 210px;
}
.class {
    font-size: 14px;
    color: #353535;
    margin-top: 6px;
    margin-left: 14px;
}
.two {
    overflow: hidden;
    color: #757575;
    margin-left: 13px;
    margin-top: 4px;
}
.two div:nth-child(1) {
    float: left;
    width: 90px;
}
.two div:nth-child(2) {
    float: left;
}
.no {
    width: 60px;
    height: 36px;
    position: absolute;
    top: 15px;
    right: 13px;
}
.photo {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    position: absolute;
    top: 55px;
    right: 24px;
}
.personalscore {
    margin: 0;
    padding: 0;
    color: #ff122d;
    position: absolute;
    top: 14px;
    right: 35px;
    font-size: 19px;
    font-weight: 600;
}
.fen {
    position: absolute;
    top: 22px;
    width: 13px;
    height: 12px;
    right: 22px;
}
.yes {
    width: 42px;
    height: 12px;
    position: absolute;
    top: 38px;
    right: 22px;
}
.bottom {
    display: flex;
    justify-content: space-between;
    margin-left: 14px;
    width: 332px;
    height: 30px;
    line-height: 28px;
    border-top: 1px solid #ededed;
}
.bottom img {
    width: 15px;
    height: 15px;
}
.all img,
.cuotilv img,
.haoshi img {
    float: left;
    margin-top: 6px;
    margin-right: 5px;
}
.all span,
.cuotilv span,
.haoshi span {
    float: left;
}
</style>
