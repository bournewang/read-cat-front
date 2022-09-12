<template>
  <div class="wrapper container-fluid">
    <div class="row" id="body-row">
      <div class="col-lg-1 col-md-2 column">
        <list-category :list="count_by_date" @clickItem="loadList"></list-category>
      </div>
      <div class="col-2">
        <div class="loading" v-if="loading_list">Loading...</div>
        <list-article :articles="articles" @loadArticle="setArticle"></list-article>
      </div>
      <div class="col-9">
        <reader-panel :article="current_article" content_type="article" @articleDeleted="refreshDate"></reader-panel>
      </div>
    </div>
  </div>
</template>
<script>
import ListCategory from "@/pages/components/ListCategory";
import ListArticle from "@/pages/components/ListArticle";
import ReaderPanel from "@/pages/components/ReaderPanel";
import articleApi from "../api/articles"
import readApi from "../api/read"

export default {
  name: "MainPage",
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
      loading_list: false,
    }
  },
  mounted() {
    this.refreshDate()
  },
  methods: {
    login(){
      // var router = useRouter();
      this.$router.push('/login')
    },
    refreshDate(){
      var that = this
      readApi.countByDate().then(res => {
        that.count_by_date = res.data
        // console.log(res)
        let current_item = that.count_by_date[0]
        that.loadList(current_item)
      })
    },
    // BUG: edit bar show shown after fetch article
    loadList(item) {
      let date = item[0]
      console.log("load list "+date)
      var that = this
      // this.current_date = date
      this.loading_list = true
      // this.saveArticle()
      articleApi.list(date).then(function (res) {
        // console.log(res.data[0]);
        console.log("load list ==== ")
        that.articles = res.data
        that.loading_list = false

        console.log("load article "+res.data[0].id)
        that.setArticle(res.data[0])
        // that.current_article = res.data[0]
      })
    },
    setArticle(article) {
      console.log("set article: "+article.title)
      this.current_article = article
    }
  },
  watch: {
  },
  beforeUnmount() {
  }
}
</script>

<style lang="scss" scopped>
@import "../scss/main";
</style>
