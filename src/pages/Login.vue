<template>
  <q-page class="flex flex-center bg-blue">
    <q-card>
      <q-card-section>
        <q-form @submit="login" class="q-gutter-md">
          <q-input
            filled
            v-model="baseUrl"
            :label="$t('form.login.fields.baseUrl.label')"
            :hint="$t('form.login.fields.baseUrl.hint')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                $t('form.common.rules.thisFieldIsRequired'),
            ]"
          />
          <q-input
            autocomplete="username"
            filled
            v-model="username"
            :label="$t('form.login.fields.username.label')"
            :hint="$t('form.login.fields.username.hint')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                $t('form.common.rules.thisFieldIsRequired'),
            ]"
          />

          <q-input
            autocomplete="current-password"
            v-model="password"
            filled
            :label="$t('form.login.fields.password.label')"
            :hint="$t('form.login.fields.password.hint')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                $t('form.common.rules.thisFieldIsRequired'),
            ]"
            :type="hidePassword ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="hidePassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="hidePassword = !hidePassword"
              />
            </template>
          </q-input>

          <q-select
            filled
            v-model="realm"
            :options="realsOptions"
            label="realm"
          />
          <language-switcher />
          <div class="row justify-center">
            <q-btn
              :label="$t('form.login.buttons.login.label')"
              :loading="loginButtonLoading"
              :disable="loginButtonLoading"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import qs from "querystring";

import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

import { useQuasar } from "quasar";

import { pve } from "boot/axios";

import LanguageSwitcher from "components/LanguageSwitcher.vue";

export default defineComponent({
  components: {
    LanguageSwitcher,
  },

  setup() {
    const $store = useStore();
    const $router = useRouter();
    const { t } = useI18n({ useScope: "global" });
    const $q = useQuasar();

    const baseUrl = ref(null);
    if (
      !$q.platform.is.electron &&
      !$q.platform.is.capacitor &&
      !$q.platform.is.cordova
    ) {
      baseUrl.value = window.location.origin;
    }
    const username = ref(null);
    const password = ref(null);
    const hidePassword = ref(true);
    const realm = ref({
      label: "Proxmox VE authentication server",
      value: "pve",
    });
    const realsOptions = ref([
      { label: "Proxmox VE authentication server", value: "pve" },
      { label: "Linux PAM standard authentication", value: "pam" },
    ]);
    const loginButtonLoading = ref(false);

    return {
      baseUrl,
      username,
      password,
      hidePassword,
      realm,
      realsOptions,
      loginButtonLoading,

      async login() {
        loginButtonLoading.value = true;
        try {
          const {
            data: { data },
          } = await pve.post(
            `${baseUrl.value}/api2/json/access/ticket`,
            qs.stringify({
              username: `${username.value}@${realm.value.value}`,
              password: password.value,
            })
          );

          // update store
          await Promise.all([
            $store.commit("credentials/updateTicket", data.ticket),
            $store.commit(
              "credentials/updateCSRFPreventionToken",
              data.CSRFPreventionToken
            ),
            $store.commit("credentials/updateCap", data.cap),
            $store.commit("credentials/updateUsername", data.username),
          ]);

          // remove possible cookie
          $q.cookies.remove("PVEAuthCookie");

          // set cookie
          $q.cookies.set("PVEAuthCookie", data.ticket, {
            path: "/",
            secure: true,
            maxAge: 60 * 60 * 2,
          });

          pve.defaults.baseURL = `${baseUrl.value}/api2/json/`;
          ["post", "put", "delete"].forEach(
            (method) =>
              (pve.defaults.headers[method].CSRFPreventionToken =
                data.CSRFPreventionToken)
          );

          await $router.push("/");
        } catch (error) {
          if (error.response && error.response.status === 401) {
            $q.notify({
              type: "negative",
              position: "top",
              message: t("notify.badCredentials"),
            });
          } else {
            $q.notify({
              type: "negative",
              position: "top",
              message: error.message,
            });
          }
        }
        loginButtonLoading.value = false;
      },
    };
  },
});
</script>
