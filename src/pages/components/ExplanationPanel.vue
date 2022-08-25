<template>
  <div id="content">
    <div>
      LANG:
      <input type="checkbox" value="en" v-model="lang_en">EN
      <input type="checkbox" value="zh-CN" v-model="lang_zh">ZH

      <button @click="autoplay=!autoplay" class="btn btn-sm ms-3"
              :class="autoplay ? 'btn-info' : 'btn-primary'">
        {{ autoplay ? "Disable" : "Enable" }} Autoplay
      </button>
    </div>

    <div class="row p-1">
      <hr>
      <img src="/imgs/music-32.png" class="play-btn" @click="audio_play(current_selected)">
      {{ current_selected }}
      <template v-if="word_count > 0">({{ word_count }} words)</template>
    </div>

    <div v-if="current_selected && word_count > 1 && trans_text" id="trans_text" class="row p-1">
      <hr>
      {{ trans_text }}
    </div>

    <div v-if="current_selected && word_count == 1" class="row p-1" id="definition">
      <hr>
      <div v-for="(dict,i) in dicts" v-html="dict" :key="i" class="col"></div>
    </div>

    <div v-if="examples.length>0" id="examples" class="row p-1" >
      <hr>
      <span>Examples: </span>
      <div class="sentences col" v-for="(example,i) in examples" :key="i">
        <div v-for="(sentence) in example" :key="sentence.textContent">
          <img src='/imgs/music-32.png' class="play-btn" @click="audio_play(sentence.textContent)">
          <span v-html="sentence.innerHTML"></span>
        </div>
      </div>
    </div>
    <div v-if="error">
      <hr>
      <span class="text text-bg-danger">{{ error }}</span>
    </div>

    <loading v-if="loading"></loading>
    <audio id="audio" controls :src="current_audio_url" :autoplay="autoplay"/>
  </div>
</template>

<script>
import transApi from "@/api/translate";
import LoadingStatus from "@/pages/components/LoadingStatus";

export default {
  name: "ExplanationPanel",
  components: {'loading': LoadingStatus},
  props: {
    current_selected: {type: String, default: null},
  },
  data() {
    return {
      autoplay: true,
      loading: false,
      lang_en: true,
      lang_zh: true,
      dicts: [],
      examples: [],
      // current_selected: null,
      trans_text: null,
      word_count: null,
      error: null,
    }
  },
  methods: {
    clickword(word) {
      if (word.length < 1) {
        return
      }
      var that = this
      let langs = []
      if (that.lang_en) langs.push("en")
      if (that.lang_zh) langs.push("zh-CN")

      that.dicts = langs.length == 1 ? [[]] : [[],[]]
      that.examples = langs.length == 1 ? [[]] : [[],[]]
      that.loading = true

      word = word.toLowerCase()
      transApi.explanation(word, langs.join(",")).then(function (res) {
        that.dicts = res.data.dicts
        var examples_list = res.data.examples
        that.loading = false

        for (var j = 0; j < examples_list.length; j++) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(examples_list[j], "text/html");
          var container = doc.getElementsByTagName("ul")[0]
          if (!container) {
            container = doc.getElementById("all");
            // return
          }
          console.log("=== get examples successful")
          var examples = container.children //.slice(0,5)
          // console.log("children: "+container.children.length)
          for (var i = 0; i < examples.length; i++) {
            that.examples[j].push(examples[i]);
            console.log("put into examples " + i)
            // console.log(examples[j][i].innerHTML)
            if (i > 9) {
              break;
            }
          }
        }

      })
    },
    translate(query) {
      var that = this
      // axios.get("https://vocabulary-master.local/translate.php?query="+query)
      transApi.translate(query).then(function (res) {
        that.trans_text = res.data
      })

    },
    audio_play(text) {
      var audio = document.getElementById("audio")
      if (typeof (text) == 'string' && text.length > 0) {
        audio.setAttribute("src", this.audio_url(text))
      }
      audio.setAttribute("autoplay", "autoplay")
      audio.play()
    },
    audio_url(text) {
      if (!text)
        return null
      return 'https://dict.youdao.com/dictvoice?type=1&audio=' + text.replace(/\s*(\n)?\s*\(?\d+\)?\.?\s+/, "").replace(/\s*(\n)?\s*$/, "")
    },
  },
  computed: {
    current_audio_url: function () {
      let text = this.current_selected
      return this.audio_url(text)
    }
  },
  watch: {
    current_selected(val, oldVal) {
      if (val !== oldVal) {
        console.log(" ====== explanation panel, current selected change ====")
        this.word_count = this.current_selected.split(" ").length
        this.dicts = [[], []]
        this.examples = []
        if (this.word_count > 1) {
          //  sentences selected
          console.log("selected length: " + this.current_selected.length)
          if (this.word_count > 100) {
            this.error = "Sentences selected too long!"
            this.trans_text = null
          } else {
            this.translate(this.current_selected.replace(/\[[A-Z][0-9]\]/g, ""))
            this.error = null
          }
        } else {
          this.clickword(this.current_selected)
        }
      }
    }

  }
}
</script>

<style scoped lang="scss">
@import "../../scss/explanation";
</style>
