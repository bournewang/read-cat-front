<template>

  <header>
    <h1>Academic Word List exercise</h1>
<!--    <span>The Academic Word List (AWL) is a list of 570 of the most common academic words found in academic texts. Below is the full word list.</span>-->

    <select @change="loadWordsList" v-model="current_list_type">
      <option v-for="type in list_types" :value="type" :key="type">{{type}}</option>
    </select>

<!--    <v-select v-model="current_list_type" :options="list_types" @change="wordListChange"/>-->

    <button @click="click_autoplay" class="btn btn-sm float-lg-end ms-3" :class="autoplay ? 'btn-info' : 'btn-primary'">{{autoplay ? "Disable" : "Enable"}} Autoplay</button>
<!--    <button @click="click_showtrans" class="btn btn-sm float-lg-end" :class="show_trans ? 'btn-info' : 'btn-primary'">{{show_trans ? "Hide" : "Show"}} Translation</button>-->
    <div class="clearfix"></div>
  </header>
  <hr>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <ul class="nav nav-tabs" id="words-tab">
          <li class="nav-item">
            <a href="#words-all" class="nav-link active" data-bs-toggle="tab">AWL</a>
          </li>
          <li class="nav-item">
            <a href="#words-mastered" class="nav-link" data-bs-toggle="tab">Mastered</a>
          </li>
        </ul>
        <div class="tab-content border-start border-bottom border-end rounded-bottom" id="left-column">
          <div class="tab-pane fade show active" id="words-all" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
            <ul class="word-list">
              <template v-for="(word, i) in words" :key="word">
                <li v-if="mastered_words.indexOf(word) < 0">
                  <input type="checkbox" :value="word" v-model="mastered_words" @change="checkword()"> &nbsp;
                  {{i+1}}.&nbsp;
                  <span :class="word_str(word) + (mastered_words.indexOf(word) > -1 ? ' delete' : '') + (current_word == word ? ' current' : '')" @click="clickword(word)">{{word}}</span>
                  <hr v-if="(i+1) % 10 == 0">
                </li>
              </template>
            </ul>
          </div>
          <div class="tab-pane fade" id="words-mastered" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
            <ul class="word-list">
              <template v-for="(word, i) in words" :key="word">
                <li v-if="mastered_words.indexOf(word) >= 0">
                  <input type="checkbox" :value="word" v-model="mastered_words" @change="checkword()"> &nbsp;
                  {{i+1}}.&nbsp;
                  <span :class="word_str(word) + (mastered_words.indexOf(word) > -1 ? ' delete' : '')" @click="clickword(word)">{{word}}</span>
                  <hr v-if="(i+1) % 10 == 0">
                </li>
              </template>
            </ul>
          </div>
        </div>

      </div>

      <div class="col-9 " id="content" >
        {{current_word}} <img src="/imgs/music-32.png" alt="" class="play-btn" @click="word_play">
        <audio id="word-audio" controls :src="word_audio_url" :autoplay="autoplay">
        </audio>
        <div class="row" id="definition">
          <div v-html="word_meanings ? word_meanings : words_trans[current_word]" :class="show_trans ? 'col-7 ' : 'col-12 '"></div>
          <div v-html="trans_meanings" class="col-5 border-start" v-if="show_trans"></div>
        </div>
        <examples :word="current_word" :show_trans="false" :examples_zh="examples_zh"></examples>
      </div>
    </div>
  </div>
</template>

<script>
import vocabularyApi from "@/api/vocabulary";
import transApi from "@/api/translate";
import Examples from "@/pages/components/ExamplesPanel";
import 'mdb-vue-ui-kit/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

export default  {
    components: {"examples": Examples},
    data() {
        return {
            counter: 0,
            current_word: null,
            current_sentence: "",
            words: [],
            words_trans: {},
            list_types: ["A1", "A2", "B1", "B2", "C1", "C1-1", "C1-2", "awl", "Listening"],
            current_list_type: "awl",
            // word_html: null,
            examples_en: [],
            examples_zh: "",
            word_meanings: null,
            trans_meanings: null,
            trans_html: null,
            show_trans: false,
            autoplay: true,
            mastered_words: []
        }
    },
    mounted() {
        this.loadWordsList()

        let words = window.localStorage.getItem("mastered_words")
        if (words){
            this.mastered_words = words.split(',')
        }
    },
    methods: {
        click_showtrans() {
            this.show_trans = !this.show_trans
        },
        click_autoplay(){
            this.autoplay = !this.autoplay
        },
        clickword (word){
            console.log("you click word: "+word)
            this.current_word = word
            // document.querySelectorAll('.current').forEach(span => {
            //     span.classList.remove('current')
            // })
            // document.querySelectorAll('.'+word).forEach(span => {
            //     span.classList.add("current")
            // })

            var that = this
          that.word_meanings = null
          that.trans_meanings = null
            if (word.search(" ") < 0) {
              word = word.toLowerCase()
              // transApi.dictEn(word).then(function (res) {
              //   that.word_meanings = res.data + "<div class='reference'><a href='https://dictionaryapi.dev/' target='_blank'>https://dictionaryapi.dev/</a> provide data</div>";
              // })
              // transApi.dictZh(word).then(function(res) {
              //   that.trans_meanings = res.data
              // })
              transApi.explanation(word).then(function(res) {
                that.word_meanings = res.data.dict
                that.examples_zh = res.data.example
              })
            } else {
              //
              that.word_meanings = this.trans[word]
            }
        },
        checkword () {
            window.localStorage.setItem("mastered_words", this.mastered_words.toString())
        },
        word_play(){
            document.getElementById('word-audio').play()
        },
        sentence_play(text){
            this.current_sentence = text
            document.getElementById("sentence-audio").play()
        },
        loadWordsList(){
          var that = this
          vocabularyApi.list(this.current_list_type)
              .then(function(res) {
                if (Array.isArray(res.data)) {
                  that.words = res.data
                } else {
                  that.words = Object.keys(res.data)
                  that.words_trans = res.data
                }
                console.log("return list is array--------:" + Array.isArray(res.data))
                that.current_word = that.words[0]
                that.clickword(that.current_word)
              })
        },
        word_str(word){
          return word.replace(" ", "-")
        }
    },
    computed: {
        sentense_url: function(){
            return "https://sentencedict.com/"+this.current_word+".html"
        },
        word_audio_url: function(){
            return 'https://dict.youdao.com/dictvoice?type=1&audio=' + this.current_word
        },
        sentence_audio_url: function(){
            return 'https://dict.youdao.com/dictvoice?type=1&audio=' + this.current_sentence.replace(/\s*(\n)?\s*\d+\.\s+/, "").replace(/\s*(\n)?\s*$/,"")
        }
    }
}
</script>


<style lang="scss" scoped>
@import "../scss/vocabulary-list.scss";
</style>
