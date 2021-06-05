<template>
  <q-menu touch-position context-menu>
    <q-list dense>
      <q-item>
        <q-item-section>{{ $t("common.node") }} '{{ nodeId }}'</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-close-popup>
        <q-item-section>{{ $t("common.createVM") }}</q-item-section>
      </q-item>

      <q-item clickable v-close-popup>
        <q-item-section>{{ $t("common.createCT") }}</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-close-popup>
        <q-item-section>{{ $t("common.bulkStart") }}</q-item-section>
      </q-item>

      <q-item clickable v-close-popup>
        <q-item-section>{{ $t("common.bulkStop") }}</q-item-section>
      </q-item>

      <q-item clickable v-close-popup>
        <q-item-section>{{ $t("common.bulkMigrate") }}</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-close-popup @click="openShell">
        <q-item-section>{{ $t("common.shell") }}</q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable disable>
        <q-item-section>{{ $t("common.WOL") }}</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
import { defineComponent } from "vue";

import { pve } from "boot/axios";

export default defineComponent({
  props: {
    nodeId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    return {
      openShell() {
        const baseUrl = pve.defaults.baseURL.slice(0, -11); // hacky way to remove /api2/json/ from baseURL
        const url = `${baseUrl}/?console=shell&xtermjs=1&vmid=&vmname=&node=${props.nodeId}&cmd=`; // TODO rewrite with URL
        const windowFeature = "location=yes,status=yes";
        window.open(url, "_blank", windowFeature);
      },
    };
  },
});
</script>
