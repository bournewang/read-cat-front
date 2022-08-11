<template>

  <header>
    <h1>Academic Word List exercise</h1>
    <span>The Academic Word List (AWL) is a list of 570 of the most common academic words found in academic texts. Below is the full word list.</span>

    <button @click="click_autoplay" class="btn btn-sm float-lg-end ms-3" :class="autoplay ? 'btn-info' : 'btn-primary'">{{autoplay ? "Disable" : "Enable"}} Autoplay</button>
    <button @click="click_showtrans" class="btn btn-sm float-lg-end" :class="show_trans ? 'btn-info' : 'btn-primary'">{{show_trans ? "Hide" : "Show"}} Translation</button>
    <div class="clearfix"></div>
  </header>
  <hr>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <ul class="nav nav-tabs" id="words-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">AWL</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Mastered</button>
          </li>
        </ul>
        <div class="tab-content border-start border-bottom border-end rounded-bottom" id="left-column">
          <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
            <ul class="word-list">
              <template v-for="(word, i) in awl" :key="word">
                <li v-if="mastered_words.indexOf(word) < 0">
                  <input type="checkbox" :value="word" v-model="mastered_words" @change="checkword()"> &nbsp;
                  {{i+1}}.&nbsp;
                  <span :class="word + (mastered_words.indexOf(word) > -1 ? ' delete' : '')" @click="clickword(word)">{{word}}</span>
                  <hr v-if="(i+1) % 10 == 0">
                </li>
              </template>
            </ul>
          </div>
          <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
            <ul class="word-list">
              <template v-for="(word, i) in awl" :key="word">
                <li v-if="mastered_words.indexOf(word) >= 0">
                  <input type="checkbox" :value="word" v-model="mastered_words" @change="checkword()"> &nbsp;
                  {{i+1}}.&nbsp;
                  <span :class="word + (mastered_words.indexOf(word) > -1 ? ' delete' : '')" @click="clickword(word)">{{word}}</span>
                  <hr v-if="(i+1) % 10 == 0">
                </li>
              </template>
            </ul>
          </div>
        </div>

      </div>

      <div class="col-9 " id="content" >
        {{current_word}} <img src="/img/music-32.png" alt="" class="play-btn" @click="word_play">
        <audio id="word-audio" controls :src="word_audio_url" :autoplay="autoplay">
        </audio>
        <div class="row" id="definition">
          <div v-html="word_meanings" :class="show_trans ? 'col-7 ' : 'col-12 '"></div>
          <div v-html="trans_meanings" class="col-5 border-start" v-if="show_trans"></div>
        </div>
<!--        <div class="row examples">-->
        <examples :word="current_word" :show_trans="show_trans"></examples>
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import vocabularyApi from "@/api/vocabulary";
import transApi from "@/api/translate";
import Examples from "@/pages/components/Examples";

export default  {
    components: {"examples": Examples},
    data() {
        return {
            counter: 0,
            current_word: null,
            current_sentence: "",
            awl: [],
            // word_html: null,
            examples_en: [],
            word_meanings: null,
            trans_meanings: null,
            trans_html: null,
            show_trans: true,
            autoplay: true,
            mastered_words: []
        }
    },
    mounted() {
        // this.awl = AWL
        // this.current_word = AWL[0]
        var that = this
        // axios.get("/awl/awl.json")
      vocabularyApi.list("awl")
            .then(function(res) {
            that.awl = res.data
            that.current_word = that.awl[0]
            that.clickword(that.current_word)
        })

        // const triggerTabList = document.querySelectorAll('#words-tab button')
        // triggerTabList.forEach(triggerEl => {
            // const tabTrigger = new bootstrap.Tab(triggerEl)
            //
            // triggerEl.addEventListener('click', event => {
            //     event.preventDefault()
            //     tabTrigger.show()
            // })
        // })
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
            document.querySelectorAll('.current').forEach(span => {
                span.classList.remove('current')
            })
            document.querySelectorAll('.'+word).forEach(span => {
                span.classList.add("current")
            })

            var that = this
            transApi.dictEn(word).then(function(res) {
                that.word_meanings = res.data + "<div class='reference'><a href='https://dictionaryapi.dev/' target='_blank'>https://dictionaryapi.dev/</a> provide data</div>";
            })
            // axios.get("/dict/zh-CN/"+word+".html")
            transApi.dictZh(word).then(function(res) {
                that.trans_meanings = res.data
            })
            // axios.get("/awl/example/en/"+word+".html").then(function(res) {
            //     var parser = new DOMParser();
            //     var doc = parser.parseFromString(res.data, "text/html");
            //     var divs = doc.getElementsByTagName("div");
            //     that.examples_en = [];
            //     for (var i=0; i< divs.length; i++) {
            //         if (divs[i].id == 'all') continue;
            //         that.examples_en.push(divs[i]);
            //     }
            //     // that.word_html = res.data + "<div  class='reference'><a href='https://sentencedict.com/' target='_blank'>https://sentencedict.com/</a> provide data</div>";
            // })
            // axios.get("/awl/example/zh-CN/"+word+".html").then(function(res) {
            //     that.trans_html = res.data
            // })
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


<style scoped>
@import "../css/bootstrap5.min.css";
@import "../css/bootstrap5-grid.min.css";
@import "../scss/vocabulary-list.scss";
</style>
