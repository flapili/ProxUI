<template>
  <q-menu touch-position context-menu>
    <q-list dense>
      <q-item>
        <q-item-section> {{ $t("common.VM") }} '{{ vm.vmid }}' </q-item-section>
      </q-item>

      <q-separator />

      <q-item
        v-if="!vm.isOnline"
        clickable
        v-close-popup
        @click="doAction(vm.nodeId, vm.vmid, 'start')"
      >
        <q-item-section>
          <div>
            <q-icon name="fa fa-play" class="q-mr-sm" />
            {{ $t("common.start") }}
          </div>
        </q-item-section>
      </q-item>

      <q-item
        v-if="vm.isPaused"
        clickable
        v-close-popup
        @click="doAction(vm.nodeId, vm.vmid, 'resume')"
      >
        <q-item-section>
          <div>
            <q-icon name="fa fa-play" class="q-mr-sm" />
            {{ $t("common.resume") }}
          </div>
        </q-item-section>
      </q-item>

      <q-item
        v-if="vm.isOnline && !vm.isPaused"
        clickable
        v-close-popup
        @click="doAction(vm.nodeId, vm.vmid, 'suspend')"
      >
        <q-item-section>
          <div>
            <q-icon name="fa fa-pause" class="q-mr-sm" />
            {{ $t("common.suspend") }}
          </div>
        </q-item-section>
      </q-item>

      <q-item
        v-if="vm.isOnline && !vm.isPaused"
        clickable
        v-close-popup
        @click="doAction(vm.nodeId, vm.vmid, 'suspend', { todisk: 1 })"
      >
        <q-item-section>
          <div>
            <q-icon name="fa fa-download" class="q-mr-sm" />
            {{ $t("common.hibernate") }}
          </div>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-close-popup="vm.isOnline && !vm.isPaused"
        :disable="!vm.isOnline || vm.isPaused"
        @click="doAction(vm.nodeId, vm.vmid, 'shutdown')"
      >
        <q-item-section>
          <div>
            <q-icon name="fa fa-power-off" class="q-mr-sm" />
            {{ $t("common.shutdown") }}
          </div>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-close-popup="vm.isOnline"
        :disable="!vm.isOnline"
        @click="doAction(vm.nodeId, vm.vmid, 'stop')"
      >
        <q-item-section>
          <div>
            <q-icon name="fa fa-stop" class="q-mr-sm" />
            {{ $t("common.stop") }}
          </div>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-close-popup="vm.isOnline"
        :disable="!vm.isOnline"
        @click="doAction(vm.nodeId, vm.vmid, 'reboot')"
      >
        <q-item-section>
          <div>
            <q-icon name="fas fa-redo" class="q-mr-sm" />
            {{ $t("common.reboot") }}
          </div>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-close-popup @click="cloneVM(vm.nodeId, vm.vmid)">
        <q-item-section>
          <div>
            <q-icon name="fa fa-clone" class="q-mr-sm" />
            {{ $t("common.clone") }}
          </div>
        </q-item-section>
      </q-item>

      <template
        v-if="vm.type != 'template'"
        @click="convertToTemplate(vm.vmid)"
      >
        <q-item clickable v-close-popup>
          <q-item-section>
            <div>
              <q-icon name="fa fa-file" class="q-mr-sm" />
              {{ $t("common.convertToTemplate") }}
            </div>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-close-popup @click="openShell">
          <q-item-section>
            <div>
              <q-icon name="fa fa-terminal" class="q-mr-sm" />
              {{ $t("common.shell") }}
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-menu>
</template>

<script>
import qs from "querystring";

import { defineComponent } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

import { useQuasar } from "quasar";

import { pve } from "boot/axios";

export default defineComponent({
  props: {
    vm: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const $store = useStore();
    const { t } = useI18n();

    const $q = useQuasar();

    return {
      async doAction(nodeId, vmId, action, opt = {}) {
        try {
          await pve.post(
            `nodes/${nodeId}/qemu/${vmId}/status/${action}`,
            qs.stringify(opt)
          );

          $q.notify({
            type: "positive",
            position: "top",
            message: `${t("notify.requestSent", { nodeId, vmId })} (${action} VM ${vmId})`,
          });
        } catch (error) {
          console.error(error);
          $q.notify({
            type: "negative",
            position: "top",
            message: error.message,
          });
        }
      },

      async cloneVM(nodeId, vmId) {
        alert(`todo: nodeId = ${nodeId}, vmId = ${vmId}`);
      },

      async convertToTemplate(vmId) {
        alert(`todo: vmId = ${vmId}`);
      },

      openShell() {
        const baseUrl = pve.defaults.baseURL.slice(0, -11); // hacky way to remove "/api2/json/" from baseURL
        const url = new URL(baseUrl);

        if (props.vm.type === "vm") {
          url.searchParams.append("console", "kvm");
          url.searchParams.append("novnc", 1);
        } else if (props.vm.type === "lxc") {
          url.searchParams.append("console", "lxc");
          url.searchParams.append("xtermjs", 1);
        }
        url.searchParams.append("vmid", props.vm.vmid);
        url.searchParams.append("vmname", props.vm.label);
        url.searchParams.append("node", props.vm.nodeId);

        const windowFeature = "location=yes,status=yes";
        window.open(url.href, "_blank", windowFeature);
      },
    };
  },
});
</script>
