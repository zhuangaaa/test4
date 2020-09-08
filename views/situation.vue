<template>
  <div class="situation_container" :style="{height:clientHeight}">
    <div class="box">
      <div>
        <van-action-sheet
          v-model="show"
          :actions="actions"
          cancel-text="取消"
          @cancel="onCancel"
          @select="onSelect"
        />
        <div class="photo" @click="alertMenu">
          <img :src="this.photo" alt />
        </div>
        <div class="name" v-if="studentlists">{{this.nickname}}</div>
      </div>
      <div class="subject">
        <div class="subject-left">
          <van-field
            readonly
            clickable
            label="学科"
            :value="left"
            placeholder="选择学科"
            @click="activeSubject = true"
            class="left"
          />
          <van-popup v-model="activeSubject" position="bottom">
            <van-picker
              show-toolbar
              :columns="subject"
              @cancel="showPicker = false"
              @confirm="confimSubject"
            />
          </van-popup>
        </div>
        <div class="subject-right">
          <van-field
            readonly
            clickable
            label="时间"
            :value="right"
            placeholder="选择时间"
            @click="activeTime = true"
            class="right"
          />
          <van-popup v-model="activeTime" position="bottom">
            <van-picker
              show-toolbar
              :columns="time"
              @cancel="showPicker = false"
              @confirm="confimTime"
            />
          </van-popup>
        </div>
      </div>
    </div>
    <div class="content" :style="{height:Height}">
      <!-- 雷达图部分 -->
      <div class="radar" v-if="showpicture">
        <highcharts :options="optionAverage" v-if="optionAverage != ''"></highcharts>
      </div>
      <!-- 进度条部分  -->
      <div v-if="showpicture">
        <div class="progress-top">
          <div class="completion">
            <span>完成率:</span>
            <van-progress :percentage="completion" pivot-text />
          </div>
          <div class="consuming">
            <span>耗时时长:</span>
            <van-progress :percentage="consuming" pivot-text />
          </div>
        </div>
        <div class="progress-bottom">
          <div class="completion">
            <span>正确率:</span>
            <van-progress :percentage="rightRate" pivot-text />
          </div>
          <div class="consuming">
            <span>知识点掌握度:</span>
            <van-progress :percentage="degree" pivot-text />
          </div>
        </div>
      </div>
      <!-- 词云图 -->
      <div v-if="showpicture && showcloud == true" class="clouds">
        <p>词云图</p>
        <div>
          <highcharts :options="optionWord"></highcharts>
        </div>
      </div>
      <!-- 显示数据正在加载中 -->
      <div v-if="showpicture == false" class="loading">
        <van-loading size="30px" color="#1989fa">加载中...</van-loading>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      clientHeight: "",
      Height: "",
      studentlists: [],
      actions: [],
      photo: "", //学生当前头像
      nickname: "", //学生当前姓名
      classid: "", //当前班级id
      userid: "",
      stageId: "",
      show: false,
      endtime: moment().format("YYYY-MM-DD"), //今天
      startime: "",
      left: "", //学科
      right: "", //时间
      activeSubject: false,
      activeTime: false,
      subject: [], //学科
      time: ["一周", "一个月", "半学期", "一学期"], //时间
      optionAverage: [],
      optionWord: {},
      studentAnalyses: [],
      aveKnowledge: "", //知识点掌握度
      completion: 0, //完成率
      consuming: 0, //耗时时长
      rightRate: 0, //正确率
      degree: 0, //掌握度
      showpicture: false, //显示学情雷达报告图部分
      showcloud: false
    };
  },
  methods: {
    // 获取绑定学生信息
    async getStudets() {
      this.actions = [];
      this.$http
        .get(`v1/dzb/latticepen/wechat/getBindingInfo`, {
          params: {
            unionid: JSON.parse(sessionStorage.getItem("wx_user")).unionid,
            appid: 101
          }
        })
        .then(res => {
          this.studentlists = res.data.date;
          this.studentlists.forEach(item => {
            var obj = {
              name: item.studentName,
              avatar: item.avatar,
              classId: item.classId,
              className: item.className,
              orgId: item.orgId,
              orgName: item.orgName,
              studentId: item.studentId,
              stageId: item.stageId
            };
            this.actions.push(obj);
          });
          this.photo = this.studentlists[0].avatar; //当前头像
          this.nickname = this.studentlists[0].studentName; //当前名字
          this.userid = this.studentlists[0].studentId; //userid
          this.stageId = this.studentlists[0].stageId; //stageid
          this.classid = this.studentlists[0].classId;
          (this.right = this.time[0]), //显示右边默认选项
            this.$nextTick(function() {
              this.getSubject();
            });
        });
    },
    // 获取当前学生的学科
    async getSubject() {
      this.subject = [];
      var res = await this.$http.get(`v1/wx/getStudentsSubjects`, {
        params: {
          userid: this.userid
        }
      });
      res.data.data.forEach(item => {
        this.subject.push(item.name);
      });
      this.left = this.subject[0];
      this.$nextTick(function() {
        this.getMasteryDegree();
      });
    },
    // 获取数据
    async getAnalysis() {
      if (this.right == "一周") {
        this.startime = moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD");
      } else if (this.right == "一个月") {
        this.startime = moment()
          .subtract(1, "month")
          .format("YYYY-MM-DD");
      } else if (this.right == "半学期") {
        // 判断是否是上学期
        if (
          moment().format("02-15") < moment().format("MM-DD") &&
          moment().format("MM-DD") < moment().format("08-15")
        ) {
          this.startime = moment().format("YYYY-02-15");
          this.endtime = moment().format("YYYY-05-15");
        } else {
          this.startime = moment()
            .subtract(1, "years")
            .format("YYYY-08-15");
          this.endtime = moment().format("YYYY-01-15");
        }
      } else {
        // 判断是否是上学期
        if (
          moment().format("02-15") < moment().format("MM-DD") &&
          moment().format("MM-DD") < moment().format("08-15")
        ) {
          this.startime = moment().format("YYYY-02-15");
          this.endtime = moment().format("YYYY-08-14");
        } else {
          this.startime = moment()
            .subtract(1, "years")
            .format("YYYY-08-15");
          this.endtime = moment().format("YYYY-02-14");
        }
      }
      this.$http
        .get(
          "wx/classAnalyseStudent?studentid=" +
            this.userid +
            "&classid=" +
            this.classid +
            "&stageid=" +
            this.stageId +
            "&subjectname=" +
            this.left +
            "&startTime=" +
            this.startime +
            "&endTime=" +
            this.endtime
        )
        .then(res => {
          this.endtime = moment().format("YYYY-MM-DD");
          this.studentAnalyses = res.data.studentAnalysesList;
          this.optionAverage = {
            chart: {
              polar: true,
              type: "line"
            },
            title: {
              text: "学情报告雷达图",
              style: {
                color: "#6fa8f6",
                fontSize: "20px",
                fontWeight: "bold"
              },
              x: 0
            },
            pane: {
              size: "50%"
            },
            xAxis: {
              categories: [
                "完成率(%)",
                "耗时时长(分钟)",
                "正确率(%)",
                "知识点掌握度(%)"
              ],
              tickmarkPlacement: "on",
              lineWidth: 0
            },
            yAxis: {
              gridLineInterpolation: "polygon",
              lineWidth: 0,
              min: 0,
              max: 100
            },
            credits: {
              enabled: false //不显示水印
            },
            tooltip: {
              shared: true
              // pointFormat:
              //   '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },
            legend: {
              align: "right",
              verticalAlign: "top",
              y: 70,
              layout: "vertical"
            },
            series: [
              {
                showInLegend: false,
                name: "",
                data: [
                  res.data.studentAnalysesList[0].completeRate,
                  Number(
                    this.intoMin(
                      res.data.studentAnalysesList[0].comTakingTimeRate
                    )
                  ) > 100
                    ? 100
                    : Number(
                        this.intoMin(
                          res.data.studentAnalysesList[0].comTakingTimeRate
                        )
                      ),
                  Number(res.data.studentAnalysesList[0].rightRate),
                  +this.aveKnowledge
                ],
                pointPlacement: "on"
              }
            ]
          };
          console.log(res);
          this.showpicture = true;
          this.completion = Number(
            res.data.studentAnalysesList[0].completeRate
          );
          this.consuming =
            Number(
              this.intoMin(res.data.studentAnalysesList[0].comTakingTimeRate)
            ) > 100
              ? 100
              : Number(
                  this.intoMin(
                    res.data.studentAnalysesList[0].comTakingTimeRate
                  )
                );
          this.rightRate = Number(res.data.studentAnalysesList[0].rightRate);
          console.log(this.rightRate);
          console.log(this.consuming);
          console.log(this.completion);
          console.log(this.degree);
        });
    },
    // 获取知识点掌握度
    async getMasteryDegree() {
      if (this.right == "一周") {
        this.startime = moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD");
      } else if (this.right == "一个月") {
        this.startime = moment()
          .subtract(1, "month")
          .format("YYYY-MM-DD");
      } else if (this.right == "半学期") {
        // 判断是否是上学期
        if (
          moment().format("02-15") < moment().format("MM-DD") &&
          moment().format("MM-DD") < moment().format("08-15")
        ) {
          this.startime = moment().format("YYYY-02-15");
          this.endtime = moment().format("YYYY-05-15");
        } else {
          this.startime = moment()
            .subtract(1, "years")
            .format("YYYY-08-15");
          this.endtime = moment().format("YYYY-01-15");
        }
      } else {
        // 判断是否是上学期
        if (
          moment().format("02-15") < moment().format("MM-DD") &&
          moment().format("MM-DD") < moment().format("08-15")
        ) {
          this.startime = moment().format("YYYY-02-15");
          this.endtime = moment().format("YYYY-08-14");
        } else {
          this.startime = moment()
            .subtract(1, "years")
            .format("YYYY-08-15");
          this.endtime = moment().format("YYYY-02-14");
        }
      }
      var res = await this.$http.get(`wx/studentAnalyse`, {
        params: {
          studentid: this.userid,
          classid: this.classid,
          stageid: this.stageId,
          subjectname: this.left,
          startTime: this.startime,
          endTime: this.endtime
        }
      });
      console.log(res);
      console.log(res.data.knowledge);
      if (res.data.knowledge.length == 0) {
        this.showcloud = false;
      } else {
        this.showcloud = true;
      }
      // 标签云
      var cloudData = res.data.knowledge;
      this.optionWord = {
        title: {
          text: ""
        },
        chart: {
          backgroundColor: "#fff",
          type: "wordcloud"
        },
        credits: {
          enabled: false //不显示LOGO
        },
        series: [
          {
            name: "测评次数",
            data: cloudData
          }
        ]
      };
      this.endtime = moment().format("YYYY-MM-DD");
      this.aveKnowledge = res.data.aveKnowledge;
      this.degree = Number(res.data.aveKnowledge);
      this.$nextTick(function() {
        this.getAnalysis();
      });
    },
    // 弹出学生选项
    alertMenu() {
      this.show = true;
    },
    // 切换学生
    onSelect(item) {
      console.log(item);
      this.show = false;
      this.showpicture = false;
      this.photo = item.avatar;
      this.nickname = item.name;
      this.userid = item.studentId;
      this.stageId = item.stageId;
      this.classid = item.classId;
      this.getSubject();
    },
    onCancel() {
      console.log("点击了取消");
    },
    confimSubject(value) {
      console.log(value);
      this.left = value;
      this.activeSubject = false;
      this.showpicture = false;
      this.getMasteryDegree();
    },
    confimTime(value) {
      console.log(value);
      this.right = value;
      this.activeTime = false;
      this.showpicture = false;
      this.getMasteryDegree();
    },
    intoMin(i) {
      return (i / (1000 * 60)).toFixed(0);
    }
  },
  created() {
    this.clientHeight = `${document.documentElement.clientHeight}` + "px"; //获取屏幕高度
    this.Height = `${document.documentElement.clientHeight}` - 170 + "px";
    this.getStudets();
  }
};
</script>

