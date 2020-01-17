<template>
  <v-content>
    <div id="core-view">
      <v-fade-transition mode="out-in" >
        <router-view />
      </v-fade-transition>
    </div>
    <!--<core-footer v-if="$route.name !== 'Maps'" />-->
  </v-content>
</template>

<script>
export default {
  data() {
    return {
      clientHeight: ''
    }
  },
  metaInfo () {
    return {
      title: '店舗認証管理システム'
    }
  },
  mounted() {
  },

  created() {
    this.clientHeight = `${document.documentElement.clientHeight}`;
    this.clientHeight = this.clientHeight - 70 - 56;
  }
}
</script>

<style>
/*#core-view {*/
  /*padding-bottom: 0;*/
  /*overflow-y:scroll;*/
/*}*/


</style>
