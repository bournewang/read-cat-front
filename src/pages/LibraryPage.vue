<template>
  <div class="wrapper container-fluid">
    <h1>Library</h1>
    <div class="row websites">
      <div class="col-12">
        <span class="website">News websites: </span>
        <a v-for="(url) in eng_sites" :key="url" :href="url" class="website px-1" target="_blank">{{url}}</a>
      </div>
    </div>
    <div class="row" id="body-row">
      <div class="col-lg-1 col-md-2 column">
        <list-category :list="count_by_date" @clickItem="loadList"></list-category>
      </div>
      <div class="col-2">
        <div class="loading" v-if="loading_list">Loading...</div>
        <list-article :articles="articles" @loadArticle="setArticle" :read_essays="read_essays"></list-article>
      </div>
      <div class="col-9">
        <reader-panel :article="current_article" :content_type="content_type" @articleSaved="refreshReadEssays"></reader-panel>
      </div>
    </div>
  </div>
</template>
<script>
import ListCategory from "@/pages/components/ListCategory";
import ListArticle from "@/pages/components/ListArticle";
import ReaderPanel from "@/pages/components/ReaderPanel";
import articleApi from "../api/articles"
// import readApi from "../api/read"
import essaysApi from "@/api/essays";

export default {
  name: "LibraryPage",
  components: {
    "list-category": ListCategory,
    "list-article": ListArticle,
    "reader-panel": ReaderPanel
  },
  data() {
    return {
      count_by_date: [],
      articles: [],
      current_article: {},
      content_type: "essay",
      loading_list: false,
      read_essays: [],
      eng_sites: [
        "https://www.telegraph.co.uk/",
        "https://www.mirror.co.uk/",
        "https://metro.co.uk/",
        "https://www.standard.co.uk/",
        "https://www.politics.co.uk/",
        "https://www.wired.co.uk",
        // "https://www.dailyrecord.co.uk/news/"
      ],
    }
  },
  mounted() {
    this.refreshDate()
    this.refreshReadEssays()
  },
  methods: {
    login(){
      // var router = useRouter();
      this.$router.push('/login')
    },
    refreshReadEssays(){
      let that = this
      articleApi.getAllReadEssays().then(res => {
        that.read_essays = res.data
      })
    },
    refreshDate(){
      var that = this
      // essaysApi.countByCateogry().then(res => {
      //   that.listData = res.data
      // })
      essaysApi.countByCateogry().then(res => {
        that.count_by_date = res.data
        // console.log(res)
        let current_item = that.count_by_date[0]
        that.loadList(current_item)
      })
    },
    // BUG: edit bar show shown after fetch article
    loadList(item) {
      // console.log("load list "+date)
      let category_id = item[0]
      var that = this
      // this.current_item = date
      this.loading_list = true
      // this.saveArticle()
      essaysApi.list(category_id).then(function (res) {
        // console.log(res.data[0]);
        console.log("load list ==== ")
        that.articles = res.data
        that.loading_list = false

        console.log("load article "+res.data[0].id)
        that.setArticle(res.data[0])
        // that.current_article = res.data[0]
      })
    },
    setArticle(essay) {
      console.log("set essay: "+essay.title)

      if (this.read_essays.indexOf(essay.id) > -1) {
        let that = this
        articleApi.getByEssayId(essay.id).then(res => {
          that.current_article = res.data
          that.content_type = "article"
        })
      }else{
        this.current_article = essay
        this.content_type = "essay"
      }
    }
  },
  watch: {
  },
  beforeUnmount() {
  }
}
</script>

<style lang="scss" scopped>
@import "../scss/library";
</style>
