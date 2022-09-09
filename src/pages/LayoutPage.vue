<template>
  <div>
    <div class="d-flex flex-row align-items-center border-2 border-primary">
      <h1 class="">IELTS READING GURU</h1>
      <div class="flex-grow-1"></div>
      <router-link to="/" class="pe-3">Reading</router-link>
      <router-link to="/vocabulary-list" class="pe-3 ">Vocabulary</router-link>
      {{current_user.username}}
      <button class="btn btn-sm btn-danger" @click="logout">Logout</button>


      <div class="clearfix"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import loginApi from "@/api/login";

export default {
  name: "LayoutPage",
  data(){
    return {
      current_user: {},
    }
  },
  created() {
    console.log("vue created =====")
    //  check login
    console.log("login token: "+loginApi.token())
    if (!loginApi.token()) {
      console.log("token is null, goto login")
      this.$router.push("/login")
    }else{
      console.log("token is not null, continue")
    }

    var userstr = localStorage.getItem("user")
    if (userstr != null) {
      this.current_user = JSON.parse(userstr)
    }
  },
  methods: {
    logout(){
      loginApi.logout()
      this.$router.push("/login")
    },
  }
}
</script>

<style scoped>
</style>
