<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// require('bootstrap')

export default {
  components: {
    'login-form': require('@/components/LoginForm').default
  },
  name: 'vue-dico',
  data () {
    return {

    }
  },
  computed: {
    userLoggedIn() {
      return this.$store.state.User.loggedIn
    }
  }
}
</script>

<style lang="css" rel='stylesheet/css'>
@import '~typeface-montserrat';

.modal-content {
  border: none;
  width: 450px;
}

.modal-body {
	padding-top: 0px;
}

.modal-header {
  text-align: center;
  border-bottom: none !important;
  padding-bottom: 0px;
}

.modal-footer {
  border: none;
}

.cal{
  max-width: 100%;

}
#wrapper {
  width: 100%;
  margin: 0 auto;
}

#leftcolumn {
  width: 50%;
  float:  left;
}

#rightcolumn {
  float:right;
}

.container {
  margin-right: auto;
  margin-left: auto;
  width: 600px;
}

@media (max-width: 700px) {

  .cal{
    max-width: 100%;
    max-height: 80%;

  }

  #wrapper {
      width: 100%;
      margin: 0 auto;
  }

  #leftcolumn {
    width: 100%;
    float:  top;
  }

  #rightcolumn {
    width: 100%;
  float:bottom;
  }

}

.wrapper {
  display: flex;
}

a[data-toggle="collapse"] {
    position: relative;
}

a[aria-expanded="false"]::before, a[aria-expanded="true"]::before {
    content: '\e259';
    display: block;
    position: absolute;
    right: 20px;
    font-family: 'Glyphicons Halflings';
    font-size: 0.6em;
}

a[aria-expanded="true"]::before {
    content: '\e260';
}

body {
  font-family: 'Montserrat', sans-serif;
  background: #fafafa;
  padding: 0px !important;
}

p {
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}

a, a:hover, a:focus {
    text-decoration: none;
}

#content {
  margin-left: 240px;
  height: 100vh;
}

.number-view {
  padding-right: 20px;
  fill: red;
}

#sidebar .sidebar-header {
  background: #6d7fcc;
}

#sidebar ul.components {
  border-bottom: 1px solid #47748b;
}

#sidebar ul p {
  color: #fff;
  padding: 10px;
}

#sidebar ul li {
  margin: 20px 0;
}

button span {
  padding-right: 10px;
}

#logout {
  position: fixed;
  bottom: 20px;
}

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
}

#sidebar ul li{
  color: rgb(151,151,151);
}

#sidebar ul li > a.active {
  color: #ffffff;
}

ul ul a {
  font-size: 0.3em !important;
  padding-left: 30px !important;
  background: #6d7fcc;
}

#icon-logout {
  padding-right: 30px;
  padding-left: 20px;
}

#logout p {
  color: white;
  font-weight: 500;
}

.btn-primary {
  border: 1px solid #7c398a;
  border-radius: 4px !important;
  background-color: transparent;
  color: #7c398a;
  outline: none;
}

.btn-primary:hover {
  background-color: #7c398a;
  border: 1px solid #7c398a;
}

.card {
  box-shadow: 0 5px 20px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.01);
  border-radius: 4px;
  border: none;
}

.row-main-item {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
}

.row {
  margin: 0px;
  display: flex;
  justify-content: space-between;
}

.btn-round-light {
  min-height: 50px;
  font-weight: 500;
  border: 3px solid rgba(24,13,57,0.1);
  background-color: rgb(250,250,250);
  border-radius: 50px;
  padding: 10px;
  padding-right: 15px;
  padding-left: 15px;
  color: rgb(51, 51, 51);
  font-size: 0.9em;
  cursor: pointer;
  outline: none;
}

textarea {
    resize: none;
}
</style>
