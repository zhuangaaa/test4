<template>
    <div class="resolution_container" :style="{height:clientHeight}">
        <img src="../assets/images/resolutionBanner.png" alt="" class="resolutionBanner">
        <div class="internetProblem">
            <div class="internet_one">
                <img src="../assets/images/littleblue.png" alt="" class="internet_two">
                <div class="internet_three">网络问题</div>
            </div>
            <div class="internet_four" @click="one"> 
                <div class="internet_five">一、网络连接超时，出现转圈圈现象</div>
                <img src="../assets/images/click.png" alt="" class="internet_six">
            </div>
        </div>
        <div class="hardwareProblem">
            <div class="internet_one">
                <img src="../assets/images/littleblue.png" alt="" class="internet_two">
                <div class="internet_three">硬件问题</div>
            </div>
            <div class="hardware_one" @click="two">
                <div class="hardware_two">一、电磁笔悬空写字或笔迹重叠分不开</div>
                <img src="../assets/images/click.png" alt="" class="internet_six">
            </div>
            <div class="hardware_one" @click="three">
                <div class="hardware_two">二、学习本界面出现重叠，阴影现象</div>
                <img src="../assets/images/click.png" alt="" class="internet_six">
            </div>
            <div class="hardware_three" @click="four">
                <div class="hardware_four">三、打开作业界面，题目中的图片会变淡然后消失</div>
                <img src="../assets/images/click.png" alt="" class="hardware_five">
            </div>
            <div class="hardware_three" @click="five">
                <div class="hardware_four">四、机器出现卡顿，提交作业一直在转圈圈的界面，长时间不动</div>
                <img src="../assets/images/click.png" alt="" class="hardware_five">
            </div>
        </div>
        <div class="applicationProblem"> 
            <div class="internet_one">
                <img src="../assets/images/littleblue.png" alt="" class="internet_two">
                <div class="internet_three">软件应用问题</div>
            </div>
            <div class="hardware_one" @click="six">
                <div class="hardware_two">一、如何查看版本号</div>
                <img src="../assets/images/click.png" alt="" class="internet_six">
            </div>
            <div class="hardware_three" @click="seven"> 
                <div class="hardware_four">二、打开作业时，只能看到老师的批改笔迹，看不到自己的笔迹</div>
                <img src="../assets/images/click.png" alt="" class="hardware_five">
            </div>
            <div class="hardware_three" @click="eight"> 
                <div class="hardware_four">三、语文文言文断句或作业出现题目压着黑线，会丢失笔画</div>
                <img src="../assets/images/click.png" alt="" class="hardware_five">
            </div>
            <div class="hardware_three" @click="nine">
                <div class="hardware_four">四、做作业过程中，学习本出现闪退情况，重启后还是会出现</div>
                <img src="../assets/images/click.png" alt="" class="hardware_five">
            </div>
            <div class="hardware_one" @click="ten">
                <div class="hardware_two">五、作业状态提示</div>
                <img src="../assets/images/click.png" alt="" class="internet_six">
            </div>
            <div class="hardware_one" @click="eleven">
                <div class="hardware_two">六、订正规范要求</div>
                <img src="../assets/images/click.png" alt="" class="internet_six">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            clientHeight:'',
        };
    },

    methods: {
        one(){
            this.$router.push({
                path: "/one"
            })
        },
        two(){
            this.$router.push({
                path: "/two"
            })
        },
        three(){
            this.$router.push({
                path: "/three"
            })
        },
        four(){
            this.$router.push({
                path: "/four"
            })
        },
        five(){
            this.$router.push({
                path: "/five"
            })
        },
        six(){
            this.$router.push({
                path: "/six"
            })
        },
        seven(){
            this.$router.push({
                path: "/seven"
            })
        },
        eight(){
            this.$router.push({
                path: "/eight"
            })
        },
        nine(){
            this.$router.push({
                path: "/nine"
            })
        },
        ten(){
            this.$router.push({
                path: "/ten"
            })
        },
        eleven(){
            this.$router.push({
                path: "/eleven"
            })
        }
    },
    created(){
        this.clientHeight = `${document.documentElement.clientHeight}`+'px';
    },
};
</script>

<style scoped>
.resolution_container{
    background-color: #f5f5f5;
}
.resolutionBanner{
    width: 100%;
}
.internetProblem{
    background-color: #fff;
    margin:2px 0 6px;
}
.internet_one{
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #f5f5f5;
}
.internet_two{
    float: left;
    width: 6px;
    height: 20px;
    margin: 9px 6px 0 12px;
}
.internet_three{
    float: left;
    font-size: 18px;
    font-weight: 700;
}
.internet_four{
    line-height: 38px;
    height: 38px;
}
.internet_five{
    float: left;
    margin-left: 12px;
}
.internet_six{
    float: right;
    width: 16px;
    margin: 12px 9px 0 0 ;
}
.hardwareProblem{
    background-color: #fff;
}
.hardware_one{
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #f5f5f5;
}
.hardware_two{
    float: left;
    margin-left: 12px;
}
.hardware_three{
    height: 60px;
    border-bottom: 1px solid #f5f5f5;
}
.hardware_four{
    float: left;
    width: 80%;
    word-wrap:break-word;
    margin:9px 0 0 12px;
}
.hardware_five{
    float: right;
    width: 16px;
    margin: 24px 9px 0 0 ;
}
.applicationProblem{
    background-color: #fff;
    margin-top: 6px;
}
</style>
