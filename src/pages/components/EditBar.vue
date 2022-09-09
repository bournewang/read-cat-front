<template>
  <div class="premium-feature jr-edit-bar jr-dark" :style="edit_bar_pos" v-if="show_edit_bar">
    <button class="jr-bold" title="Bold (Ctrl+b)" @click="editAction('jr-bold')">
      <svg viewBox="0 0 15 15">
        <path
            d="M9,3.5 C9,1.57 7.43,0 5.5,0 L1.77635684e-15,0 L1.77635684e-15,12 L6.25,12 C8.04,12 9.5,10.54 9.5,8.75 C9.5,7.45 8.73,6.34 7.63,5.82 C8.46,5.24 9,4.38 9,3.5 Z M5,2 C5.82999992,2 6.5,2.67 6.5,3.5 C6.5,4.33 5.82999992,5 5,5 L3,5 L3,2 L5,2 Z M3,10 L3,7 L5.5,7 C6.32999992,7 7,7.67 7,8.5 C7,9.33 6.32999992,10 5.5,10 L3,10 Z"
            transform="translate(4 3)"></path>
      </svg>
    </button>
    <button class="jr-italics" title="Italicize (Ctrl+i)" @click="editAction('jr-italics')" >
      <svg viewBox="0 0 15 15">
        <polygon points="4 0 4 2 6.58 2 2.92 10 0 10 0 12 8 12 8 10 5.42 10 9.08 2 12 2 12 0"
                 transform="translate(3 3)"></polygon>
      </svg>
    </button>
    <button class="jr-underl" title="Underline (Ctrl+u)" @click="editAction('jr-underl')">
      <svg viewBox="0 0 18 18">
        <path
            d="M6,12 C8.76,12 11,9.76 11,7 L11,0 L9,0 L9,7 C9,8.75029916 7.49912807,10 6,10 C4.50087193,10 3,8.75837486 3,7 L3,0 L1,0 L1,7 C1,9.76 3.24,12 6,12 Z M0,13 L0,15 L12,15 L12,13 L0,13 Z"
            transform="translate(3 3)"></path>
      </svg>
    </button>
    <button class="jr-strike" title="Strike-through (Ctrl+Shift+s)" @click="editAction('jr-strike')">
      <svg viewBox="0 0 533.333 533.333">
        <path
            d="M533.333,266.667V300H411.195c14.325,20.058,22.139,43.068,22.139,66.667c0,36.916-19.094,72.409-52.386,97.377 C350.033,487.23,309.446,500,266.667,500c-42.78,0-83.366-12.77-114.281-35.956C119.094,439.076,100,403.583,100,366.667h66.667 c0,36.137,45.795,66.666,100,66.666s100-30.529,100-66.666c0-36.138-45.795-66.667-100-66.667H0v-33.333h155.999 c-1.218-0.862-2.425-1.731-3.613-2.623C119.094,239.075,100,203.582,100,166.667s19.094-72.408,52.385-97.377 c30.916-23.187,71.501-35.956,114.281-35.956c42.779,0,83.366,12.77,114.281,35.956c33.292,24.969,52.386,60.461,52.386,97.377 h-66.667c0-36.136-45.795-66.667-100-66.667s-100,30.53-100,66.667c0,36.137,45.795,66.667,100,66.667 c41.135,0,80.236,11.811,110.668,33.333H533.333z"
            transform="translate(3 3)"></path>
      </svg>
    </button>


    <button class="jr-remove-styles" title="Clear formatting (Ctrl+\)" @click="editAction('jr-remove-styles')">
      <svg viewBox="0 0 15 15">
        <path
            d="M0.27,1.55 L5.43,6.7 L3,12 L5.5,12 L7.14,8.42 L11.73,13 L13,11.73 L1.55,0.27 L0.27,1.55 L0.27,1.55 Z M3.82,0 L5.82,2 L7.58,2 L7.03,3.21 L8.74,4.92 L10.08,2 L14,2 L14,0 L3.82,0 L3.82,0 Z"
            transform="translate(2 3)"></path>
      </svg>
    </button>
    <button class="jr-deleteSel" title="Delete highlighted text (Ctrl+Shift+d)" @click="editAction('jr-deleteSel')">
      <svg viewBox="0 0 1792 1792">
        <path
            d="m702.89 734.91v579.46c0 9.3908-3.0099 17.096-9.0296 23.116-6.0197 6.0198-13.725 9.0296-23.116 9.0296h-64.411c-9.3908 0-17.096-3.0098-23.116-9.0296-6.0197-6.0197-9.0296-13.725-9.0296-23.116v-579.46c0-9.3908 3.0099-17.096 9.0296-23.116s13.725-9.0296 23.116-9.0296h64.411c9.3908 0 17.096 3.0099 23.116 9.0296s9.0296 13.725 9.0296 23.116zm257.52 0v579.46c0 9.3908-3.0099 17.096-9.0296 23.116-6.0197 6.0198-13.725 9.0296-23.116 9.0296h-64.411c-9.3908 0-17.096-3.0098-23.116-9.0296-6.0197-6.0197-9.0296-13.725-9.0296-23.116v-579.46c0-9.3908 3.0099-17.096 9.0296-23.116s13.725-9.0296 23.116-9.0296h64.411c9.3908 0 17.096 3.0099 23.116 9.0296s9.0296 13.725 9.0296 23.116zm257.52 0v579.46c0 9.3908-3.0098 17.096-9.0296 23.116-6.0197 6.0198-13.725 9.0296-23.116 9.0296h-64.411c-9.3908 0-17.096-3.0098-23.116-9.0296-6.0197-6.0197-9.0295-13.725-9.0295-23.116v-579.46c0-9.3908 3.0098-17.096 9.0295-23.116 6.0198-6.0197 13.725-9.0296 23.116-9.0296h64.411c9.3908 0 17.096 3.0099 23.116 9.0296 6.0198 6.0197 9.0296 13.725 9.0296 23.116zm128.7 728.27v-953.52h-901.27v953.65c0 14.809 2.2875 28.293 6.9829 40.693 4.6954 12.401 9.5112 21.43 14.568 27.209 5.0566 5.6585 8.548 8.548 10.595 8.548h836.86c2.0467 0 5.5381-2.8895 10.595-8.548 5.0566-5.6586 9.8724-14.809 14.568-27.209 4.8158-12.401 7.1033-26.005 7.1033-40.814zm-675.9-1082.3h450.64l-48.278-117.75c-4.6954-6.0197-10.354-9.752-17.096-11.076h-318.93c-6.7421 1.3243-12.401 5.0566-17.096 11.076zm933.42 32.266v64.411c0 9.3908-3.0099 17.096-9.0296 23.116-6.0197 6.0197-13.725 9.0296-23.116 9.0296h-96.556v953.65c0 55.622-15.772 103.78-47.315 144.35-31.543 40.573-69.347 60.799-113.65 60.799h-836.98c-44.305 0-82.109-19.624-113.65-58.873-31.543-39.249-47.315-86.684-47.315-142.31v-957.62h-96.556c-9.3908 0-17.096-3.0099-23.116-9.0296-6.0197-6.0197-9.0296-13.725-9.0296-23.116v-64.411c0-9.3908 3.0099-17.096 9.0296-23.116s13.725-9.0296 23.116-9.0296h310.86l70.431-167.95c10.113-24.801 28.172-45.991 54.298-63.328 26.126-17.457 52.612-26.126 79.46-26.126h321.94c26.848 0 53.335 8.6684 79.46 26.126s44.305 38.526 54.298 63.328l70.431 167.95h310.86c9.3908 0 17.096 3.0099 23.116 9.0296 6.0197 5.8993 9.0296 13.725 9.0296 23.116z"
            stroke-width="1.2039"></path>
      </svg>
    </button>
    <div class="jr-color-picker jr-text-picker" :style="show_text_colors ? 'display:block' : 'display: none;'">
      <button class="jr-text-color" title="Text color (Ctrl+Shift+c)" >
        <svg viewBox="0 0 15 15">
          <path
              d="M7,0 L5,0 L0.5,12 L2.5,12 L3.62,9 L8.37,9 L9.49,12 L11.49,12 L7,0 L7,0 Z M4.38,7 L6,2.67 L7.62,7 L4.38,7 L4.38,7 Z"
              transform="translate(3 1)"></path>
        </svg>
      </button>
      <div v-for="(color) in text_colors" :key="color" class="jr-color-swatch" :class="'jr-highlight-' + color" :data-color="color" @click="clickTextColor(color)"></div>
    </div>
    <div class="jr-color-picker jr-highlight-picker" :style="show_bg_colors ? 'display:block' : 'display: none;'">
      <button class="jr-highlight-color" title="Highlight color (Ctrl+Shift+h)" >
        <svg viewBox="0 0 15 15">
          <path
              d="M6,5 L2,9 L3,10 L0,13 L4,13 L5,12 L5,12 L6,13 L10,9 L6,5 L6,5 Z M10.2937851,0.706214905 C10.6838168,0.316183183 11.3138733,0.313873291 11.7059121,0.705912054 L14.2940879,3.29408795 C14.6839524,3.68395241 14.6796852,4.32031476 14.2937851,4.7062149 L11,8 L7,4 L10.2937851,0.706214905 Z"
              transform="translate(3 1)"></path>
        </svg>
      </button>
      <div v-for="(color) in highlight_colors" :key="color" class="jr-color-swatch" :class="'jr-highlight-' + color" :data-color="color" @click="clickHighlightColor(color)"></div>
    </div>
  </div>
