<template>
  <div class="wrapper container-fluid">
    <div class="row" id="upper-row">
      <div class="col-3"><h1 class="title">Read Cat</h1></div>
      <div class="col-6 pt-3" >
        <input type="text" v-model="fetch_url" placeholder="Copy the article url here, and click [Fetch] button">
        <button class="btn btn-sm btn-primary m-lg-2" @click="fetchArticle">Fetch</button>
        <span v-if="fetching">Fetching ...</span>
      </div>
      <div class="col-3 pt-3">
        {{current_user.email}}
        <button class="btn btn-sm btn-danger" @click="logout">Logout</button>
      </div>
    </div>
    <div class="row websites">
      <div class="col-12">
        <span class="website">News websites: </span>
        <a v-for="(url) in eng_sites" :key="url" :href="url" class="website" target="_blank">{{url}}</a>
      </div>
    </div>
    <div class="row" id="body-row">
      <div class="col-1 date-range">
        <!--        show the last week-->
<!--        <div @click="loadList(null)" :class="!current_date ? 'active' : ''" class="date-item">All</div>-->
        <div v-for="(ele) in count_by_date" :key="ele[0]" @click="loadList(ele[0])" class="date-item"
             :class="current_date == ele[0] ? 'active' : ''">
          <span class="date">{{ ele[0] }}</span>
          <span class="count">{{ ele[1] }}</span>
        </div>
      </div>
      <div class="col-2">
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
      <div class="col-6 col-article-content">
          <div id="article-title" v-if="current_article">{{current_article.title}}</div>
          <div v-if="loading_content" class="loading">Loading</div>
          <div v-else id="article-content" class="mt-3" v-html="article_content"></div>
<!--        <button id="article-save-btn" class="btn btn-danger" @click="saveArticle">Save{{saving ? "..." : ""}}</button>-->
      </div>
      <vocabulary-master class="col-3">
      </vocabulary-master>
    </div>
    <edit-bar v-if="show_edit_bar"
              :style="edit_bar_pos"
              :show_text_colors="show_text_colors"
              :show_bg_colors="show_bg_colors"
              @jr-bold="editAction('jr-bold')"
              @jr-italics="editAction('jr-italics')"
              @jr-underl="editAction('jr-underl')"
              @jr-strike="editAction('jr-strike')"
              @jr-text-color="editAction('jr-text-color')"
              @jr-highlight-color="editAction('jr-highlight-color')"
              @jr-remove-styles="editAction('jr-remove-styles')"
              @jr-deleteSel="editAction('jr-deleteSel')"
              @text-color="clickTextColor"
              @hightlight-color="clickHighlightColor"
    />
  </div>
</template>
<script>
import axios from 'axios';
import EditBar from "./components/EditBar";
import VocabularyMaster from "./components/VocabularyMaster";
// import config from "../config";
import loginApi from "../api/login"
import articleApi from "../api/articles"
import readApi from "../api/read"

const rangyOptions = {exclusive: false};
let rangy = {};
export default {
  name: "MainPage",
  components: {
    "edit-bar": EditBar,
    "vocabulary-master": VocabularyMaster
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
      article_edit: false,
      show_edit_bar: false,
      edit_bar_pos: "",
      highlighter: null,
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
      ]
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

    document.addEventListener("mouseup", this.mouseupHandler)
    document.addEventListener("close", this.saveArticle)
    window.addEventListener('beforeunload', this.saveArticle);

    window.onload = function(){
      rangy = window.rangy;
    }
    this.refreshDate()
    var userstr = localStorage.getItem("user")
    if (userstr != null) {
      this.current_user = JSON.parse(userstr)
    }
    // axios.get(config.BASE_URL+ "/count_by_date").then(res => )
  },
  methods: {
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
    initHighlighter() {
      this.highlighter = rangy.createHighlighter(document) //.getElementById("article-content"));

      const rangeOptions = {
        onElementCreate: elem => {
          elem.id = 'jr-' + Date.now();
          // hasSavedLink = false;
          // shareDropdown.classList.remove("active");
          // setTimeout(() => updateSavedVersion(), 10);
        }
      };

      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-yellow", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-blue", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-green", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-pink", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-purple", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-orange", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-red", rangeOptions));

      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-white", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-black", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-yellow", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-blue", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-green", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-pink", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-purple", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-orange", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-red", rangeOptions));

      this.highlighter.addClassApplier(rangy.createClassApplier("jr-strike-through", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-underline", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-italicize", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-bolden", rangeOptions));
    },
    editAction(e, c) {
      console.log("======= get action: " + e + ", "+c)
      this.article_edit = true
      switch (e) {
        case "jr-bold":
          this.highlighter.highlightSelection("jr-bolden", rangyOptions);
          break;
        case "jr-italics":
          this.highlighter.highlightSelection("jr-italicize", rangyOptions);
          break;
        case "jr-underl":
          this.highlighter.highlightSelection("jr-underline", rangyOptions);
          break;
        case "jr-strike":
          this.highlighter.highlightSelection("jr-strike-through", rangyOptions);
          break;
        case "jr-text-color":
          this.show_text_colors = true
          this.show_bg_colors = false
          break;
        case "jr-highlight-color":
          this.show_text_colors = false
          this.show_bg_colors = true
          break;
        case "jr-remove-styles":
          this.highlighter.unhighlightSelection()
          break;
        case "jr-deleteSel":
          // eslint-disable-next-line no-case-declarations
          const sel = rangy.getSelection(document.getElementById("article-content"));
          if(sel.rangeCount > 0) {
            for(let i = 0; i < sel.rangeCount; i++) {
              sel.getRangeAt(i).deleteContents();
            }
            // hideToolbar();
          }
          break;
        default:
          break;
      }
    },
    clickTextColor(color){
      console.log("click text color: "+color)
      this.highlighter.highlightSelection("jr-color-" + color, rangyOptions);
    },
    clickHighlightColor(color) {
      console.log("click highlight color: "+color)
      this.highlighter.highlightSelection("jr-highlight-" + color, { exclusive: true });
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
    mouseupHandler() {
      if (!this.highlighter) {
        this.initHighlighter()
      }
      var sel = rangy.getSelection().toString();
      console.log("select: " + sel)
      if (!sel) {
        this.show_edit_bar = false
        return
      }
      // this.show_text_colors = false
      // this.show_bg_colors = false
      console.log("=== mouse up, selection: " + sel)
      const r = rangy.getSelection().nativeSelection.getRangeAt(0).getBoundingClientRect();
      const top = (r.top + document.defaultView.pageYOffset - 60 - 30) + 'px';
      const left = (r.left + r.width / 2 + document.defaultView.pageXOffset - 105) + 'px';

      this.show_edit_bar = true
      this.edit_bar_pos = "position:absolute; display:block; top: " + top + "; left: " + left;
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
        // if (article.highlight != null) {
        //   let words = article.highlight.split(",")
        //   words = Array.from(new Set(words))
        //   for (var i = 0; i < words.length; i++) {
        //     let keyword = words[i]
        //     html = html.split(keyword).join("<span class='jr-highlight-yellow'>" + keyword + "</span>")
        //   }
        // }

        that.article_content = html
        that.loading_content = false
        that.article_edit = false
      })
    }
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
