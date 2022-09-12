<template>
<div class="list-col">
  <div v-for="(ele, i) in list" :key="ele[0]" @click="clickItem(ele)" class="list-item"
       :class="(current_item ? (current_item[0] == ele[0]): i == 0) ? 'active' : ''">
    <span class="text">{{ ele[2] ? ele[2] : ele[0]  }}</span>
    <span class="count badge rounded-pill bg-danger text-white">{{ ele[1] }}</span>
  </div>
</div>
</template>

<script>
export default {
  props: {
    list: {type: Array, default: function(){return []}}
  },
  name: "ListColumn",
  data(){
    return {
      current_item: null
    }
  },
  methods: {
    clickItem(e) {
      this.current_item = e
      this.$emit("clickItem", e)
    }
  },
  watch: {
    list(){
      // this.current_item = val[0]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../scss/list-col";
</style>
