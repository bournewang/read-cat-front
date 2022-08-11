<template>
  <div id="examples" class="row" v-if="examples.length>0">
    <hr>
    <span>Examples: </span>
    <div :class="show_trans ? 'col-7 ' : 'col-12 '">
      <div v-for="(sentence) in examples" :key="sentence.textContent">
        <img src='/imgs/music-32.png' class="play-btn" @click="sentence_play(sentence.textContent)">
        <span v-html="sentence.innerHTML"></span>
      </div>
    </div>
    <div class="col-5 border-start" v-if="show_trans" v-html="trans_html"></div>

    <audio id="example-sentence-audio" controls :src="sentence_audio_url" :autoplay="autoplay"></audio>
  </div>

</template>

<script>
import transApi from "@/api/translate";

export default {
  name: "Examples",
  props: {
    word: {type: String, default: null},
    show_trans: {type: Boolean, default: false}
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
      }
      document.getElementById("example-sentence-audio").play()
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
        transApi.examples(this.word)
            .then(function (res) {
              var parser = new DOMParser();
              var doc = parser.parseFromString(res.data, "text/html");
              var container = doc.getElementById("all");
              if (!container) {
                return
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
            })
        if (this.show_trans) {
          transApi.examplesZh(this.word).then(function(res) {
                that.trans_html = res.data
            })
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
