<template>
	<select>
		<option v-for="o in options">{{o}}</option>
	</select>
</template>



<script type="text/javascript">
import 'select2'

export default {
	name: 'select2',
	props: ['options', 'value'],
	mounted: function () {
		var vm = this
		$(this.$el)
		  // init select2
		  .select2({ data: this.options })
		  .val(this.value)
		  .trigger('change')
		  // emit event on change.
		  .on('change', function () {
		  	vm.$emit('input', this.value)
			})
			this.$root.$on('select2:open', () => {
				console.log('opening select2 dropdown...')
				$(this.$el).select2('open');
			})
		},
		watch: {
			value: function (value) {
		  // update value
		  $(this.$el).val(value)
		},
		options: function (options) {
		  // update options
		  $(this.$el).empty().select2({ data: options })
		}
	},
	destroyed: function () {
		$(this.$el).off().select2('destroy')
	}
}
</script>

<style type="text/css" >
@import "~select2/dist/css/select2.min.css";
.content .select2-selection:focus {
	outline: none;
	box-shadow: none;
}

.select2-selection {
	width: 126px !important;
}

.select2-container--open .select2-dropdown--below {
  width: 151px !important;
  margin-left: -24px !important;
}

.select2-selection__rendered {
  line-height: 75px !important;
  text-align: center;
  color: #7c398a !important;
  font-weight: 200;
}

.select2-selection {
  height: 75px !important;
  width: 126px;
  border-color: #7c398a !important;
  font-size: 1.8em;
  font-weight: 300;
  border-top-left-radius: 0px 0px !important;
  border-bottom-left-radius: 0px 0px !important;
}

.select2-selection__rendered {
  padding: 0px !important;
}

.select2-selection__arrow {
  display: none;
}

.select2-search__field {
  outline: none;
}

.select2-selection {
  outline: none;
}

.select2-container--default .select2-results__option--highlighted[aria-selected] {
	background-color:#7c398a;
  color: white;
}
</style>