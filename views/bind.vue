<template>
    <div class="bind_container" :style="{height:clientHeight}">
        <img src="../assets/images/heard.png" class="heard">
        <div class="photo">
            <img :src="parentMessage.headImgUrl">
        </div>
        <div class="input">
            <div class="input_container">
                <img src="../assets/images/account.png" />
                <input type="text" placeholder="学生账号" class="content" v-model="nickname" />
            </div>
            <div class="input_container">
                <img src="../assets/images/password.png" class="icon" />
                <input type="password" placeholder="学生密码" class="content" v-model="password" />
            </div>
        </div>
        <van-button class="button" :disabled="disabled" @click="up">立刻绑定</van-button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            nickname: "",
            password: "",
            parentMessage: {}, //获取家长信息所有列表
            clientHeight: '',
            disabled: false
        };
    },
    methods: {
        async up () {
            this.disabled = !this.disabled
            for (let i = 0; i < this.$store.state.studentlists.length; i++) {
                console.log(this.nickname == this.$store.state.studentlists[i].nickName)
                if (this.nickname == this.$store.state.studentlists[i].nickName) {
                    this.$dialog
                        .alert({
                            message: "此学生已经绑定过,不可重复绑定"
                        })
                        .then(() => {
                            (this.nickname = ""), (this.password = "");
                        });
                    return;
                }
            }
            var res = await this.$http.post(`v1/dzb/latticepen/wechat/binding`, {
                OPENID: JSON.parse(sessionStorage.getItem('wx_user')).openId,
                unionid: JSON.parse(sessionStorage.getItem('wx_user')).unionid,
                nickname: this.nickname,
                password: this.password,
                appid: 101
            });
            if (res.data.date == "绑定成功") {
                this.$router.push("/");
            } else {
                this.$dialog
                    .alert({
                        message: "绑定学生失败,请重新绑定"
                    })
                    .then(() => {
                        (this.nickname = ""), (this.password = "");
                        this.disabled = !this.disabled
                    });
            }
        }
    },
    created () {
        this.parentMessage = JSON.parse(sessionStorage.getItem("wx_user"));
        this.clientHeight = `${document.documentElement.clientHeight}` + 'px';
    }
};
</script>

<style scoped>
.bind_container {
    height: 100%;
}
.heard {
    width: 100%;
}
.photo {
    position: absolute;
    top: 115px;
    left: 52%;
    transform: translateX(-40px);
    border-radius: 40px;
    width: 80px;
    height: 80px;
    background-color: pink;
}
.photo img {
    width: 100%;
    border-radius: 50%;
}
.input {
    margin-top: 20px;
}
.input_container {
    width: 340px;
    height: 40px;
    margin: 10px auto 0;
    display: block;
    border: 1px solid #d8d8d8;
    border-radius: 22px;
}
.input_container img {
    width: 20px;
    margin: 9px 19px;
    float: left;
}
.input_container .icon {
    margin-right: 21px;
}
.content {
    height: 20px;
    border: 0;
    outline: none;
    margin-top: 8px;
}
.button {
    background-color: #5986ff;
    border-radius: 22px;
    color: #fff;
    margin: 30px 17px 0 17px;
    width: 91%;
}
.van-button__text {
    font-size: 16px;
}
input::-webkit-input-placeholder {
    color: #a1a1a1;
}

input::-moz-placeholder {
    color: #a1a1a1;
}

input:-moz-placeholder {
    color: #a1a1a1;
}

input:-ms-input-placeholder {
    color: #a1a1a1;
}
</style>

