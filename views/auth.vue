<template>
    <div>

    </div>
</template>

<script>
export default {
    data () {
        return {};
    },
    beforeCreate () {
        if (this.$route.query.code) {
            this.$http
                .get("/wx/getInfo3/?code=" + this.$route.query.code)
                .then(res => {
                    console.log(res)
                    let { data } = res.data;
                    if (data) {
                        sessionStorage.setItem("wx_user", JSON.stringify(data));
                        let url = sessionStorage.getItem("beforeUrl")
                            ? sessionStorage.getItem("beforeUrl")
                            : "/"
                        this.$router.push(url)
                    }
                })
        }
    },

};
</script>