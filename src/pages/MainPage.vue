<template>
  <div class="wrapper container-fluid">
    <div class="row pt-3" id="upper-row">
      <div class="col-3"><h1 class="title">Read Cat</h1></div>
      <div class="col-6" >
        <input type="text" v-model="fetch_url" placeholder="Copy the article url here, and click [Fetch] button">
        <button class="btn btn-sm btn-primary" @click="fetchArticle">Fetch</button>
        <span v-if="fetching">Fetching ...</span>
      </div>
      <div class="col-3">
        {{current_user.email}}
        <button class="btn btn-sm btn-danger" @click="logout">Logout</button>

        <button @click="$router.push('/vocabulary-list')">Vocabulary List</button>

        <select @change="loadWordsList" v-model="current_list_type">
          <option v-for="type in list_types" :value="type" :key="type">{{type}}</option>
        </select>
        <button @click="mark">Mark</button>
      </div>
    </div>
    <div class="row websites">
      <div class="col-12">
        <span class="website">News websites: </span>
        <a v-for="(url) in eng_sites" :key="url" :href="url" class="website" target="_blank">{{url}}</a>
      </div>
    </div>
    <div class="row" id="body-row">
      <div class="col-1 date-range column">
        <!--        show the last week-->
<!--        <div @click="loadList(null)" :class="!current_date ? 'active' : ''" class="date-item">All</div>-->
        <div v-for="(ele) in count_by_date" :key="ele[0]" @click="loadList(ele[0])" class="date-item"
             :class="current_date == ele[0] ? 'active' : ''">
          <span class="date">{{ ele[0] }}</span>
          <span class="count">{{ ele[1] }}</span>
        </div>
      </div>
      <div class="col-2 column">
        <div class="loading" v-if="loading_list">Loading...</div>
        <div class="articles" v-else>
          <div v-for="(article) in articles" :key="article.id" class="article" :class="current_article && current_article.id == article.id ? 'active' : ''"
               @click="loadArticle(article)">
            <!--            <a :href="article.url" target="article-content">{{article.title}}</a>-->
            <span class="title">{{ article.title }}</span>
            <!--            <span class="highlight">{{article.highlight}}</span>-->
            <div class="flex-row" style="display: flex;">
              <span class="date">{{ article.createdAt }}</span>
              <span class="flex-fill"></span>
              <span class="word_count">{{article.wordCount}}</span>
            </div>
          </div>
          <div class="article" v-if="articles.length < 1">
            No Articles!
          </div>
        </div>

      </div>
      <div class="col-6 col-article-content column">
          <div id="article-title" v-if="current_article">{{current_article.title}}</div>
          <div v-if="loading_content" class="loading">Loading</div>
          <div v-else id="article-content" class="mt-3" v-html="article_content"></div>
        <button id="article-del-btn" class="btn btn-danger" @click="deleteArticle">Delete</button>

      </div>
<!--      <vocabulary-master class="col-3 column">-->
<!--      </vocabulary-master>-->
      <explanation-panel class="col-3" :current_selected="current_selected"></explanation-panel>
    </div>
    <edit-bar @article_edit="article_edit=true"/>
  </div>
</template>
<script>
import axios from 'axios';
import EditBar from "./components/EditBar";
// import VocabularyMaster from "./components/VocabularyMaster";
import ExplanationPanel from "@/pages/components/ExplanationPanel";
// import config from "../config";
import loginApi from "../api/login"
import articleApi from "../api/articles"
import readApi from "../api/read"
import vocabularyApi from "@/api/vocabulary";

