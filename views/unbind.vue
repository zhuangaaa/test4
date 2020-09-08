<template>
    <div class="unbind_container" :style="{height:clientHeight}">
        <div class="photo">
            <div class="parent">
                <div class="parent_photo">
                    <img :src="this.$store.state.user.headImgUrl" alt="">
                </div>
                <span>{{this.$store.state.user.nickname}}</span>
            </div>
            <img src="../assets/images/contact.png" class="contact" />
            <van-uploader :after-read="afterRead" accept="image/*" :before-read="beforeRead">
                <div class="student">
                    <div class="student_photo">
                        <img :src="$route.query.avatar" alt />
                    </div>
                    <span>{{$route.query.studentName}}</span>
                </div>
            </van-uploader>
            <!-- <input type="file" accept="image/*" @change="handleFile" class="hiddenInput"/> -->
        </div>
        <div class="student_message">学生信息:</div>
        <div class="messages">
            <div>
                <span>姓名:</span>
                <span>&nbsp;&nbsp;&nbsp;{{$route.query.studentName}}</span>
            </div>
            <div>
                <span>账号:</span>
                <span>&nbsp;&nbsp;&nbsp;{{$route.query.nickName}}</span>
            </div>
            <div>
                <span>学校:</span>
                <span>&nbsp;&nbsp;&nbsp;{{$route.query.orgName}}</span>
            </div>
            <div>
                <span>班级:</span>
                <span>&nbsp;&nbsp;&nbsp;{{$route.query.className}}</span>
            </div>
        </div>
        <van-button size="large" class="button" @click="remove">解除绑定</van-button>
    </div>
</template>

<script>

export default {
    data () {
        return {
            userid: this.$route.query.studentId,
            headers: {
                authorization: this.$store.getters.token
            },
            clientHeight:'',
        };
    },

    methods: {
        remove () {
            this.$dialog.alert({
                title: "提示", //加上标题
                message: "是否解除绑定此学生", //改变弹出框的内容
                showCancelButton: true //展示取水按钮
            })
            .then(async() => { 
                var res = await this.$http.get(`v1/dzb/latticepen/wechat/remove`, {
                params: {
                    userid: this.userid,
                    OPENID:JSON.parse(sessionStorage.getItem('wx_user')).openId,
                    appid:101
                }
            })
            if (res.data.date == "解除绑定成功") {
                this.$router.push("/");
            } else {
                this.$dialog
                    .alert({
                        message: "解除绑定学生失败,请重新绑定"
                    })
                }
            })
            .catch(() => { 
                this.$router.push("/");
            })
           
        },
        beforeRead (file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                this.$toast('请上传 jpg/png 格式图片')
                return false;
            }
            let isLt1M = file.size / 1024 / 1024 <= 1
            if (!isLt1M) {
                this.$toast('图片大小1M以内')
                return false
            }
            return true;
        },
        async afterRead(file){
            console.log(file)
            // console.log(file.file)
            let params = new FormData(); //创建form对象
            params.append("file", file.file);
            params.append("userid", this.userid);
            console.log(params.getAll("file"))
            var xhr = new XMLHttpRequest();
            xhr.open("post","https://edu.celianyi.com/api/v1/app/account/upload");
            xhr.send(params);
            this.$router.push("/");
        },
    },
    created(){
        this.clientHeight = `${document.documentElement.clientHeight}`+'px';
    },
};
</script>

<style scoped>
.unbind_container {
    background-color: #f5f5f5;
}
.photo {
    height: 110px;
    padding-top: 30px;
}
.parent,
.student {
    float: left;
    height: 90px;
    width: 62px;
}
.parent {
    margin-left: 91px;
}
.parent_photo,
.student_photo {
    width: 59px;
    height: 59px;
    border-radius: 50%;
}
.parent_photo img{
    border-radius: 50%;
    width: 59px;
    height: 59px;
}
.student_photo img {
    border-radius: 50%;
    width: 59px;
    height: 59px;
}
.photo span {
    display: block;
    color: #a1a1a1;
    text-align: center;
    font-size: 12px;
    margin: 15px 6px 0;
}
.contact {
    float: left;
    margin: 24px 16px 0;
    display: block;
}
.student_message {
    margin-left: 18px;
    font-size: 15px;
    font-weight: 700;
}
.messages {
    height: 120px;
    width: 340px;
    margin: 10px auto 25px;
    border-radius: 7px;
    background-color: white;
}
.messages div {
    margin: 8px 0 10px 15px;
}
.messages span {
    font-size: 12px;
}
.button {
    width: 340px;
    display: block;
    margin: 0 auto 25px;
    border-radius: 7px;
    color: white;
    background-color: #777;
}
.hiddenInput{
  display: none;
}
</style>
