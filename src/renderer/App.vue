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
  created() {
    this.$store.dispatch("startUpdateBalances")
    this.$store.dispatch("startUpdateConfig")
    this.$store.dispatch('startUpdateHistory')
  },
  computed: {
    userLoggedIn() {
      return this.$store.state.User.loggedIn
    }
  }
}
</script>

<style>
@import '~typeface-montserrat';

.contentModalBuy .row-main-item .row {
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  height: 70px;
}

.contentModalBuy .row-main-item .row .row-main-item {
  padding-left: 10px;
  padding-right: 20px;
}

.contentModalBuy .row-main-item .subTitle{
  align-self: flex-end;
  margin-bottom: 17px;
}

.contentModalBuy .row-main-item {
	/* margin-top: 20px;
	margin-bottom: 20px; */
}

.contentModalBuy .col-custom span {
	text-align: right;
}

.contentModalBuy hr {
  border-style: none;
  height: 1px;
  margin: 0;
	background-image: linear-gradient(to left, rgba(0,0,0, 0.1) 50%, transparent 0%);
	background-position: bottom;
	background-size: 15px 1px;
	background-repeat: repeat-x;
}

hr {
	display: block;
	height: 1px;
	border: 0;
	border-top: 1px solid rgba(0,0,0, 0.1);;
	padding: 0;
}
.row-total-amount h2 {
	margin: 0px;
	font-size: 1em;
	font-weight: 500;
	color: #180d39;
  align-self: flex-end;
	padding-left: 20px;
	margin: 0px !important;
}

.headerModalBuy {
	text-align: center;
	width: 100%;
}

.headerModalBuy h2 {
	margin-top: 10px;
	color: #7c398a;
	font-weight: 400;
	font-size: 1.5em;
}

.selectAmount {
	color: #180d39;
	font-weight: 500;
}

.footerBuyModal #confirm {
	border: none;
	background-color: #7c398a;
	color: white;
	margin-right: 20px;
	min-height: 40px;
	max-height: 40px;
	height: 40px;
}

.footerBuyModal #cancel {
	margin-left: 20px;
	background-color: transparent;
	border: 2px solid rgba(24,13,57,0.1);
	min-height: 40px;
	max-height: 40px;
	height: 40px;
	padding: 0px;
}

.footerBuyModal button {
	width: 160px;
	min-width: 160px;
	max-width: 160px;
	outline: none;
}

.footerBuyModal .col {
	flex-grow: 1;
}
.footerBuyModal {
	width: 100%;
	justify-content: center;
}

.selectFees button {
	display: none !important;
}
.selectFees {
	/* width: 250px; */
}

#amountTotal {
	padding-left: 47px;
}
#totalAmountCoin {
	font-weight: 500;
	font-size: 0.8em;
	padding-top: 7px;
	padding-left: 10px;
}

#totalAmount {
	font-size: 2em;
	font-weight: 200;
	color: rgb(188,0,142);
}

#warningIcon {
	width: 25px;
	margin-right: 7px;
	margin-left: 3px;
}

#warningInfo {
	margin: 0px;
	font-weight: 600;
	font-size: 0.9em;
}
.row-total-amount {
	display: flex;
	flex-direction: column;
	padding-left: 20px;
	padding-right: 20px;
}
.row-total-amount .row {
	justify-content: flex-start;
}

.selectFee {
	text-align: right;
}

#horizontalLine {
	background-image: none;
	display: block;
	height: 1px;
	border: 0;
	border-top: 2px solid #f3f4fc;
	margin: 1em 0;
	padding: 0;
}

.contentModalBuy {
	width: 100%;
}



.swal2-modal .swal2-styled {
  background-color:#7c398a !important;
  outline: none;
}



.modal-content {
  border: none;
  /* width: 450px; */
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
  border: none !important;
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
  font-family: 'Montserrat', sans-serif !important;
  background: #fafafa !important;
  padding: 0px !important;
  margin: 0px !important;
}

p {
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}

a, a:hover, a:focus {
    text-decoration: none !important;
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
  border: none !important;
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

.positiveColor {
	color: #7d2b8e;
}

.negativeColor {
	color: #95989c;
}
</style>
