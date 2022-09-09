<template>
  <div class="wrapper container-fluid">
    <div class="row pt-3" id="upper-row" v-if="0">
      <div class="col-3"><h1 class="title">Read Cat</h1></div>
      <div class="col-4" >
        <input type="text" v-model="fetch_url" placeholder="Copy the article url here, and click [Fetch] button">
        <button class="btn btn-sm btn-primary" @click="fetchArticle">Fetch</button>
        <span v-if="fetching">Fetching ...</span>
      </div>
<!--      <div class="col-2"><router-link to="/vocabulary-list">Vocabulary List</router-link></div>-->
    </div>
    <div class="row websites">
      <div class="col-12">
        <span class="website">News websites: </span>
        <a v-for="(url) in eng_sites" :key="url" :href="url" class="website" target="_blank">{{url}}</a>
      </div>
    </div>
    <div class="row" id="body-row">
      <div class="col-lg-1 col-md-2 date-range column">
        <!--        show the last week-->
<!--        <div @click="loadList(null)" :class="!current_date ? 'active' : ''" class="date-item">All</div>-->
        <div v-for="(ele) in count_by_date" :key="ele[0]" @click="loadList(ele[0])" class="date-item"
             :class="current_date == ele[0] ? 'active' : ''">
          <span class="date">{{ ele[0] }}</span>
          <span class="count badge rounded-pill bg-danger text-white">{{ ele[1] }}</span>
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
      <div class="col-lg-6 col-md-5 col-article-content column">
<!--          <div id="article-body">-->
            <div id="article-title" class="row">
              <span v-if="current_article" class="col-11">{{current_article.title}}</span>
              <div class="col-1"><button id="article-del-btn" class="btn btn-danger mr-3 mt-2" @click="deleteArticle">
                <font-awesome-icon icon="trash" />
              </button></div>
            </div>
            <div v-if="loading_content" class="loading">Loading</div>
            <div v-else id="article-content" class="pe-3 pb-5" v-html="article_content"></div>
<!--          </div>-->
          <div id="article-words" v-if="marked_words.length > 0">
<!--            {{marked_words.join(", ")}}-->
            <div>
              <button id="toggle" @click="toggleMarkedWords" class="btn btn-sml float-end pt-0 pb-0">
                <font-awesome-icon :icon="marked_words_style ? 'chevron-up' : 'chevron-down'" />
              </button>
              <div class="clearfix"></div>
            </div>
            <div id="article-words-content" class="p-2" :style="marked_words_style">
              <span class="mr-2" v-for="(word) in marked_words" :key="word" @click="goAnchor(word)">{{word}}, </span>
            </div>
          </div>

      </div>
      <div class="col-3">
        <div>
          <select @change="loadWordsList" v-model="current_list_type">
            <option v-for="type in list_types" :value="type" :key="type">{{type}}</option>
          </select>
          <button @click="mark">Mark</button>

        </div>
        <explanation-panel :current_selected="current_selected" :multi_langs="false"></explanation-panel>
      </div>

    </div>
    <edit-bar @article_edit="article_edit=true; refresh_marked_words()"/>
  </div>
</template>
<script>
import axios from 'axios';
import EditBar from "./components/EditBar";
// import VocabularyMaster from "./components/VocabularyMaster";
import ExplanationPanel from "@/pages/components/ExplanationPanel";
// import config from "../config";
import articleApi from "../api/articles"
import readApi from "../api/read"
import vocabularyApi from "@/api/vocabulary";
import common from "@/common";

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
      marked_words: [],
      marked_words_style: null,
      current_marked: null,
      words: []
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
      this.marked_words = []
      this.saveArticle()
      this.current_article = article
      axios.get(article.url+"?t="+Math.random()).then(function (res) {
        // console.log(res.data);
        let html = res.data

        that.article_content = html
        that.loading_content = false
        that.article_edit = false
        that.refresh_marked_words()
      })
    },
    deleteArticle(){
      if (!confirm("Are you sure to delete this article?")) return
      var that = this
      articleApi.del(this.current_article.id).then(function (res) {
        console.log(res.data);
        that.loadList(that.current_date)
        // that.refreshDate()
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
      this.article_content = this.article_content.replace(re, "<em id='em-$1'>$1["+this.current_list_type+"]</em>")
      this.article_edit = true

      this.refresh_marked_words()
    },
    refresh_marked_words(){
    //  call refresh marked words 500 ms
      let that = this
      // set timeout to let article_content update to dom
      setTimeout(function () {
        let marks = document.querySelectorAll('[class*="jr-"], em');
        let marked_words = []
        marks.forEach(function (mark) {
          if (!mark.textContent) return;
          // let id= mark.getAttribute("id")
          // if (id ){
          // FIXME, no need in production
          mark.setAttribute("id", common.string_prehandle(mark.textContent))
          // }
          marked_words.push(mark.textContent)
        });
        //remove same element in marked_words
        marked_words = Array.from(new Set(marked_words))
        that.marked_words = marked_words

      }, 500)
    },
    toggleMarkedWords(){
      this.marked_words_style = this.marked_words_style ? null : "height: 5em;"
    },
    goAnchor(e) {
      let word = common.string_prehandle(e)
      let mark = document.querySelector('#'+word);
      // if (!mark) {
      //   mark = document.querySelector("#em-" + word);
      // }
      if (!mark) return

      if (this.current_marked)
        this.current_marked.classList.remove("current-marked")

      mark.classList.add("current-marked")
      this.current_marked = mark

      mark.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      })
    }
  },
  watch: {
  },
  beforeUnmount() {
    console.log("======= before unmount")

    this.saveArticle();
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
