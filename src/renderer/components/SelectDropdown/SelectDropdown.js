export default {
  name: 'select-dropdown',

  props: {
    'data': {
      default: [],
      type: Array
    },
    'defaultText':{
      default: 'Select',
      type: String
    },
    'labelProp':{
      default: 'label',
      type: String
    },
    'iconProp':{
      default: null,
      type: String
    },
    'value': {
      default: null,
      type: [Object, Array]
    },
    'searchable': {
      default: false,
      type: Boolean
    },
    'uniqueKeyProp': {
      default: null,
      type: String
    }
  },

  data(){
    return {
      selected: null,
      keyword: ''
    }
  },

  created(){
    this.selected = this.value;
  },

  watch:{
    value: function(val){
      if(!this.selected) this.selected = val; //set selected value if not already set
    }
  },

  methods:{
    onSelect(d){
      this.selected = d
      this.$emit('input', this.selected)
    },
    isActive: function(item){
      if(item == this.selected){
        return true
      }
      else if(this.uniqueKeyProp && item[this.uniqueKeyProp] == this.selected[this.uniqueKeyProp]){
        return true
      }
      else{
        return false
      }
    }
  },

  computed: {
    filteredCoins: function () {
      if(this.keyword && this.keyword.trim() != ""){
        return this.data.filter(val => {
          if(
            val[this.labelProp] &&
            val[this.labelProp].toLowerCase().includes(this.keyword)
          ){
            return true
          }
          else {
            return false
          }
        })
      }
      else {
        return this.data
      }
    }
  }

}
