<template>
  <div class="p-3 border border-primary border-0">
    <div>
      <h1>Create Article</h1>
    </div>
    <div class="row mt-3">
      <span class="col-2">Title:</span>
      <input type="text" class="col-8" v-model="fetch_url" placeholder="Copy the article url here, and click [Fetch] button">
      <button class="btn-sm btn-primary col-1 mx-3" @click="fetchArticle">Fetch</button>
      <span v-if="fetching">Fetching ...</span>
      <hr class="mt-3">
    </div>
    <div class="row mt-3 ">
      <span class="col-2">Title:</span>
      <input type="text" class="input col-10" v-model="title">
    </div>
    <div class="row mt-3">
      <span class="col-2">Content:</span>
      <textarea rows="15" class="col-10" v-model="content"></textarea>
    </div>
    <div class="row mt-3">
      <span class="col-2">Word Count:</span>
      <span class="col-10" v-if="content">{{content.split(" ").length}}</span>
    </div>
    <div class="d-flex justify-content-end flex-row mt-3">
      <button class="btn-info btn-lg mx-3" @click="createArticle(true)">Save And Continue Create Article</button>
      <button class="btn-primary btn-lg" @click="createArticle(false)">Save Article</button>
    </div>
  </div>
</template>

<script>
import articleApi from "../api/articles";
import readApi from "@/api/read";

export default {
  name: "NewArticle",
  data(){
    return {
      title: null,
      author: null,
      content: null,
      fetching: false,

    }
  },
  methods: {
    createArticle(continue_create){
      let that = this

      articleApi.create({
        title: this.title,
        author: this.author,
        content: this.content
      }).then((resp)=>{
        console.log("create article success")
        console.log(resp)
        that.title = null
        that.author = null
        that.content = null
        if (!continue_create)
          this.$router.push("/review")
      }).catch((err)=>{
        console.log("create article error")
        console.log(err)
      })
    },
    fetchArticle(){
      var that = this
      that.fetching = true
      // that.saveArticle()
      readApi.parse(this.fetch_url)
          // axios.get(config.BASE_URL+ "/parse?url=" + this.fetch_url)
          .then(res => {
            that.$router.push("/review")
            console.log(res.data)
            // that.current_article = res.data

            // var date = new Date()
            // that.current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            // that.loadList(that.current_date)
            // that.refreshDate()
            // that.fetching = false
          })
    },
  }
}
</script>

<style scoped>

</style>
<style lang="scss" scopped>
@import "../scss/new-article";
</style>
