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
@import "~select2/dist/css/select2.min.css"
</style>