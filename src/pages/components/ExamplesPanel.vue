<template>
  <div id="examples" class="row" v-if="examples.length>0">
    <hr>
    <span>Examples: </span>
    <div class="content" :class="show_trans ? 'col-7 ' : 'col-12 '">
      <div v-for="(sentence) in examples" :key="sentence.textContent">
        <img src='/imgs/music-32.png' class="play-btn" @click="sentence_play(sentence.textContent)">
        <span v-html="sentence.innerHTML"></span>
      </div>
    </div>
    <div class="col-5 border-start content" v-if="show_trans" v-html="examples_zh"></div>

    <audio id="example-sentence-audio" controls :src="sentence_audio_url"></audio>
  </div>

</template>

<script>
import transApi from "@/api/translate";

export default {
  name: "ExamplesPanel",
  props: {
    word: {type: String, default: null},
    show_trans: {type: Boolean, default: false},
    examples_zh: {type: String, default: null}
  },
  data(){
    return {
      current_sentence: null,
      examples: [],
      trans_html: null
    }
  },
  mounted(){

  },
  methods: {
    sentence_play(text){
      if (typeof(text) == 'string' && text.length > 0) {
        this.current_sentence = text
        // let url = 'https://dict.youdao.com/dictvoice?type=1&audio=' + this.current_sentence.replace(/\s*(\n)?\s*\(?\d+\)?\.?\s+/, "").replace(/\s*(\n)?\s*$/,"")

        var audio = document.getElementById("example-sentence-audio")
        audio.setAttribute("autoplay", "autoplay")
        // audio.play()
      }

    },
    loadExample(word){
      var that = this
      transApi.examples(word)
          .then(function (res) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(res.data, "text/html");
            var container = doc.getElementById("all");
            if (!container) {
              container = doc.getElementById("student");
              // return
            }
            console.log("=== get examples successful")
            var examples = container.children //.slice(0,5)
            // console.log("children: "+container.children.length)
            for (var i = 0; i < examples.length; i++) {
              that.examples.push(examples[i]);
              console.log("put into examples " + i)
              console.log(examples[i].innerHTML)
              if (i > 9) {
                break;
              }
            }
            // that.word_html = res.data + "<div  class='reference'><a href='https://sentencedict.com/' target='_blank'>https://sentencedict.com/</a> provide data</div>";
          }).catch(err => {
            if (err.response.status == 404 && word.search(" ") > 0) {
              console.log("===== get 404")
              that.loadExample(word.replaceAll(" ", "-"))
            }
      })
    }
  },
  computed: {
    sentence_audio_url: function(){
      if (!this.current_sentence)
        return null
      return 'https://dict.youdao.com/dictvoice?type=1&audio=' + this.current_sentence.replace(/\s*(\n)?\s*\(?\d+\)?\.?\s+/, "").replace(/\s*(\n)?\s*$/,"")
    }
  },
  watch: {
    word (val, oldVal) {
      if (val !== oldVal) {
        console.log("word change: "+val)
        var that = this
        console.log("component examples, word: "+this.word)
        that.examples = [];
        that.trans_html = null;
        // this.loadExample(this.word)
        // if (this.show_trans) {
        //   transApi.examplesZh(this.word).then(function(res) {
        //         that.trans_html = res ? res.data : null
        //     }).catch(err => {
        //       console.log(err)
        //     if (err.response.status == 404) {
        //       console.log("===== get 404")
        //       transApi.examplesZh(this.word.replaceAll(" ", "-")).then(function (res) {
        //         that.trans_html = res ? res.data : null
        //       })
        //     }
        //   })
        // }


        var parser = new DOMParser();
        var doc = parser.parseFromString(this.examples_zh, "text/html");
        var container = doc.getElementsByTagName("ul")[0]
        if (!container) {
          container = doc.getElementById("student");
          // return
        }
        console.log("=== get examples successful")
        var examples = container.children //.slice(0,5)
        // console.log("children: "+container.children.length)
        for (var i = 0; i < examples.length; i++) {
          that.examples.push(examples[i]);
          console.log("put into examples " + i)
          console.log(examples[i].innerHTML)
          if (i > 9) {
            break;
          }
        }
      }
    }
  }
}
</script>

<style scoped>
#examples .content {
  font-size: 1.2em;
}
</style>

<style lang="scss" scoped>
@import "../../scss/examples.scss";
</style>
