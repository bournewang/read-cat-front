<template>
  <div class="container-fluid">
    <div class="row no-gutter">

      <div class="col-md-6 d-none d-md-flex bg-image"></div>

      <div class="col-md-6 bg-light">
        <div class="login d-flex align-items-center py-5">

          <div class="container">
            <div class="row">
              <div class="col-lg-10 col-xl-7 mx-auto">
                <h3 class="display-4">Read Cat Login</h3>
                <!--                <p class="text-muted mb-4">Create a login split page using Reactjs & Bootstrap 5.</p>-->
                <form>
                  <div class="mb-3">
                    <input id="inputEmail" v-model="email" type="email" placeholder="Email address" required="" autofocus=""
                           class="form-control rounded-pill border-0 shadow-sm px-4"/>
                  </div>
                  <div class="mb-3">
                    <input id="inputPassword" v-model="password" type="password" placeholder="Password" required=""
                           class="form-control rounded-pill border-0 shadow-sm px-4 text-primary"/>
                  </div>
                  <div class="form-check">
                    <input id="customCheck1" type="checkbox" checked class="form-check-input"/>
                    <label for="customCheck1" class="form-check-label">Remember password</label>
                  </div>
                  <div class="d-grid gap-2 mt-2">
                    <button @click="login" class="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">
                      Sign in | on
                    </button>
                  </div>

                  <div class="text-center d-flex justify-content-between mt-4">
                    <p>Already have an account?
                      <router-link to="/login">Login</router-link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginApi from "../api/login"

export default {
  name: "RegisterPage",
  data(){
    return {
      email: null,
      password: null
    }
  },
  methods: {
    login(){
      console.log("email: "+this.email+", password: "+this.password)
      // let params = new FormData()
      // params.append('content', document.getElementById("article-content").innerHTML.toString())
      var that = this
      loginApi.register(this.email, this.password).then(res => {
        console.log(res.data)
        loginApi.setToken(res.data.id_token)
        loginApi.setUser({email: that.email})
        that.$router.push("/")
      })
    },
    goMain() {
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>
@import "../scss/login.scss";
</style>
