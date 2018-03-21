import SideBar from '@/components/SideBar/SideBar.vue';

export default {
  name: 'wallet',
  components: {
    'sidebar': SideBar
  },
  created() {
    this.$store.dispatch('initWallets')
    this.$router.push('balance')
  }
}