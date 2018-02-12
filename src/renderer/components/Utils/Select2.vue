<template>
	<select>
		<option v-for="o in options">{{o***REMOVED******REMOVED***</option>
	</select>
</template>



<script type="text/javascript">
import 'select2'

***REMOVED***
	name: 'select2',
	props: ['options', 'value'],
	mounted: function () {
		var vm = this
		$(this.$el)
		  // init select2
		  .select2({ data: this.options ***REMOVED***)
		  .val(this.value)
		  .trigger('change')
		  // emit event on change.
		  .on('change', function () {
		  	vm.$emit('input', this.value)
			***REMOVED***)
			this.$root.$on('select2:open', () => {
				console.log('opening select2 dropdown...')
				$(this.$el).select2('open');
			***REMOVED***)
		***REMOVED***,
		watch: {
			value: function (value) {
		  // update value
		  $(this.$el).val(value)
		***REMOVED***,
		options: function (options) {
		  // update options
		  $(this.$el).empty().select2({ data: options ***REMOVED***)
		***REMOVED***
	***REMOVED***,
	destroyed: function () {
		$(this.$el).off().select2('destroy')
	***REMOVED***
***REMOVED***
</script>

<style type="text/css" >
@import "~select2/dist/css/select2.min.css"
</style>