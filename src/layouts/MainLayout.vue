<template>
  <q-layout view="hHh lpR lFr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> {{ title }} </q-toolbar-title>

        <q-btn :ripple="{ color: 'blue-14' }" color="blue-6" class="q-mr-sm">
          <q-icon name="fa fa-user-cog" class="q-mr-sm" />
          {{ username }}
          <q-menu>
            <q-list>
              <q-item clickable v-close-popup @click="openDialogChangePassword">
                <q-item-section>
                  <div>
                    <q-icon name="fa fa-key" class="q-mr-sm" />
                    {{ $t("common.password") }}
                  </div>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup disable>
                <q-item-section>
                  <div>
                    <q-icon name="fa fa-lock" class="q-mr-sm" />
                    TFA
                  </div>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item
                clickable
                v-close-popup
                @click="openDialogLanguageSwitcher"
              >
                <q-item-section>
                  <div>
                    <q-icon name="fa fa-language" class="q-mr-sm" />
                    {{ $t("common.language") }}
                  </div>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section @click="$q.dark.toggle()">
                  <div>
                    <q-icon
                      :name="$q.dark.isActive ? 'far fa-moon' : 'fas fa-sun'"
                      class="q-mr-sm"
                    />
                    {{ $t("common.theme") }}
                  </div>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <div>
                    <q-icon name="fas fa-sign-out-alt" class="q-mr-sm" />
                    {{ $t("common.logout") }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <q-scroll-area :style="{ height: '100%' }">
        <q-tree :nodes="leftDrawer" node-key="id">
          <template v-slot:default-header="prop">
            <node-context-menu
              v-if="prop.node.type === 'node'"
              :node-id="prop.node.label"
            />
            <vm-context-menu v-if="prop.node.type === 'vm'" :vm="prop.node" />
            <ct-context-menu v-if="prop.node.type === 'lxc'" :vm="prop.node" />

            <router-link
              :to="prop.node.link"
              class="no-text-decoration q-ml-sm"
            >
              <template v-if="prop.node.icon">
                <q-icon
                  v-if="prop.node.customIcon"
                  :class="prop.node.isOnline ? 'online' : 'offline'"
                  class="q-mr-sm"
                >
                  <img
                    :src="'icons/' + prop.node.icon"
                    style="height: 100%; width: 100%"
                  />
                </q-icon>
                <q-icon
                  v-else
                  :name="prop.node.icon"
                  :class="prop.node.isOnline ? 'online' : 'offline'"
                  class="q-mr-sm"
                />
              </template>

              <template v-if="['vm', 'lxc'].includes(prop.node.type)">
                <q-icon
                  v-if="prop.node.isOnline && !prop.node.isPaused"
                  name="fa fa-play"
                  class="inner-icon"
                  color="green"
                />
                <q-icon
                  v-else-if="prop.node.isPaused"
                  name="fa fa-pause"
                  class="inner-icon"
                  color="orange"
                />
                <q-icon
                  v-else-if="prop.node.isLocked"
                  name="fa fa-download"
                  class="inner-icon"
                  color="black"
                />
              </template>
              <span :class="prop.node.isOnline ? 'online' : 'offline'">
                {{ prop.node.label }}
              </span>
            </router-link>
          </template>
        </q-tree>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { useQuasar } from "quasar";

import LanguageSwitcherDialog from "components/Dialog/LanguageSwitcherDialog.vue";
import ChangePasswordDialog from "components/Dialog/ChangePasswordDialog.vue";
import NodeContextMenu from "components/leftDrawerContextMenu/NodeContextMenu.vue";
import VmContextMenu from "src/components/leftDrawerContextMenu/VmContextMenu.vue";
import CtContextMenu from "src/components/leftDrawerContextMenu/CtContextMenu.vue";

export default defineComponent({
  components: {
    NodeContextMenu,
    VmContextMenu,
    CtContextMenu,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();

    const $q = useQuasar();

    let intervalID = null;

    const username = computed(() => $store.state.credentials.username);
    const title = computed(() => $store.state.titleDrawer.title);

    const leftDrawer = computed(() => {
      const nodes = $store.state.nodes.nodes;
      const tree = [
        {
          id: "tasks",
          isOnline: true,
          label: "tasks",
          icon: "fas fa-tasks",
          type: "tasks",
          link: "/tasks",
        },
        {
          id: "datacenter",
          isOnline: true,
          label: "datacenter", // todo ? translation ?
          icon: "fas fa-server",
          type: "datacenter",
          link: "/datacenter",
          children: [
            {
              id: "datacenter-tabs",
              isOnline: true,
              label: "tabs", // TODO ? translation ?
              type: "tabs",
              link: "/datacenter",
              children: [
                {
                  id: "datacenter-tabs-search",
                  isOnline: true,
                  label: "Search", // TODO ? translation ?
                  icon: "fa fa-search",
                  type: "tabs",
                  link: "/datacenter",
                },
                {
                  id: "datacenter-tabs-summary",
                  isOnline: true,
                  label: "Summary", // TODO ? translation ?
                  icon: "fa fa-book",
                  type: "tabs",
                  link: "/datacenter/summary",
                },
                {
                  id: "datacenter-tabs-cluster",
                  isOnline: true,
                  label: "Cluster", // TODO ? translation ?
                  icon: "fa fa-server",
                  type: "tabs",
                  link: "/datacenter/cluster",
                },
                {
                  id: "datacenter-tabs-ceph",
                  isOnline: true,
                  label: "Ceph", // TODO ? translation ?
                  icon: "ceph.svg",
                  customIcon: true,
                  type: "tabs",
                  link: "/datacenter/ceph",
                },
                {
                  id: "datacenter-tabs-options",
                  isOnline: true,
                  label: "Options", // TODO ? translation ?
                  icon: "fa fa-cog",
                  type: "tabs",
                  link: "/datacenter/options",
                },
                {
                  id: "datacenter-tabs-storage",
                  isOnline: true,
                  label: "Storage", // TODO ? translation ?
                  icon: "fa fa-database",
                  type: "tabs",
                  link: "/datacenter/storage",
                },
                {
                  id: "datacenter-tabs-backup",
                  isOnline: true,
                  label: "Backup", // TODO ? translation ?
                  icon: "fa fa-save",
                  type: "tabs",
                  link: "/datacenter/backup",
                },
                {
                  id: "datacenter-tabs-replication",
                  isOnline: true,
                  label: "Replication", // TODO ? translation ?
                  icon: "fa fa-retweet",
                  type: "tabs",
                  link: "/datacenter/replication",
                },
                {
                  id: "datacenter-tabs-permissions",
                  isOnline: true,
                  label: "Permissions", // TODO ? translation ?
                  icon: "fas fa-unlock",
                  type: "tabs",
                  link: "/datacenter/permissions",
                  children: [
                    {
                      id: "datacenter-tabs-permissions-users",
                      isOnline: true,
                      label: "Users", // TODO ? translation ?
                      icon: "fa fa-user",
                      type: "tabs",
                      link: "/datacenter/permissions/users",
                    },
                    {
                      id: "datacenter-tabs-permissions-apiTokens",
                      isOnline: true,
                      label: "API tokens", // TODO ? translation ?
                      icon: "far fa-user",
                      type: "tabs",
                      link: "/datacenter/permissions/api-tokens",
                    },
                    {
                      id: "datacenter-tabs-permissions-groups",
                      isOnline: true,
                      label: "Groups", // TODO ? translation ?
                      icon: "fa fa-users",
                      type: "tabs",
                      link: "/datacenter/permissions/groups",
                    },
                    {
                      id: "datacenter-tabs-permissions-pools",
                      isOnline: true,
                      label: "Pools", // TODO ? translation ?
                      icon: "fa fa-tags",
                      type: "tabs",
                      link: "/datacenter/permissions/pools",
                    },
                    {
                      id: "datacenter-tabs-permissions-roles",
                      isOnline: true,
                      label: "Roles", // TODO ? translation ?
                      icon: "fas fa-male",
                      type: "tabs",
                      link: "/datacenter/permissions/roles",
                    },
                    {
                      id: "datacenter-tabs-permissions-authentification",
                      isOnline: true,
                      label: "Authentification", // TODO ? translation ?
                      icon: "fa fa-key",
                      type: "tabs",
                      link: "/datacenter/permissions/authentification",
                    },
                  ],
                },
                {
                  id: "datacenter-tabs-HA",
                  isOnline: true,
                  label: "HA", // TODO ? translation ?
                  icon: "fa fa-heartbeat",
                  type: "tabs",
                  link: "/datacenter/HA",
                  children: [
                    {
                      id: "datacenter-tabs-HA-groups",
                      isOnline: true,
                      label: "Groups", // TODO ? translation ?
                      icon: "fa fa-object-group",
                      type: "tabs",
                      link: "/datacenter/HA/groups",
                    },
                    {
                      id: "datacenter-tabs-HA-fencing",
                      isOnline: true,
                      label: "Fencing", // TODO ? translation ?
                      icon: "fa fa-bolt",
                      type: "tabs",
                      link: "/datacenter/HA/fencing",
                    },
                  ],
                },
                {
                  id: "datacenter-tabs-firewall",
                  isOnline: true,
                  label: "Firewall", // TODO ? translation ?
                  icon: "fas fa-shield-virus",
                  type: "tabs",
                  link: "/datacenter/firewall",
                  children: [
                    {
                      id: "datacenter-tabs-firewall-options",
                      isOnline: true,
                      label: "Options", // TODO ? translation ?
                      icon: "fa fa-cog",
                      type: "tabs",
                      link: "/datacenter/firewall/options",
                    },
                    {
                      id: "datacenter-tabs-firewall-securityGroup",
                      isOnline: true,
                      label: "Security group", // TODO ? translation ?
                      icon: "fa fa-users",
                      type: "tabs",
                      link: "/datacenter/firewall/security-group",
                    },
                    {
                      id: "datacenter-tabs-firewall-alias",
                      isOnline: true,
                      label: "Alias", // TODO ? translation ?
                      icon: "fas fa-external-link-alt",
                      type: "tabs",
                      link: "/datacenter/firewall/alias",
                    },
                    {
                      id: "datacenter-tabs-firewall-ipSet",
                      isOnline: true,
                      label: "IP set", // TODO ? translation ?
                      icon: "fas fa-list-ol",
                      type: "tabs",
                      link: "/datacenter/firewall/ip-set",
                    },
                  ],
                },
                {
                  id: "datacenter-tabs-metricServer",
                  isOnline: true,
                  label: "Metric server", // TODO ? translation ?
                  icon: "fas fa-chart-bar",
                  type: "tabs",
                  link: "/datacenter/metric-server",
                },
                {
                  id: "datacenter-tabs-support",
                  isOnline: true,
                  label: "Support", // TODO ? translation ?
                  icon: "far fa-comments",
                  type: "tabs",
                  link: "/datacenter/support",
                },
              ],
            },
          ].concat(
            nodes.map((node) => ({
              id: `node-${node.id}`,
              isOnline: node.status === "online",
              status: node.status,
              label: node.node,
              type: node.type, // should alway be node ?
              icon: "storage",
              link: `/datacenter/node/${node.node}`,
              children: [
                {
                  id: `node-${node.id}-tabs`,
                  isOnline: true,
                  label: "tabs", // TODO ? translation ?
                  type: "tabs",
                  link: `/datacenter/node/${node.node}`,
                  children: [
                    {
                      id: `node-${node.id}-tabs-search`,
                      isOnline: true,
                      label: "Search", // TODO ? translation ?
                      type: "tabs",
                      icon: "fa fa-search",
                      link: `/datacenter/node/${node.node}`,
                    },
                    {
                      id: `node-${node.id}-tabs-summary`,
                      isOnline: true,
                      label: "Summary", // TODO ? translation ?
                      type: "tabs",
                      icon: "fa fa-book",
                      link: `/datacenter/node/${node.node}/summary`,
                    },
                    {
                      id: `node-${node.id}-tabs-note`,
                      isOnline: true,
                      label: "Note", // TODO ? translation ?
                      type: "tabs",
                      icon: "far fa-sticky-note",
                      link: `/datacenter/node/${node.node}/note`,
                    },
                    {
                      id: `node-${node.id}-tabs-shell`,
                      isOnline: true,
                      label: "Shell", // TODO ? translation ?
                      type: "tabs",
                      icon: "fas fa-terminal",
                      link: `/datacenter/node/${node.node}/shell`,
                    },
                    {
                      id: `node-${node.id}-tabs-system`,
                      isOnline: true,
                      label: "System", // TODO ? translation ?
                      type: "tabs",
                      icon: "fa fa-cogs",
                      link: `/datacenter/node/${node.node}/system`,
                      children: [
                        {
                          id: `node-${node.id}-tabs-system-network`,
                          isOnline: true,
                          label: "Network", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-network-wired",
                          link: `/datacenter/node/${node.node}/system/network`,
                        },
                        {
                          id: `node-${node.id}-tabs-system-certificates`,
                          isOnline: true,
                          label: "Certificates", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-certificate",
                          link: `/datacenter/node/${node.node}/system/certificates`,
                        },
                        {
                          id: `node-${node.id}-tabs-system-dns`,
                          isOnline: true,
                          label: "DNS", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-globe",
                          link: `/datacenter/node/${node.node}/system/dns`,
                        },
                        {
                          id: `node-${node.id}-tabs-system-host`,
                          isOnline: true,
                          label: "Host", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-globe",
                          link: `/datacenter/node/${node.node}/system/host`,
                        },
                        {
                          id: `node-${node.id}-tabs-system-time`,
                          isOnline: true,
                          label: "Time", // TODO ? translation ?
                          type: "tabs",
                          icon: "far fa-clock",
                          link: `/datacenter/node/${node.node}/system/time`,
                        },
                        {
                          id: `node-${node.id}-tabs-system-syslog`,
                          isOnline: true,
                          label: "Syslog", // TODO ? translation ?
                          type: "tabs",
                          icon: "fa fa-list",
                          link: `/datacenter/node/${node.node}/system/syslog`,
                        },
                      ],
                    },
                    {
                      id: `node-${node.id}-tabs-update`,
                      isOnline: true,
                      label: "Update", // TODO ? translation ?
                      type: "tabs",
                      icon: "fas fa-sync",
                      link: `/datacenter/node/${node.node}/update`,
                    },
                    {
                      id: `node-${node.id}-tabs-firewall`,
                      isOnline: true,
                      label: "Firewall", // TODO ? translation ?
                      type: "tabs",
                      icon: "fas fa-shield-virus",
                      link: `/datacenter/node/${node.node}/firewall`,
                      children: [
                        {
                          id: `node-${node.id}-tabs-firewall-options`,
                          isOnline: true,
                          label: "Options", // TODO ? translation ?
                          type: "tabs",
                          icon: "fa fa-cog",
                          link: `/datacenter/node/${node.node}/firewall/options`,
                        },
                        {
                          id: `node-${node.id}-tabs-firewall-log`,
                          isOnline: true,
                          label: "Log", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-list",
                          link: `/datacenter/node/${node.node}/firewall/log`,
                        },
                      ],
                    },
                    {
                      id: `node-${node.id}-tabs-disks`,
                      isOnline: true,
                      label: "Disks", // TODO ? translation ?
                      type: "tabs",
                      icon: "far fa-hdd",
                      link: `/datacenter/node/${node.node}/disks`,
                      children: [
                        {
                          id: `node-${node.id}-tabs-disks-lvm`,
                          isOnline: true,
                          label: "LVM", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-square",
                          link: `/datacenter/node/${node.node}/disks/lvm`,
                        },
                        {
                          id: `node-${node.id}-tabs-disks-lvmThin`,
                          isOnline: true,
                          label: "LVM thin", // TODO ? translation ?
                          type: "tabs",
                          icon: "far fa-square",
                          link: `/datacenter/node/${node.node}/disks/lvm-thin`,
                        },
                        {
                          id: `node-${node.id}-tabs-disks-directory`,
                          isOnline: true,
                          label: "Directory", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-folder",
                          link: `/datacenter/node/${node.node}/disks/directory`,
                        },
                        {
                          id: `node-${node.id}-tabs-disks-zfs`,
                          isOnline: true,
                          label: "ZFS", // TODO ? translation ?
                          type: "tabs",
                          icon: "far fa-square",
                          link: `/datacenter/node/${node.node}/disks/zfs`,
                        },
                      ],
                    },
                    {
                      id: `node-${node.id}-tabs-ceph`,
                      isOnline: true,
                      label: "Ceph", // TODO ? translation ?
                      type: "tabs",
                      icon: "ceph.svg",
                      customIcon: true,
                      link: `/datacenter/node/${node.node}/ceph`,
                      children: [
                        {
                          id: `node-${node.id}-tabs-ceph-configuration`,
                          isOnline: true,
                          label: "Configuration", // TODO ? translation ?
                          type: "tabs",
                          icon: "fa fa-cog",
                          link: `/datacenter/node/${node.node}/ceph/configuration`,
                        },
                        {
                          id: `node-${node.id}-tabs-ceph-monitor`,
                          isOnline: true,
                          label: "Monitor", // TODO ? translation ?
                          type: "tabs",
                          icon: "fa fa-tv",
                          link: `/datacenter/node/${node.node}/ceph/monitor`,
                        },
                        {
                          id: `node-${node.id}-tabs-ceph-osd`,
                          isOnline: true,
                          label: "OSD", // TODO ? translation ?
                          type: "tabs",
                          icon: "far fa-hdd",
                          link: `/datacenter/node/${node.node}/ceph/osd`,
                        },
                        {
                          id: `node-${node.id}-tabs-ceph-cephfs`,
                          isOnline: true,
                          label: "CephFS", // TODO ? translation ?
                          type: "tabs",
                          icon: "far fa-hdd",
                          link: `/datacenter/node/${node.node}/ceph/cephfs`,
                        },
                        {
                          id: `node-${node.id}-tabs-ceph-pools`,
                          isOnline: true,
                          label: "Pools", // TODO ? translation ?
                          type: "tabs",
                          icon: "fas fa-network-wired",
                          link: `/datacenter/node/${node.node}/ceph/pools`,
                        },
                        {
                          id: `node-${node.id}-tabs-ceph-log`,
                          isOnline: true,
                          label: "Log", // TODO ? translation ?
                          type: "tabs",
                          icon: "fa fa-list",
                          link: `/datacenter/node/${node.node}/ceph/log`,
                        },
                      ],
                    },
                    {
                      id: `node-${node.id}-tabs-replication`,
                      isOnline: true,
                      label: "Replication", // TODO ? translation ?
                      type: "tabs",
                      icon: "fa fa-retweet",
                      link: `/datacenter/node/${node.node}/replication`,
                    },
                    {
                      id: `node-${node.id}-tabs-taskHistory`,
                      isOnline: true,
                      label: "Tasks history", // TODO ? translation ?
                      type: "tabs",
                      icon: "fa fa-list",
                      link: `/datacenter/node/${node.node}/task-history`,
                    },
                    {
                      id: `node-${node.id}-tabs-subscription`,
                      isOnline: true,
                      label: "Subscription", // TODO ? translation ?
                      type: "tabs",
                      icon: "far fa-question-circle",
                      link: `/datacenter/node/${node.node}/subscription`,
                    },
                  ],
                },
              ]
                .concat(
                  node.vms.map((vm) => ({
                    id: `vm-${vm.vmid}`,
                    vmid: vm.vmid,
                    nodeId: node.id.slice(5), // remove "node/"
                    isOnline: vm.status === "running",
                    isPaused: vm.qmpstatus === "paused",
                    isLocked: vm.lock === "suspended",
                    label: vm.name,
                    icon: vm.template ? "fa fa-file" : "fas fa-desktop",
                    type: vm.template ? "template" : "vm",
                    link: `/datacenter/node/${node.node}/vm/${vm.vmid}`,
                    children: vm.template
                      ? [
                          {
                            id: `template-${vm.vmid}-tabs-summary`,
                            isOnline: vm.status === "running",
                            label: "Summary", // TODO ? translation ?
                            icon: "fa fa-book",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}`,
                          },
                          {
                            id: `template-${vm.vmid}-tabs-hardware`,
                            isOnline: vm.status === "running",
                            label: "Hardware", // TODO ? translation ?
                            icon: "fa fa-tv",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/hardware`,
                          },
                          {
                            id: `template-${vm.vmid}-tabs-cloudInit`,
                            isOnline: vm.status === "running",
                            label: "Hardware", // TODO ? translation ?
                            icon: "fas fa-cloud",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/cloud-init`,
                          },
                          {
                            id: `template-${vm.vmid}-tabs-options`,
                            isOnline: vm.status === "running",
                            label: "Options", // TODO ? translation ?
                            icon: "fa fa-cog",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/options`,
                          },
                          {
                            id: `template-${vm.vmid}-tabs-taskHistory`,
                            isOnline: vm.status === "running",
                            label: "Task history", // TODO ? translation ?
                            icon: "fa fa-list",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/task-history`,
                          },
                          {
                            id: `template-${vm.vmid}-tabs-backup`,
                            isOnline: vm.status === "running",
                            label: "Backup", // TODO ? translation ?
                            icon: "fa fa-save",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/backup`,
                          },
                          {
                            id: `template-${vm.vmid}-tabs-replication`,
                            isOnline: vm.status === "running",
                            label: "Backup", // TODO ? translation ?
                            icon: "fa fa-retweet",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/replication`,
                          },
                          {
                            id: `template-${vm.vmid}-tabs-firewall`,
                            isOnline: vm.status === "running",
                            label: "Firewall", // TODO ? translation ?
                            icon: "fas fa-shield-virus",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/firewall`,
                            children: [
                              {
                                id: `template-${vm.vmid}-tabs-firewall-options`,
                                isOnline: vm.status === "running",
                                label: "Options", // TODO ? translation ?
                                icon: "fa fa-cog",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/template/${vm.vmid}/firewall/options`,
                              },
                              {
                                id: `template-${vm.vmid}-tabs-firewall-alias`,
                                isOnline: vm.status === "running",
                                label: "Alias", // TODO ? translation ?
                                icon: "fas fa-external-link-alt",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/template/${vm.vmid}/firewall/options`,
                              },
                              {
                                id: `template-${vm.vmid}-tabs-firewall-ipSet`,
                                isOnline: vm.status === "running",
                                label: "IP set", // TODO ? translation ?
                                icon: "fas list-ol",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/template/${vm.vmid}/firewall/ipSet`,
                              },
                              {
                                id: `template-${vm.vmid}-tabs-firewall-logs`,
                                isOnline: vm.status === "running",
                                label: "Log", // TODO ? translation ?
                                icon: "fa fa-list",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/template/${vm.vmid}/firewall/log`,
                              },
                            ],
                          },
                          {
                            id: `template-${vm.vmid}-tabs-permissions`,
                            isOnline: vm.status === "running",
                            label: "Permissions", // TODO ? translation ?
                            icon: "fa fa-unlock",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/template/${vm.vmid}/permissions`,
                          },
                        ]
                      : [
                          {
                            id: `vm-${vm.vmid}-tabs-summary`,
                            isOnline: vm.status === "running",
                            label: "Summary", // TODO ? translation ?
                            icon: "fa fa-book",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-console`,
                            isOnline: vm.status === "running",
                            label: "Console", // TODO ? translation ?
                            icon: "fa fa-terminal",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/console`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-hardware`,
                            isOnline: vm.status === "running",
                            label: "Hardware", // TODO ? translation ?
                            icon: "fa fa-desktop",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/hardware`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-cloudInit`,
                            isOnline: vm.status === "running",
                            label: "Cloud-init", // TODO ? translation ?
                            icon: "fas fa-cloud",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/cloud-init`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-options`,
                            isOnline: vm.status === "running",
                            label: "Options", // TODO ? translation ?
                            icon: "fa fa-cog",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/options`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-taskHistory`,
                            isOnline: vm.status === "running",
                            label: "Task history", // TODO ? translation ?
                            icon: "fa fa-list",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/options`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-monitor`,
                            isOnline: vm.status === "running",
                            label: "Monitor", // TODO ? translation ?
                            icon: "far fa-eye",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/monitor`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-backup`,
                            isOnline: vm.status === "running",
                            label: "Backup", // TODO ? translation ?
                            icon: "far fa-save",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/backup`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-replication`,
                            isOnline: vm.status === "running",
                            label: "Replication", // TODO ? translation ?
                            icon: "fa fa-retweet",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/replication`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-snapshot`,
                            isOnline: vm.status === "running",
                            label: "Snapshot", // TODO ? translation ?
                            icon: "fas fa-history",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/snapshot`,
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-firewall`,
                            isOnline: vm.status === "running",
                            label: "Firewall", // TODO ? translation ?
                            icon: "fas fa-shield-virus",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/firewall`,
                            children: [
                              {
                                id: `vm-${vm.vmid}-tabs-firewall-options`,
                                isOnline: vm.status === "running",
                                label: "Options", // TODO ? translation ?
                                icon: "fa fa-cog",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/vm/${vm.vmid}/firewall/options`,
                              },
                              {
                                id: `vm-${vm.vmid}-tabs-firewall-alias`,
                                isOnline: vm.status === "running",
                                label: "Alias", // TODO ? translation ?
                                icon: "fas fa-external-link-alt",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/vm/${vm.vmid}/firewall/options`,
                              },
                              {
                                id: `vm-${vm.vmid}-tabs-firewall-ipSet`,
                                isOnline: vm.status === "running",
                                label: "IP set", // TODO ? translation ?
                                icon: "fas list-ol",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/vm/${vm.vmid}/firewall/ipSet`,
                              },
                              {
                                id: `vm-${vm.vmid}-tabs-firewall-logs`,
                                isOnline: vm.status === "running",
                                label: "Log", // TODO ? translation ?
                                icon: "fa fa-list",
                                type: "tabs",
                                link: `/datacenter/node/${node.node}/vm/${vm.vmid}/firewall/log`,
                              },
                            ],
                          },
                          {
                            id: `vm-${vm.vmid}-tabs-firewall-permissions`,
                            isOnline: vm.status === "running",
                            label: "Permissions", // TODO ? translation ?
                            icon: "fas fa-unlock",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/vm/${vm.vmid}/permissions`,
                          },
                        ],
                  }))
                )
                .concat(
                  node.lxc.map((lxc) => ({
                    id: `lxc-${lxc.vmid}`,
                    vmid: lxc.vmid,
                    nodeId: node.id.slice(5), // remove "node/"
                    isOnline: lxc.status === "running",
                    status: lxc.status, // should be removed ?
                    label: lxc.name,
                    type: "lxc",
                    icon: "fas fa-cube",
                    link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}`,
                    children: [
                      {
                        id: `lxc-${lxc.vmid}-tabs-summary`,
                        isOnline: lxc.status === "running",
                        label: "Summary", // TODO ? translation ?
                        icon: "fa fa-book",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-console`,
                        isOnline: lxc.status === "running",
                        label: "Console", // TODO ? translation ?
                        icon: "fas fa-terminal",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/console`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-ressources`,
                        isOnline: lxc.status === "running",
                        label: "Ressources", // TODO ? translation ?
                        icon: "fas fa-cube",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/ressources`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-network`,
                        isOnline: lxc.status === "running",
                        label: "Network", // TODO ? translation ?
                        icon: "fas fa-network-wired",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/network`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-dns`,
                        isOnline: lxc.status === "running",
                        label: "DNS", // TODO ? translation ?
                        icon: "fa fa-globe",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/dns`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-options`,
                        isOnline: lxc.status === "running",
                        label: "Options", // TODO ? translation ?
                        icon: "fa fa-cog",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/options`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-taskHistory`,
                        isOnline: lxc.status === "running",
                        label: "Task history", // TODO ? translation ?
                        icon: "fa fa-list",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/task-history`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-backup`,
                        isOnline: lxc.status === "running",
                        label: "Backup", // TODO ? translation ?
                        icon: "fa fa-save",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/backup`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-replication`,
                        isOnline: lxc.status === "running",
                        label: "Replication", // TODO ? translation ?
                        icon: "fa fa-retweet",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/replication`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-snapshot`,
                        isOnline: lxc.status === "running",
                        label: "Snapshot", // TODO ? translation ?
                        icon: "fa fa-history",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/snapshot`,
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-firewall`,
                        isOnline: lxc.status === "running",
                        label: "Firewall", // TODO ? translation ?
                        icon: "fas fa-shield-virus",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/firewall`,
                        children: [
                          {
                            id: `lxc-${lxc.vmid}-tabs-firewall-options`,
                            isOnline: lxc.status === "running",
                            label: "Options", // TODO ? translation ?
                            icon: "fa fa-cog",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/firewall/options`,
                          },
                          {
                            id: `lxc-${lxc.vmid}-tabs-firewall-alias`,
                            isOnline: lxc.status === "running",
                            label: "Alias", // TODO ? translation ?
                            icon: "fas fa-external-link-alt",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/firewall/alias`,
                          },
                          {
                            id: `lxc-${lxc.vmid}-tabs-firewall-ipSet`,
                            isOnline: lxc.status === "running",
                            label: "IP set", // TODO ? translation ?
                            icon: "fas fa-list-ol",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/firewall/ipSet`,
                          },
                          {
                            id: `lxc-${lxc.vmid}-tabs-firewall-log`,
                            isOnline: lxc.status === "running",
                            label: "log", // TODO ? translation ?
                            icon: "fa fa-list",
                            type: "tabs",
                            link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/firewall/log`,
                          },
                        ],
                      },
                      {
                        id: `lxc-${lxc.vmid}-tabs-permissions`,
                        isOnline: lxc.status === "running",
                        label: "Permissions", // TODO ? translation ?
                        icon: "fa fa-unlock",
                        type: "tabs",
                        link: `/datacenter/node/${node.node}/lxc/${lxc.vmid}/firewall/permissions`,
                      },
                    ],
                  }))
                )
                .concat(
                  node.storage.map((storage) => ({
                    id: `storage-${storage.storage}`,
                    isOnline: storage.active === 1,
                    status: storage.active, // should be removed ?
                    label: storage.storage,
                    type: "storage",
                    icon: "fas fa-database",
                    link: `/datacenter/storage/${storage.storage}`,
                    children: [
                      {
                        id: `storage-${storage.storage}-tabs-summary`,
                        isOnline: storage.active === 1,
                        label: "Summary", // TODO ? translation ?
                        type: "tabs",
                        icon: "fa fa-book",
                        link: `/datacenter/storage/${storage.storage}`,
                      },
                      {
                        id: `storage-${storage.storage}-tabs-vmDisks`,
                        isOnline: storage.active === 1,
                        label: "VM disks", // TODO ? translation ?
                        type: "tabs",
                        icon: "far fa-hdd",
                        link: `/datacenter/storage/${storage.storage}/vm-disks`,
                      },
                      {
                        id: `storage-${storage.storage}-tabs-ctVolumes`,
                        isOnline: storage.active === 1,
                        label: "CT Volumes", // TODO ? translation ?
                        type: "tabs",
                        icon: "fa fa-hdd",
                        link: `/datacenter/storage/${storage.storage}/ct-volumes`,
                      },
                      {
                        id: `storage-${storage.storage}-tabs-permissions`,
                        isOnline: storage.active === 1,
                        label: "Permissions", // TODO ? translation ?
                        type: "tabs",
                        icon: "fa fa-unlock",
                        link: `/datacenter/storage/${storage.storage}/permissions`,
                      },
                    ],
                  }))
                ),
            }))
          ),
        },
      ];
      return tree;
    });
    const leftDrawerOpen = ref(false);

    onMounted(async () => {
      await $store.dispatch("nodes/fetchNodes");
      intervalID = setInterval(async () => {
        await $store.dispatch("nodes/fetchNodes");
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(intervalID);
    });

    return {
      username,
      title,
      leftDrawer,

      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

      openDialogLanguageSwitcher() {
        $q.dialog({ component: LanguageSwitcherDialog });
      },

      openDialogChangePassword() {
        $q.dialog({
          component: ChangePasswordDialog,
          componentProps: { userId: username.value },
        });
      },

      async logout() {
        $q.cookies.remove("PVEAuthCookie");
        await $router.push("/login");
        await Promise.all([
          $store.commit("credentials/updateTicket", null),
          $store.commit("credentials/updateCSRFPreventionToken", null),
          $store.commit("credentials/updateCap", null),
          $store.commit("credentials/updateUsername", null),
        ]);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.body--light {
  .online {
    color: black;
  }
  .offline {
    color: lightgray;
  }
}

.body--dark {
  .online {
    color: white;
  }
  .offline {
    color: gray;
  }
}

.inner-icon {
  font-size: 0.8rem;
  left: -15px;
  bottom: -5px;
}
</style>
