<template>
  <q-page>
    <q-toolbar class="bg-primary">
      <q-breadcrumbs>
        <q-breadcrumbs-el
          label="datacenter"
          icon="fas fa-server"
          class="breadcrumbs-item"
          to="/datacenter"
        />
        <q-breadcrumbs-el
          :label="nodeId"
          icon="storage"
          class="breadcrumbs-item"
          :to="`/datacenter/node/${nodeId}`"
        />
        <q-breadcrumbs-el
          :label="vmId"
          icon="fas fa-cube"
          class="breadcrumbs-item"
        />
      </q-breadcrumbs>
      <q-space />

      <q-btn :ripple="{ color: 'blue-14' }" color="blue-6" class="q-mr-sm">
        <q-icon name="fa fa-cogs" class="q-mr-sm" />
        <q-menu>
          <q-list>
            <q-item clickable v-close-popup disable>
              <q-item-section>
                <div>
                  <q-icon name="fa fa-lock" class="q-mr-sm" />
                  TFA
                </div>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-separator />
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <router-view />
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const $route = useRoute();
    const nodeId = ref($route.params.nodeId);
    const vmId = ref($route.params.vmId);

    return {
      nodeId,
      vmId,
    };
  },
});
</script>

<style lang="scss" scoped>
.breadcrumbs-item {
  color: white;
}
</style>
