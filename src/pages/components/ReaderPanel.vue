<template>
<div class="row h-100" id="reader-panel" :class="content_type+'-view'">
  <div class="col-8 h-100 column">
    <div id="article-title" class="row">
      <span v-if="article" class="col-10">{{current_article.title}}</span>
      <div class="col-2 ">
        <button id="article-del-btn" class="btn btn-danger mr-3 mt-2" @click="deleteArticle" v-if="content_type != 'essay'">
          <font-awesome-icon icon="trash" />
        </button>
        <button class="btn btn-success mt-2" @click="saveArticle(true)">
          <font-awesome-icon icon="save"/>
        </button>

      </div>
    </div>
    <div>
      <a :href="current_article.oriUrl" target="_blank">Source</a>
    </div>
    <div v-if="loading_content" class="loading">Loading</div>
    <div v-else id="article-content" class="pe-3 pb-5" v-html="current_article.content"></div>
    <div id="article-words" v-if="marked_words.length > 0">
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
    <edit-bar @article_edit="editArticle"/>
  </div>
  <div class="col-4">
    <div>
      <select @change="loadWordsList" v-model="current_list_type">
        <option v-for="type in list_types" :value="type" :key="type">{{type}}</option>
      </select>
      <button @click="mark">Mark</button>

    </div>
    <explanation-panel :current_selected="current_selected" :multi_langs="false"></explanation-panel>
  </div>

</div>
</template>

<script>
import articleApi from "@/api/articles";
import common from "@/common";
import vocabularyApi from "@/api/vocabulary";
import EditBar from "@/pages/components/EditBar";
import ExplanationPanel from "@/pages/components/ExplanationPanel";

export default {
  name: "ReaderPanel",
  components: {
    "edit-bar": EditBar,
    "explanation-panel": ExplanationPanel
  },
  props: {
    content_type: {type: String, default: ""},
    article: {type: Object, default: function(){return {}}}
  },
  data(){
    return {
      current_article: {},
      article_from_essay: null,
      article_edit: false,
      current_selected: null,
      marked_words_style: null,
      marked_words: [],
      list_types: ["A1", "A2", "B1", "B2", "C1", "awl"],
      current_list_type: "awl",
      current_marked: null,
      words: []
    }
  },
  mounted() {
    document.addEventListener("close", this.saveArticle(false))
    window.addEventListener('beforeunload', this.saveArticle(false));
    window.addEventListener("mouseup", this.mouseupHandler)

    this.loadWordsList()
  },
  methods: {
    mouseupHandler() {
      let text = window.getSelection().toString().trim()
      if (text.length > 0)
        this.current_selected = text
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
      this.current_article.content = this.current_article.content.replace(re, "<em id='em-$1'>$1["+this.current_list_type+"]</em>")
      this.article_edit = true
      this.refresh_marked_words()
      this.checkAndCreateArticleFromEssay()
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
    checkAndCreateArticleFromEssay(){
      console.log("==== checkAndCreateArticleFromEssay, content type: "+this.content_type)
      if (this.content_type == "essay" && !this.article_from_essay) {
        let that = this
        console.log("====create article from essay")
        articleApi.createFromEssay(this.current_article).then(res => {
          that.article_from_essay = res.data
        })
      }
    },
    editArticle(){
      this.article_edit = true
      this.refresh_marked_words()
      this.checkAndCreateArticleFromEssay()
    },
    saveArticle(show_msg){
      let article = this.current_article
      console.log("this.content_type "+this.content_type)
      if (this.content_type == "essay") {
        article = this.article_from_essay
      }

      if (!article || !this.article_edit) return
      console.log("save article "+article.id + ", "+article.title)
      this.saving = true

      let that = this
      article.content = document.getElementById("article-content").innerHTML.toString()
      articleApi.update(article.id, article).then(res => {
        console.log(res)
        that.saving = false
        if (this.content_type == "essay") {
          that.$emit("articleSaved")
        }
        if (show_msg)
          alert("Article saved successful!")
      })
    },
    deleteArticle(){
      if (!confirm("Are you sure to delete this article?")) return
      var that = this
      articleApi.del(this.current_article.id).then(function (res) {
        console.log(res.data);
        // that.loadList(that.current_date)
        that.$emit("articleDeleted")
        // that.refreshDate()
      }).catch(function (err) {
        console.log(err);
      })
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
    article: function(val, old) {
      console.log("article change: "+val.title+", old:"+old.title)
      // this.saveArticle(false)
      this.current_article = val
      this.article_from_essay = null
      this.refresh_marked_words()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../scss/reader.scss";
</style>
