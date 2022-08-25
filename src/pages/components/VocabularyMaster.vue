<template>
  <div id="vocabulary-master-wrapper" :class="maximize ? 'max p-2' : 'mini'">
    <div v-if="!maximize" class="head">
      <span id="title" class="mt-1 mb-2 float-lg-start">Vocabulary Master</span>
      <button  @click="maximize_window">&nbsp;+&nbsp;</button>
    </div>
    <div v-if="maximize">
      <div class="head">
<!--        <span id="title" class="mt-1 mb-2 ">Vocabulary Master</span>-->
        <button @click="click_autoplay" :class="autoplay ? 'button-default' : 'button-primary'" title="autoplay">Autoplay</button>
        <label for="dict_en"><input id="dict_en" type="radio" name="dict_lang" :v-model="dict_lang" value="en">EN</label>
        <label for="dict_zh"><input id="dict_zh" type="radio" name="dict_lang" :v-model="dict_lang" value="zh">ZH</label>
<!--        <button @click="minimize_window">&nbsp;-&nbsp;</button>-->
      </div>
      <div v-if="current_selected == current_sentence && current_sentence">
        <hr>
        <div class="mt-2">
          <img :src="audio_icon_url" class="play-btn" @click="sentence_play()">
          {{ current_sentence }} ({{word_count}} words)
        </div>
        <div v-if="trans_text" id="trans_text" class="">
          <hr>
          {{ trans_text }}
        </div>
      </div>
      <div v-if="current_selected == current_word && current_word">
        <hr>
        <div>{{ current_word }} <img :src="audio_icon_url" alt="" class="play-btn" @click.stop="word_play">
          <span v-if="trans_word">{{ trans_word }}</span>
        </div>
        <div id="meanings" v-if="dict_html" v-html="dict_html"></div>

<!--        <examples :word="current_word"></examples>-->
      </div>
      <div v-if="error">
        <hr>
        <span class="text text-bg-danger">{{error}}</span>
      </div>

      <audio id="word-audio" controls :src="word_audio_url" :autoplay="autoplay"></audio>
      <audio id="sentence-audio" controls :src="sentence_audio_url" :autoplay="autoplay"></audio>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import transApi from "@/api/translate";
// import Examples from "@/pages/components/ExamplesPanel";
// import jsonp from "jsonp";
// import BaiduTransApiSign from "../../api/baidu-trans-api-sign";
export default {
  name: "VocabularyMaster",
  // components: {'examples': Examples},
  data(){
    return {
      current_selected: null,
      current_word: null,
      current_sentence: null,
      meanings: [],
      examples_en: [],
      phonetics: [],
      trans_text: null,
      trans_word: null,
      word_count: null,
      dict_html: null,
      audio_icon_url: '/imgs/music-32.png',
      autoplay: false,
      dict_lang: "en",
      // minimize: false,
      error: null,
      maximize: true
    }
  },
  mounted() {
    console.log("content mounted +++++==")
    // this.audio_icon_url = '/imgs/music-32.png'
    this.autoplay = localStorage.getItem("autoplay") == "true"
    console.log("autoplay: "+this.autoplay)
    var that = this
    window.addEventListener("mouseup", function(){
      var string = window.getSelection().toString().trim()
      if (that.current_selected == string) {
        return
      }
      console.log("mouse up , selected type: "+typeof(string))
      if (string.length < 1) {
        console.log("not a string selected, or nothing selected")
        return
      }
      that.current_selected = string.replace(/\[[A-Za-z0-9]+\]/g,"")
      if (that.current_selected.indexOf(" ") > 0) {
        //  sentences selected
        console.log("selected length: "+that.current_selected.length )
        that.word_count = that.current_selected.split(" ").length
        if (that.word_count > 100) {
          that.error = "Sentences selected too long!"
          that.trans_text = null
        } else {
          that.translate(that.current_selected)
          that.error = null
        }
        that.current_sentence = that.current_selected
        that.current_word = null
        // if (that.autoplay)
        //   that.sentence_play()
      }else {
        that.current_sentence = null
        that.trans_text = null
        that.current_word = that.current_selected
        that.trans_word = null
        that.phonetics = []
        that.meanings = []
        that.examples_en = []
        that.dict_zh_html = null
        that.error = null
        // axios.get("https://vocabulary-master.local/translate.php?query="+that.current_word)
        transApi.translate(that.current_word).then(function(res){
          that.trans_word = res.data
        })
        let req = null
        if (that.dict_lang == "en") {
          req = transApi.dictEn(that.current_word)
        }else{
          req = transApi.dictZh(that.current_word)
        }
        req.then(res => {
          that.dict_html = res.data
        })
      }
    })
  },
  methods: {
    minimize_window() {
      this.maximize = false
    },
    maximize_window(){
      this.maximize = true
    },
    click_autoplay(){
      this.autoplay = !this.autoplay
      localStorage.setItem("autoplay", this.autoplay)
      console.log("set item autoplay: "+this.autoplay)
    },
    word_play(url){
      console.log("word play: "+this.current_word)
      var audio = document.getElementById('word-audio')
      if (typeof(url) == 'string' && url.length > 0) {
        audio.setAttribute("src", url)
      }
      audio.play()
      // e.stopPropagation
    },
    sentence_play(text){
      if (typeof(text) == 'string' && text.length > 0) {
        this.current_sentence = text
      }
      document.getElementById("sentence-audio").play()
    },
    translate(query){
      var that = this
      // axios.get("https://vocabulary-master.local/translate.php?query="+query)
      transApi.translate(query).then(function(res){
        that.trans_text = res.data
      })

    }
  },
  computed: {
    // sentense_url: function(){
    //   return "https://sentencedict.com/"+this.current_word+".html"
    // },
    word_audio_url: function(){
      if (this.current_selected != this.current_word || !this.current_word)
        return null
      return 'https://dict.youdao.com/dictvoice?type=1&audio=' + this.current_word
    },
    sentence_audio_url: function(){
      if (!this.current_sentence)
        return null
      return 'https://dict.youdao.com/dictvoice?type=1&audio=' + this.current_sentence.replace(/\s*(\n)?\s*\(?\d+\)?\.?\s+/, "").replace(/\s*(\n)?\s*$/,"")
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../scss/vocabulary-master";
</style>

<style lang="css" scoped>
/*@import "../../css/bootstrap5.min.css";*/
/*@import "../../css/bootstrap5-grid.min.css";*/
</style>

