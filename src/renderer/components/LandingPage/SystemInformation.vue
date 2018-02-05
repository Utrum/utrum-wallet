<template>
  <div>
    <div class="title">Information</div>
    <div class="items">
      <div class="item">
        <div class="name">Path:</div>
        <div class="value">{{ path ***REMOVED******REMOVED***</div>
      </div>
      <div class="item">
        <div class="name">Route Name:</div>
        <div class="value">{{ name ***REMOVED******REMOVED***</div>
      </div>
      <div class="item">
        <div class="name">Vue.js:</div>
        <div class="value">{{ vue ***REMOVED******REMOVED***</div>
      </div>
      <div class="item">
        <div class="name">Electron:</div>
        <div class="value">{{ electron ***REMOVED******REMOVED***</div>
      </div>
      <div class="item">
        <div class="name">Node:</div>
        <div class="value">{{ node ***REMOVED******REMOVED***</div>
      </div>
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">{{ platform ***REMOVED******REMOVED***</div>
      </div>
    </div>
  </div>
</template>

<script>
  ***REMOVED***
    data () {
      return {
        electron: process.versions['atom-shell'],
        name: this.$route.name,
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  ***REMOVED***

  .items { margin-top: 8px; ***REMOVED***

  .item {
    display: flex;
    margin-bottom: 6px;
  ***REMOVED***

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  ***REMOVED***

  .item .value {
    color: #35495e;
    font-weight: bold;
  ***REMOVED***
</style>
