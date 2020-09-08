<template>
  <div class="pdf_container">
    <div class="box">
      <div v-for="(item,i) in answers" :key="i">
        <span class="title">第{{i+1}}题</span>
        <p v-html="item.stem"></p>
      </div>
    </div>
    <a class="button" :href="address" target="_blank">下载</a>
    <!-- 显示数据正在加载中 -->
    <div v-if="showpicture == true" class="loading">
      <van-loading size="40px" text-size="20px" color="#ffb081">加载中...</van-loading>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      root: process.env.VUE_APP_BASE_API,
      questionids: this.$route.query.questionid,
      exerciseid: this.$route.query.exerciseid,
      data: "",
      answers: [],
      address: "",
      showpicture: true,
    };
  },
  methods: {
    // 获取作业
    async gethomework() {
      var res = await this.$http.post(`v1/wx/loadques`, {
        data: this.data
      });
      res.data.forEach(item => {
        item.stem = item.stem.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function(match, capture) {
            // console.log(capture);
            return "<img src=https://edu.celianyi.com" + capture +" style='width: 100%'>";
          }
        );
        // console.log(item.stem);
      });
      this.answers = res.data;
      this.showpicture = false;
    },
    // 获取下载地址
    async download() {
      var res = await this.$http.post(
        `v1/wx/generateWordPage`,
        {
          exerciseid: this.exerciseid
        }
      );
      this.address = res.data.data;
    }
  },
  created() {
    document.title = this.$route.query.title;
    this.data = this.questionids.join(",");
    this.gethomework();
    this.download();
  },
  mounted() {
    const MathJax = document.createElement("script");
    MathJax.type = "text/javascript";
    MathJax.src =
      "http://mathjax.celianyi.com/MathJax.js?config=TeX-MML-AM_SVG";
    document.head.appendChild(MathJax);
    const MLCore = document.createElement("script");
    MLCore.type = "text/javascript";
    MLCore.src =
      "http://www.celianyi.com/assets/js/libs/MLCore-2016.08.15.min.js?2019050809";
    document.head.appendChild(MLCore);
  },
  updated() {
    // console.log(window);
    if (window.MathJax) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
    if (window.renderLatex) {
      if (this.$refs.contentQ)
        this.$refs.contentQ.forEach(q => {
          window.renderLatex(q);
        });
    }
  }
};
</script>

<style lang='less' scoped>
.pdf_container {
  background-color: #f5f5f5;
  overflow: hidden;
}
.loading {
  position: fixed;
  top: 200px;
  width: 200px;
  left: 50%;
  transform: translateX(-100px);
  text-align: center;
}
.box {
  margin: 10px 10px 50px 10px;
}
p {
  padding: 8px;
  margin-top: 0;
  background-color: #fff;
  margin-bottom: 0;
}
.button {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  color: #fff;
  background-color: #1db4fe;
  border-radius: 5px 5px 0 0;
  text-align: center;
  line-height: 40px;
}
.title {
  display: inline-block;
  width: 100%;
  color: #1db4fe;
  height: 40px;
  line-height: 40px;
  background-color: #e5eef2;
  text-align: center;
}
// question style 2020年3月27日14:12:43
/*空标记*/
.bk {
  /*white-space: nowrap;*/ /*强制不换行*/
}
/*短实线空*/
.bk-l-s {
  display: inline-block;
  width: 100px;
  border-bottom: 1px solid #000;
  text-align: center;
}
/*中实线空*/
.bk-l-m {
  display: inline-block;
  width: 300px;
  border-bottom: 1px solid #000;
  text-align: center;
}
/*长实线空*/
.bk-l-l {
  display: inline-block;
  width: 100%;
  border-bottom: 1px solid #000;
  text-align: center;
}

/*短虚空*/
.bk-vl-s {
  display: inline-block;
  width: 100px;
  /*border-bottom:1px solid #000;*/
  text-align: center;
}
/*中虚空*/
.bk-vl-m {
  display: inline-block;
  width: 300px;
  /*border-bottom:1px solid #000;*/
  text-align: center;
}
/*长虚空*/
.bk-vl-l {
  display: inline-block;
  width: 100%;
  /*border-bottom:1px solid #000;*/
  text-align: center;
}

/*括号空*/
.bk-b-s {
  display: inline-block;
  width: 100px;
  text-align: center;
}

/*方格空*/
.bk-s-s {
  display: inline-block;
  margin: 1px;
  width: 1em;
  height: 1em;
  border: 1px solid #000;
  text-align: center;
  vertical-align: text-bottom;
}

/*圆圈空*/
.bk-c-s {
  display: inline-block;
  margin: 1px;
  width: 1em;
  height: 1em;
  border: 1px solid #000;
  border-radius: 100%;
  text-align: center;
  vertical-align: text-bottom;
}

.bk-number {
  line-height: 1em;
}

table.normal td,
table.sq table.normal td {
  border: 1px solid #000;
}

table.sq {
  width: 100%;
  border: 0;
}

table.sq td {
  border: 0;
}

td.sq-num {
  width: 30px;
  min-width: 30px;
  /*display: block;*/
  text-align: center;
  /*font-weight:bold;*/
  vertical-align: text-top;
}
td.sq-content {
  vertical-align: text-top;
  width: 100%;
}

table.og-1,
table.og-2,
table.og-3,
table.og-4 {
  width: 100%;
  border: 0;
}

td.op-label {
  width: 2%;
  min-width: 2%;
  color: #000;
  /*font-weight:bold;*/
  vertical-align: text-top;
}

table.og-1 td.op-content {
  width: 97%;
}
table.og-2 td.op-content {
  width: 47%;
}
table.og-3 td.op-content {
  width: 30.333%;
}
table.og-4 td.op-content {
  width: 22%;
}
td.op-content {
  vertical-align: text-top;
}

table.og-1 td,
table.og-2 td,
table.og-3 td,
table.og-4 td {
  border: 0;
}

.media-voice {
  display: none;
}

.og {
}

.op {
  border: 1px solid #000;
  display: inline-block;
  text-align: center;
}

/*兼容以前试题2019*/
table.math_eq {
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: normal;
  font-size: inherit;
  _font-size: 100%;
  font-style: normal;
  font-weight: normal;
  border: 0;
  float: none;
  display: inline-block;
  zoom: 0;
}
table.edittable {
  border-collapse: collapse;
  text-align: center;
  margin: 2px;
}
table.edittable td,
table.edittable th {
  line-height: 30px;
  padding: 5px;
  white-space: normal;
  word-break: break-all;
  border: 1px solid #000;
  vertical-align: middle;
}
table.composition {
  border-collapse: collapse;
  text-align: left;
  margin: 2px;
  width: 98%;
}
table.composition td,
table.composition th {
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border-width: 0;
  vertical-align: middle;
}
table.composition2 {
  border-collapse: collapse;
  width: auto;
}
table.composition2 td,
table.composition2 th {
  text-align: left;
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border: none;
  border-width: 0;
  vertical-align: middle;
}
</style>
