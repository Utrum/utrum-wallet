<template>
	<nav id="sidebar">
		<div class="logo">
			<img src="../assets/icon-logo-monaize.svg" />
		</div>
		<ul class="list-unstyled">
			<li>
				<router-link active-class="active" tag="a" to="balance">
					<img id="icon-balances" src="../assets/icon-balances.svg" class="number-view" />
					BALANCES
				</router-link>
			</li>
			<li>
				<router-link active-class="active" tag="a" to="buy">
					<img id="icon-buy-mnz" src="../assets/icon-buy-mnz-grey.svg" class="number-view" />
					BUY MNZ
				</router-link>
			</li>
			<li>
				<router-link active-class="active" tag="a" to="withdraw">
					<img id="icon-withdrawal" src="../assets/icon-withdrawal-grey.svg" class="number-view" />
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

}
</script>

<style scoped>

.active {
	transition: all 0.3s;
	color: #ffffff !important;
}

</style>
