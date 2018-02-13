<template>
  <div id="app">
    <login-form v-if="!userLoggedIn"></login-form>
    <router-view v-else></router-view>
  </div>
</template>

<script>
  ***REMOVED***
    components: {
      'login-form': require('@/components/LoginForm').default
    ***REMOVED***,
    name: 'vue-dico',
    data () {
      return {
        
      ***REMOVED***
    ***REMOVED***,
    computed: {
      userLoggedIn() {
        return this.$store.state.User.loggedIn
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
</script>

<style>
/* CSS declarations go here */
@import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700');

.modal-header {
  text-align: center;
  border-bottom: none !important;
***REMOVED***

.select2-container--open .select2-dropdown--below {
  width: 151px !important;
  margin-left: -24px !important;
***REMOVED***

.select2-selection__rendered {
  line-height: 75px !important;
  text-align: center;
  color: #7c398a !important;
  font-weight: 200;
***REMOVED***

.select2-selection {
  height: 75px !important;
  width: 126px;
  border-color: #7c398a !important;
  font-size: 1.8em;
  font-weight: 300;
  border-top-left-radius: 0px 0px !important;
  border-bottom-left-radius: 0px 0px !important;
***REMOVED***

.select2-selection__rendered {
  padding: 0px !important;
***REMOVED***

.select2-selection__arrow {
  display: none;
***REMOVED***

.select2-search__field {
  outline: none;
***REMOVED***

.select2-selection {
  outline: none;
***REMOVED***

.cal{
  max-width: 100%;

***REMOVED***
#wrapper {
  width: 100%;
  margin: 0 auto;
***REMOVED***

#leftcolumn {
  width: 50%;
  float:  left;
***REMOVED***

#rightcolumn {
  float:right;
***REMOVED***

.container {
  margin-right: auto;
  margin-left: auto;
  width: 600px;
***REMOVED***

@media (max-width: 700px) {

  .cal{
    max-width: 100%;
    max-height: 80%;

  ***REMOVED***

  #wrapper {
      width: 100%;
      margin: 0 auto;
  ***REMOVED***

  #leftcolumn {
    width: 100%;
    float:  top;
  ***REMOVED***

  #rightcolumn {
    width: 100%;
  float:bottom;
  ***REMOVED***

***REMOVED***

.wrapper {
  display: flex;
***REMOVED***

a[data-toggle="collapse"] {
    position: relative;
***REMOVED***

a[aria-expanded="false"]::before, a[aria-expanded="true"]::before {
    content: '\e259';
    display: block;
    position: absolute;
    right: 20px;
    font-family: 'Glyphicons Halflings';
    font-size: 0.6em;
***REMOVED***

a[aria-expanded="true"]::before {
    content: '\e260';
***REMOVED***

body {
  font-family: 'Montserrat', sans-serif;
  background: #fafafa;
***REMOVED***

p {
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
***REMOVED***

a, a:hover, a:focus {
    text-decoration: none;
***REMOVED***

#content {
  margin-left: 240px;
  height: 100vh;
***REMOVED***

.number-view {
  padding-right: 20px;
  fill: red;
***REMOVED***

#sidebar .sidebar-header {
  background: #6d7fcc;
***REMOVED***

#sidebar ul.components {
  border-bottom: 1px solid #47748b;
***REMOVED***

#sidebar ul p {
  color: #fff;
  padding: 10px;
***REMOVED***

#sidebar ul li {
  margin: 20px 0;
***REMOVED***

button span {
  padding-right: 10px;
***REMOVED***

#logout {
  position: fixed;
  bottom: 20px;
***REMOVED***

#sidebar ul li a {
  padding: 13px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 26px;
  font-size: 1.1em;
  color: rgb(151,151,151);
  display: block;
  list-style-type: none;
  cursor: pointer;
***REMOVED***

#sidebar ul li{
  color: rgb(151,151,151);
***REMOVED***

#sidebar ul li > a.active {
  color: #ffffff;
***REMOVED***

ul ul a {
  font-size: 0.3em !important;
  padding-left: 30px !important;
  background: #6d7fcc;
***REMOVED***

#icon-logout {
  padding-right: 30px;
  padding-left: 20px;
***REMOVED***

#logout p {
  color: white;
  font-weight: 500;
***REMOVED***

.btn-primary {
  border: 1px solid #7c398a;
  border-radius: 4px !important;
  background-color: transparent;
  color: #7c398a;
  outline: none;
***REMOVED***

.btn-primary:hover {
  background-color: #7c398a;
  border: 1px solid #7c398a;
***REMOVED***

.card {
  box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
  border-radius: 4px;
  border: none;
***REMOVED***

</style>
