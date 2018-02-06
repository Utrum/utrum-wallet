<template>
  <div id="app">
    <login-form v-if="!userLoggedIn"></login-form>
    <router-view v-else></router-view>
  </div>
</template>

<script>
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

<style>
/* CSS declarations go here */
@import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700');

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
  margin-left: 225px;
  height: 100vh;
  width: 100%;
}

#sidebar {
  font-weight: 600;
  font-size: 0.9em;
  padding-right: 0px;
  width: 50%;
  padding: 20px;
  min-width: 225px;
  max-width: 225px;
  height: 100vh;
  background: rgb(250,250,250);
  transition: all 0.3s;
  position: fixed;
  background-color: #180d39;
}

.logo {
  display: block;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 80px;
  width: 50%;
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
</style>
