<template>
	<nav id="sidebar">
		<div class="logo">
			<img src="../assets/icon-logo-monaize.svg" />
		</div>
		<ul class="list-unstyled">
			<router-link to="balance"><li><a id="balance-view" class="item active"><img id="icon-balances" src="../assets/icon-balances.svg" class="number-view" />BALANCES</a></li></router-link>
			<router-link to="buy"><li><a id="buy-view" class="item"><img id="icon-buy-mnz" src="../assets/icon-buy-mnz-grey.svg" class="number-view" />BUY MNZ</a></li></router-link>
			<router-link to="withdraw"><li><a id="withdrawal-view" class="item"><img id="icon-withdrawal" src="../assets/icon-withdrawal-grey.svg" class="number-view" />WITHDRAWAL</a></li></router-link>
		</ul>
		<a href="" id="logout" @click="$store.dispatch('logout')">
			<p><img id="icon-logout" src="../assets/icon-logout.svg"/>Log out</p>
		</a>
	</nav>
</template>

<script>
***REMOVED***

***REMOVED***
</script>

<style>

</style>
