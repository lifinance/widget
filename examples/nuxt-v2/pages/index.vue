<template>
  <LiFiWidget />
</template>

<script lang="ts">
import Vue from 'vue';
import { VuePlugin } from 'vuera';
import LiFiWidget from '~/components/LiFiWidget.vue';

Vue.use(VuePlugin)

export default Vue.extend({
    name: "IndexPage",
    components: { LiFiWidget }
})
</script>
