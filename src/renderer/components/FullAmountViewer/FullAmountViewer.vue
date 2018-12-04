<template>
  <span>
    <span class="amount-first-section">{{firstSection}}</span>
    <span v-if="secondSection" class="amount-second-section">{{secondSection}}</span>
  </span>
</template>

<script>
export default {
  name: 'full-amount-viewer',
  props: {
    amount: {
      type: [String, Number, Object],
      default: 0
    }
  },
  data(){
    return{
      firstSection: 0,
      secondSection: 0
    }
  },
  watch:{
    amount: function(val){
      this.splitNumber()
    }
  },
  created: function(){
    this.splitNumber()
  },
  methods: {
    splitNumber(){
      let strInput = this.amount.toString()
      if(strInput.indexOf(".") > -1){
        this.firstSection = Number(strInput.slice(0, strInput.indexOf('.')+3))
        this.secondSection = Number(strInput.slice(strInput.indexOf('.')+3))
      }
      else{
        this.firstSection = this.amount.toNumber()
        this.secondSection = 0
      }
    }
  }
}
</script>