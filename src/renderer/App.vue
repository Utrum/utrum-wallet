<template>
  <div id="app">
    <button @click="$store.commit('USER_LOGIN')">LOGIN</button>
    <button @click="$store.commit('USER_LOGOUT')">LOGOUT</button>
    <wallet-view></wallet-view>
    <!-- <login-form v-if="$store.state.User.loggedIn"></login-form>
    <router-view v-else></router-view> -->
  </div>
</template>

<script>
  ***REMOVED***
    components: {
      'wallet-view': require('@/components/WalletView').default,
      'login-form': require('@/components/LoginForm').default
    ***REMOVED***,
    name: 'vue-dico'
  ***REMOVED***
</script>

<style>
/* CSS declarations go here */
@import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700');

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
  margin-left: 225px;
  height: 100vh;
  width: 100%;
***REMOVED***

#sidebar {
  font-weight: 600;
  font-size: 0.9em;
  width: 50%;
  padding: 20px;
  min-width: 225px;
  max-width: 225px;
  height: 100vh;
  background: rgb(250,250,250);
  transition: all 0.3s;
  position: fixed;
  background-color: #180d39;
***REMOVED***

.logo {
  display: block;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 80px;
  width: 50%;
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
</style>
