<template>
  <div class="personal_container" :style="{height:mainHeight}">
    <img src="../assets/images/banner.png" class="banner" />
    <div class="content" :style="{height:contentHeight}">
      <div class="phpto_content">
        <div class="photo"> 
          <img :src="parentMessage.headImgUrl">
        </div>
        <div class="parent_name">{{parentMessage.nickname}}</div>
      </div>
      <div class="student_content">
        <div
          class="student_message"
          v-for="(item , i) in studentlists"
          :key="i"
          @click="goUnbind(item)"
        >
          <div class="student_photo">
            <img :src="item.avatar" />
          </div>
          <div class="student_name">
            <div class="name">{{item.studentName}}</div>
            <div class="class">{{item.className}}</div>
          </div>
          <div class="school">
            <div>{{item.orgName}}</div>
          </div>
        </div>
      </div>
      <div class="click" @click="goBind">
        <span>绑定学生</span>
        <img src="../assets/images/arrow.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      parentMessage:{}, //获取家长信息所有列表
      studentlists: [], //学生列表信息列表
      result: {} //请求微信授权获取的数据
    };
  },
  methods: {
    // 获取绑定学生信息
    async getStudets() {
      var res = await this.$http.get(`v1/dzb/latticepen/wechat/getBindingInfo`,{
        params:{
          unionid: JSON.parse(sessionStorage.getItem('wx_user')).unionid,
          appid:101
        }
      })
      console.log(res)
      sessionStorage.setItem("token", res.data.token)
      this.studentlists = res.data.date
      console.log(this.studentlists)
      this.$store.commit("SET_STUDENT", this.studentlists);
    },
    // 去绑定
    goBind() {
      this.$router.push({
        path: "/bind"
      });
    },
    // 去解绑
    goUnbind(item) {
      this.$router.push({
        path: "/unbind",
        query: item
      });
    },
  },
  beforeCreate() {
 
  },
  created() {
    this.parentMessage = JSON.parse(sessionStorage.getItem("wx_user")); 
    this.clientHeight = `${document.documentElement.clientHeight}`; 
    this.$store.commit("SET_USER", this.parentMessage);
    this.$store.commit("SET_OPENID", this.parentMessage.openId);
    this.$store.commit("SET_UNIONID", this.parentMessage.unionid);
    this.$store.commit("SET_CLIENTHEIGHT", this.clientHeight);
    this.getStudets() //获取学生信息
  },
  computed: {
    mainHeight() {
      return this.$store.state.clientHeight + "px";
    },
    contentHeight() {
      return this.$store.state.clientHeight - 120 + "px";
    }
  }
};
</script>

<style lang='less' scoped>
.personal_container {
  height: 100%;
  width: 100%;
}
.banner {
  width: 100%;
}
.content {
  position: absolute;
  top: 120px;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 25px 25px 0 0;
  background-color: #fff;
}
.phpto_content {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 200px!important;
  height: 95px;
  text-align: center;
}
.phpto_content .photo{
  text-align: center;
}

.photo img{
  border: 1px solid white;
  border-radius: 50%;
  width: 63px;
  height: 63px;
}
.parent_name {
  font-size: 14px;
}
.student_content {
  margin-top: 80px;
}
.student_message {
  width: 350px;
  height: 72px;
  border-radius: 5px;
  margin: 0 auto 10px;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 3px #f0f0f0;
}
.student_photo {
  float: left;
  width: 42px;
  height: 42px;
  margin-right: 15px;
  border-radius: 50%;
}
.student_photo img {
  width: 42px;
  height: 42px;
}
.student_name {
  float: left;
}
.name {
  font-size: 14px;
}
.class {
  height: 16px;
  line-height: 16px;
  width: 81px;
  font-size: 12px;
  color: #fff;
  border-radius: 3px;
  margin-top: 6px;
  background-color: #76caf5;
}
.school {
  color: #a1a1a1;
  font-size: 14px;
  float: right;
  margin-top: 10px;
  width: 140px;
}
.school div{
  text-align: right;
  width: 140px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.click {
  height: 30px;
  margin: 35px 15px 0;
}

.click span {
  float: left;
  display: block;
  margin-top: 6px;
  font-weight: 700;
}
.click img {
  float: right;
}
</style>
