<template>
  <v-app>
    <core-filter v-if="$route.path!== '/login'"/>

    <core-toolbar v-if="$route.path !== '/login'"/>

    <core-drawer v-if="$route.path!== '/login'"/>

    <core-view />
  </v-app>

</template>

<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
