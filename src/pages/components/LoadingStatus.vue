<template>
<div id="loading">
  <span>LOADING</span>
  <span>{{points}}</span>
</div>
</template>

<script>
export default {
  name: "LoadingStatus",
  data: function(){
    return {
      points: "."
    }
  },
  mounted(){
    var that = this
    setInterval(function(){
      that.points += "."
      if (that.points.length > 3){
        that.points = "."
      }
    }, 500)
  }
}
</script>

<style scoped>
div#loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .3);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