export default {
  name: "MainPage",
  components: {
    "edit-bar": EditBar,
    "explanation-panel": ExplanationPanel,
    // "vocabulary-master": VocabularyMaster
  },
  data() {
    return {
      fetch_url: null,
      active: true,
      articles: [],
      article_content: null,
      date_range: [],
      count_by_date: [],
      fetching: false,
      loading_list: false,
      loading_content: false,
      saving: false,
      current_date: null,
      current_article: null,
      current_selected: null,
      article_edit: false,
      show_edit_bar: false,
      edit_bar_pos: "",
      show_text_colors: true,
      show_bg_colors: true,
      current_user: {},
      eng_sites: [
        "https://www.telegraph.co.uk/",
        "https://www.mirror.co.uk/",
        "https://metro.co.uk/",
        "https://www.standard.co.uk/",
        "https://www.politics.co.uk/",
        "https://www.wired.co.uk",
        // "https://www.dailyrecord.co.uk/news/"
      ],
      list_types: ["A1", "A2", "B1", "B2", "C1", "awl"],
      current_list_type: "awl",
      words: []
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
  },
  mounted() {
    // var that = this
    // this.loadList()
    var today = new Date()
    for (var i = 0; i < 30; i++) {
      var date = new Date(today.getTime() - 3600 * 1000 * 24 * i);
      this.date_range.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
    }


    document.addEventListener("close", this.saveArticle)
    window.addEventListener('beforeunload', this.saveArticle);
    window.addEventListener("mouseup", this.mouseupHandler)

    this.refreshDate()
    var userstr = localStorage.getItem("user")
    if (userstr != null) {
      this.current_user = JSON.parse(userstr)
    }
    // axios.get(config.BASE_URL+ "/count_by_date").then(res => )
  },
  methods: {
    mouseupHandler() {
      let text = window.getSelection().toString().trim()
      if (text.length > 0)
        this.current_selected = text
    },
    login(){
      // var router = useRouter();
      this.$router.push('/login')
    },
    logout(){
      loginApi.logout()
      this.login()
    },
    refreshDate(){
      var that = this
      readApi.countByDate().then(res => {
        that.count_by_date = res.data
        // console.log(res)
        that.current_date = that.count_by_date[0][0]
        that.loadList(that.current_date)
      })
    },
    // BUG: edit bar show shown after fetch article
    fetchArticle(){
      var that = this
      that.fetching = true
      that.saveArticle()
      readApi.parse(this.fetch_url)
      // axios.get(config.BASE_URL+ "/parse?url=" + this.fetch_url)
          .then(res => {
        console.log(res.data)
        that.current_article = res.data

        // var date = new Date()
        // that.current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        // that.loadList(that.current_date)
        that.refreshDate()
        that.fetching = false
      })
    },

    saveArticle(){
      console.log("save article ")
      // var content = document.getElementById("article-content").outerHTML
      if (!this.current_article || !this.article_edit) return
      console.log("save article "+this.current_article.id)
      this.saving = true

      // let params = new FormData()
      // params.append('content', document.getElementById("article-content").innerHTML.toString())
      readApi.update(this.current_article.url,
          document.getElementById("article-content").innerHTML.toString())
      // axios.post(config.BASE_URL+ "/articles/"+this.current_article.id+"/content",
      //     params,
      //     {headers: {'Content-Type': 'multipart/form-data'}})
          .then(res => {
        console.log(res.data)
        this.saving = false
      })
    },

    loadList(date) {
      console.log("load list "+date)
      var that = this
      this.current_date = date
      this.loading_list = true
      this.saveArticle()
      articleApi.list(date).then(function (res) {
        // console.log(res.data[0]);
        console.log("load list ==== ")
        that.articles = res.data
        that.loading_list = false

        console.log("load article "+res.data[0].id)
        that.loadArticle(res.data[0])
      })
    },
    loadArticle(article) {
      console.log("load article ")
      var that = this
      this.loading_content = true
      this.saveArticle()
      this.current_article = article
      axios.get(article.url+"?t="+Math.random()).then(function (res) {
        // console.log(res.data);
        let html = res.data

        that.article_content = html
        that.loading_content = false
        that.article_edit = false
      })
    },
    deleteArticle(){
      var that = this
      articleApi.del(this.current_article.id).then(function (res) {
        console.log(res.data);
        // that.loadList(this.current_date)
        that.refreshDate()
      }).catch(function (err) {
        console.log(err);
      })
    },
    loadWordsList(){
      var that = this
      vocabularyApi.list(this.current_list_type)
          .then(function(res) {
            if (Array.isArray(res.data)) {
              that.words = res.data
            } else {
              that.words = Object.keys(res.data)
              // that.words_trans = res.data
            }
            console.log(that.words)
          })
    },
    mark(){
      if (this.words.length < 1) {
        return
      }
      let re = new RegExp(`(?<=>[^<]*)(\\b${this.words.join("\\b|\\b")}\\b)`, 'gi');
      this.article_content = this.article_content.replace(re, "<em>$1["+this.current_list_type+"]</em>")
      this.article_edit = true
    },
  }
}
</script>

<style lang="css" scoped>
/*@import "../css/bootstrap5.min.css";*/
/*@import "../css/bootstrap5-grid.min.css";*/
@import "../css/reader.css";
</style>


<style lang="scss" scopped>
@import "../scss/main";
</style>
