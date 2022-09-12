<template>
  <div id="content">
    <div>
      <div id="langs-wrap">
        LANGS:
        <label v-for="(label,val) in support_langs" class="m-lg-2" :key="val">
          <input :type="multi_langs ? 'checkbox' : 'radio'" name="langs" v-model="langs"  :key="val" :value="val" @change="langChange"/>{{ label }}
        </label>

        <input type="checkbox" v-model="autoplay" id="autoplay" class="m-lg-2"><label for="autoplay">Autoplay</label>
      </div>
    </div>

    <div class="row p-1">
      <hr>
      <div>
        <img src="/imgs/music-32.png" class="play-btn" @click="audio_play(current_selected)">
        {{ current_selected }}
        <div v-if="word_count > 1">({{ word_count }} words)</div>
      </div>
    </div>

    <div v-if="current_selected && word_count > 1 && trans_text" id="trans_text" class="row p-1">
      <hr>
      {{ trans_text }}
    </div>

    <div v-if="current_selected && word_count == 1" class="row p-1" id="definition">
      <hr>
      <div v-for="(dict,i) in dicts" v-html="dict" :key="i" class="col"></div>
      <div class="mt-3 text-danger" v-if="dicts.length < 1">
        -
      </div>
    </div>

    <div v-if="word_count == 1 && examples.length>0" id="examples" class="row p-1" >
      <hr>
      <span>Examples: </span>
      <div class="sentences col" v-for="(example,i) in examples" :key="i">
        <div v-for="(sentence) in example" :key="sentence.textContent">
          <img src='/imgs/music-32.png' class="play-btn" @click="audio_play(sentence.textContent)">
          <span v-html="sentence.innerHTML"></span>
        </div>
      </div>
      <div class="mt-3 text-danger" v-if="examples[0] && examples[0].length < 1" >
        -
      </div>
    </div>
    <div v-if="error">
      <hr>
      <span class="mt-3 text-danger">{{ error }}</span>
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
    multi_langs: {type: Boolean, default: false},
    current_selected: {type: String, default: null},
  },
  data() {
    return {
      autoplay: true,
      loading: false,
      support_langs: {"en": "EN", "zh-CN": "简中"},
      lang_en: true,
      lang_zh: true,
      langs: this.multi_langs ? ['en', 'zh-CN'] : 'zh-CN',
      dicts: [],
      examples: [],
      // current_selected: null,
      trans_text: null,
      word_count: null,
      error: null,
    }
  },
  methods: {
    init(){
      var that = this
      that.dicts = []
      that.examples = [[]]
      if (Array.isArray(this.langs) && this.langs.length > 1) {
        that.dicts = [[],[]]
        that.examples = [[],[]]
      }
    },
    langChange(){
      console.log("langs change: ")
      console.log(this.langs)
    },
    clickword(word) {
      if (word.length < 1) {
        return
      }
      var that = this
      that.init()
      that.loading = true

      word = word.toLowerCase()
      let langs = Array.isArray(that.langs) ? that.langs.join(",") : that.langs
      transApi.explanation(word, langs).then(function (res) {
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

      }).catch(err => {
        console.log(err)
        that.loading = false
      })
    },
    translate(query) {
      var that = this
      that.loading = true
      that.trans_text = null
      // axios.get("https://vocabulary-master.local/translate.php?query="+query)
      transApi.translate(query).then(function (res) {
        that.trans_text = res.data
        that.loading = false
      }).catch(err => {
        console.log(err)
        that.loading = false
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
      return 'https://dict.youdao.com/dictvoice?type=1&audio=' + text.replace(/\s*(\n)?\s*\(?\d+\)?\.?\s+/, "").replaceAll(/\s*(\n)?\s*$/g, "").replaceAll(/\[\w+\d?\]/g, "")
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
        if (this.current_selected.length < 1) {
          return
        }
        this.error = null
        this.init()
        this.word_count = this.current_selected.split(" ").length

        if (this.word_count > 1) {
          //  sentences selected
          console.log("selected length: " + this.current_selected.length)
          if (this.word_count > 100) {
            this.error = "Sentences selected too long!"
            this.trans_text = null
          } else {
            this.translate(this.current_selected.replace(/\[[A-Za-z0-9]+\]/g, ""))
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