<style lang='less' scoped>
.situation_container {
  overflow: hidden;
  width: 100%;
  background-image: url("../assets/images/background.png");
  background-size: cover;
}
.box {
  box-sizing: border-box;
  width: 100%;
  height: 170px;
  padding-top: 30px;
}
.photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: auto;
  img {
    width: 100%;
    border-radius: 50%;
  }
}
.name {
  width: 100px;
  height: 30px;
  margin: auto;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
}
.subject {
  overflow: hidden;
}
.subject-left {
  float: left;
  margin-left: 50px;
}
.subject-right {
  float: right;
  margin-right: 50px;
}
.content {
  background-color: #fff;
  width: 96%;
  overflow: scroll;
  border-radius: 10px;
  margin: auto;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.van-field {
  width: 110px;
}
.van-field__label {
  width: 44px;
  border: 1px solid #6fa8f6;
}
.left {
  outline: none;
  border-radius: 4px;
}
.right {
  outline: none;
  border-radius: 4px;
}
.progress-top {
  height: 56px;
}
.completion {
  margin-left: 10px;
  float: left;
  width: 40%;
  span {
    font-size: 12px;
    display: block;
    margin-bottom: 5px;
  }
}
.consuming {
  margin-right: 10px;
  float: right;
  width: 40%;
  span {
    font-size: 12px;
    display: block;
    margin-bottom: 5px;
  }
}
.van-progress {
  width: 100%;
}
.progress-bottom {
  height: 70px;
}
.loading {
  text-align: center;
  margin-top: 50px;
}
.clouds p {
  font-size: 16px;
  width: 100%;
  text-align: center;
  color: #6fa8f6;
  font-weight: 700;
}
</style>