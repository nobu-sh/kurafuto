<template>
  <div class="dash">
    <div class="loading" v-if="loading">
      <img src="@/assets/loading.gif">
    </div>
    <div class="content" v-else>
      <h1>Dashboard</h1>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  width: 45px;
  height: 45px;
  margin: auto;
  position: relative;
  top: 20rem;
  img {
    width: 45px;
    height: 45px;
  }
}
</style>

<script>
  import Axios from 'axios'

  export default {
    data() {
      return {
        loading: true,
        username: null,
      }
    },
    mounted() {
      Axios({
        method: "get",
        url: "/api/isauth",
      }).then(res => {
        if (res.data.isAuth) {
          this.loading = false
          this.username = req.data.username
        } else {
          this.notAuth()
        }
      })
    },
    methods: {
      notAuth() {
        alert("You are not authorized to access this route!")
        this.$router.push("/")
      },
    },
  }
</script>
