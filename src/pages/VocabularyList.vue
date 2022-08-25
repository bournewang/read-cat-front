<template>

  <header>
    <h1>Academic Word List exercise</h1>
    <!--    <span>The Academic Word List (AWL) is a list of 570 of the most common academic words found in academic texts. Below is the full word list.</span>-->

    <select @change="loadWordsList" v-model="current_list_type">
      <option v-for="type in list_types" :value="type" :key="type">{{ type }}</option>
    </select>

    <!--    <v-select v-model="current_list_type" :options="list_types" @change="wordListChange"/>-->

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
                  {{ i + 1 }}.&nbsp;
                  <span
                      :class="word_str(word) + (mastered_words.indexOf(word) > -1 ? ' delete' : '') + (current_selected == word ? ' current' : '')"
                      @click="clickword(word)">{{ word }}</span>
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
                  {{ i + 1 }}.&nbsp;
                  <span :class="word_str(word) + (mastered_words.indexOf(word) > -1 ? ' delete' : '')"
                        @click="clickword(word)">{{ word }}</span>
                  <hr v-if="(i+1) % 10 == 0">
                </li>
              </template>
            </ul>
          </div>
        </div>

      </div>

      <div class="col-9 ">
       <explanation-panel :current_selected="current_selected"></explanation-panel>
      </div>


    </div>
  </div>
</template>

<script>
import vocabularyApi from "@/api/vocabulary";
// import Examples from "@/pages/components/ExamplesPanel";
// import Loading from "@/pages/components/LoadingStatus";
import 'mdb-vue-ui-kit/css/mdb.min.css';
import ExplanationPanel from "@/pages/components/ExplanationPanel";
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap.bundle.js'

export default {
  components: {"explanation-panel": ExplanationPanel},
  data() {
    return {
      counter: 0,
      words: [],
      list_types: ["A1", "A2", "B1", "B2", "C1", "C1-1", "C1-2", "awl", "Listening"],
      current_list_type: "awl",
      mastered_words: [],
      current_selected: "",
    }
  },
  mounted() {
    this.loadWordsList()

    let words = window.localStorage.getItem("mastered_words")
    if (words) {
      this.mastered_words = words.split(',')
    }

    window.addEventListener("mouseup", this.mouseupHandler)
  },
  methods: {
    mouseupHandler() {
      var string = window.getSelection().toString().trim()
      let that = this
      // select not changed, do nothing
      if (that.current_selected == string) {
        return
      }
    },
    clickword(word) {
      // console.log("you click word: "+word)
      this.current_selected = word
    },
    checkword() {
      window.localStorage.setItem("mastered_words", this.mastered_words.toString())
    },

    loadWordsList() {
      var that = this
      vocabularyApi.list(this.current_list_type)
          .then(function (res) {
            if (Array.isArray(res.data)) {
              that.words = res.data
            } else {
              that.words = Object.keys(res.data)
              // that.words_trans = res.data
            }
            console.log("return list is array--------:" + Array.isArray(res.data))
            // that.current_selected = that.words[0]
            that.clickword(that.words[0])
          })
    },
    word_str(word) {
      return word.replace(" ", "-")
    }
  },
  computed: {

  }
}
</script>


<style lang="scss" scoped>
@import "../scss/vocabulary-list.scss";
</style>
