<template>
  <div class="articles">
<!--    <div>read_essays: {{read_essays.join(",")}}</div>-->
    <div v-for="(article, i) in articles" :key="article.id" class="article" :class="(current_article ? current_article.id == article.id : (i==0)) ? 'active' : ''"
         @click="loadArticle(article)">
      <!--            <a :href="article.url" target="article-content">{{article.title}}</a>-->
      <span class="title">{{ article.title }}</span>
      <!--            <span class="highlight">{{article.highlight}}</span>-->
      <div class="flex-row" style="display: flex;">
        <span class="date">{{ article.createdAt }}</span>
        <span class="flex-fill"></span>
        <font-awesome-icon icon="book-open" class="pe-2" v-if="read_essays.indexOf(article.id) > -1"/>
        <span class="word_count">{{article.wordCount}}</span>
      </div>
    </div>
    <div class="article" v-if="articles.length < 1">
      No Articles!
    </div>
  </div>
</template>

<script>
export default {
  props: {
    articles: {type: Array, default: function(){return []}},
    read_essays: {type: Array, default: function(){return []}},
  },
  data(){
    return {
      current_article: null
    }
  },
  name: "ListArticle",
  methods: {
    loadArticle(a) {
      console.log("click article: "+a.title)
      this.current_article = a
      this.$emit("loadArticle", a)
    }
  },
  watch: {
    articles(){
      console.log("articles change, set current_article = null =====")
      this.current_article = null
    }
  }
}
</script>

<style scoped>

</style>
