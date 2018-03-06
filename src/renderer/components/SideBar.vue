<template>
	<nav id="sidebar">
		<div class="logo">
			<img src="../assets/icon-logo-monaize.svg" />
		</div>
		<ul class="list-unstyled">
			<li v-on:click="balanceClicked">
				<router-link  active-class="active" tag="a" to="balance">
					<img v-if="balanceState" id="icon-balances" src="../assets/icon-balances.svg" class="number-view" />
					<img v-else id="icon-balances" src="../assets/icon-balances-grey.svg" class="number-view" />
					BALANCES
				</router-link>
			</li>
			<li v-on:click="buyMnzClicked" v-if="getCanBuy">
				<router-link active-class="active" tag="a" to="buy">
					<img v-if="buyMnzState" id="icon-buy-mnz" src="../assets/icon-buy-mnz.svg" class="number-view" />
					<img v-else id="icon-buy-mnz" src="../assets/icon-buy-mnz-grey.svg" class="number-view" />
					BUY MNZ
				</router-link>
			</li>
			<li v-on:click="withdrawalClicked">
				<router-link  active-class="active" tag="a" to="withdraw">
					<img v-if="withdrawalState" id="icon-withdrawal" src="../assets/icon-withdrawal.svg" class="number-view" />
					<img v-else id="icon-withdrawal" src="../assets/icon-withdrawal-grey.svg" class="number-view" />
					WITHDRAWAL
				</router-link>
			</li>
		</ul>
		<a href="" id="logout" @click="$store.dispatch('logout')">
			<p><img id="icon-logout" src="../assets/icon-logout.svg"/>Log out</p>
		</a>
	</nav>
</template>

<script>
export default {
	name: 'sidebar',
	data() {
		return {
			balanceState: true,
			buyMnzState: false,
			withdrawalState: false,
		}
	},
	computed: {
		getCanBuy() {
			let config = this.$store.getters.getConfig;
			let date = Date();
			console.log(config.progress);
			if (!(config.progress <= 1 && config.icoBegin > date && date < config.icoEnd)) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {
		balanceClicked() {
			console.log("test");
			this.balanceState = true;
			this.buyMnzState = false;
			this.withdrawalState = false;
		},
		buyMnzClicked() {
			this.balanceState = false;
			this.buyMnzState = true;
			this.withdrawalState = false;
		},
		withdrawalClicked() {
			this.balanceState = false;
			this.buyMnzState = false;
			this.withdrawalState = true;
		}
	}
}
</script>

<style scoped>

.active {
	transition: all 0.3s;
	color: #ffffff !important;
}

.logo {
  display: block;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 80px;
  width: 50%;
  width: 92px;
}

#sidebar {
  font-weight: 600;
  font-size: 0.9em;
  width: 50%;
  padding: 15px;
  min-width: 240px;
  max-width: 240px;
  height: 100vh;
  background: rgb(250,250,250);
  transition: all 0.3s;
  position: fixed;
  background-color: #180d39;
}

</style>