</template>


<script>
// import axios from 'axios';
import common from "@/common";
const rangyOptions = {exclusive: false};
let rangy = {};
export default {
  props: {
    show_text_colors: {type: Boolean, default: true},
    show_bg_colors: {type: Boolean, default: true}
  },
  data() {
    return {
      text_colors: [
        "yellow",
        "green",
        "blue",
        "purple",
        "pink",
        "red",
        "orange",
        "white",
        "black",
      ],
      highlight_colors: [
        "yellow",
        "green",
        "blue",
        "purple",
        "pink",
        "red",
        "orange",
      ],

      highlighter: null,
      show_edit_bar: false,
      current_select: "",
      edit_bar_pos: ""
    }
  },
  created() {

  },
  mounted() {
    window.onload = function(){
      rangy = window.rangy;
    }
    document.addEventListener("mouseup", this.mouseupHandler)
  },
  methods: {
    mouseupHandler() {
      if (!this.highlighter) {
        this.initHighlighter()
      }
      console.log("======== mouse up handler")
      var sel = rangy.getSelection().toString();
      console.log("select: " + sel)
      if (!sel) {
        this.show_edit_bar = false
        return
      }
      // this.show_text_colors = false
      // this.show_bg_colors = false
      this.current_select = sel;
      console.log("=== mouse up, selection: " + sel)
      const r = rangy.getSelection().nativeSelection.getRangeAt(0).getBoundingClientRect();
      const top = (r.top + document.defaultView.pageYOffset - 60 - 30) + 'px';
      const left = (r.left + r.width / 2 + document.defaultView.pageXOffset - 105) + 'px';

      this.show_edit_bar = true
      this.edit_bar_pos = "position:absolute; display:block; top: " + top + "; left: " + left;
    },
    initHighlighter() {
      console.log("init highlighter ========")
      this.highlighter = rangy.createHighlighter(document) //.getElementById("article-content"));

      const rangeOptions = {
        onElementCreate: elem => {
          elem.id = 'jr-' + common.string_prehandle(this.current_select) //.replaceAll(" ","-") //.toLowerCase() //Date.now();
          // hasSavedLink = false;
          // shareDropdown.classList.remove("active");
          // setTimeout(() => updateSavedVersion(), 10);
        }
      };

      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-yellow", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-blue", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-green", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-pink", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-purple", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-orange", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-highlight-red", rangeOptions));

      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-white", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-black", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-yellow", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-blue", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-green", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-pink", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-purple", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-orange", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-color-red", rangeOptions));

      this.highlighter.addClassApplier(rangy.createClassApplier("jr-strike-through", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-underline", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-italicize", rangeOptions));
      this.highlighter.addClassApplier(rangy.createClassApplier("jr-bolden", rangeOptions));
    },
    editAction(e, c) {
      console.log("======= get action: " + e + ", "+c)
      // emit event to parent
      this.$emit('article_edit')
      switch (e) {
        case "jr-bold":
          this.highlighter.highlightSelection("jr-bolden", rangyOptions);
          break;
        case "jr-italics":
          this.highlighter.highlightSelection("jr-italicize", rangyOptions);
          break;
        case "jr-underl":
          this.highlighter.highlightSelection("jr-underline", rangyOptions);
          break;
        case "jr-strike":
          this.highlighter.highlightSelection("jr-strike-through", rangyOptions);
          break;
        case "jr-remove-styles":
          this.highlighter.unhighlightSelection()
          break;
        case "jr-deleteSel":
          // eslint-disable-next-line no-case-declarations
          const sel = rangy.getSelection(document.getElementById("article-content"));
          if(sel.rangeCount > 0) {
            for(let i = 0; i < sel.rangeCount; i++) {
              sel.getRangeAt(i).deleteContents();
            }
            // hideToolbar();
          }
          break;
        default:
          break;
      }
    },
    clickTextColor(color){
      console.log("click text color: "+color)
      this.$emit('article_edit')
      this.highlighter.highlightSelection("jr-color-" + color, rangyOptions);
    },
    clickHighlightColor(color) {
      console.log("click highlight color: "+color)
      this.$emit('article_edit')
      this.highlighter.highlightSelection("jr-highlight-" + color, { exclusive: true });
    },
  }
}
</script>

<style lang="css" scoped>
</style>
