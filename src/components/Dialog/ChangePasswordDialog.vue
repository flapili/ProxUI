<template>
  <q-dialog ref="dialogRef">
    <q-card :style="{ 'min-width': '200px' }">
      <q-card-section>
        <div class="row justify-center">
          {{ userId }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="changePassword" class="q-gutter-md">
          <q-input
            @change="confirmPasswordInput.focus()"
            autocomplete="new-password"
            filled
            v-model="password"
            :label="$t('form.changePassword.fields.password.label')"
            :hint="$t('form.changePassword.fields.password.hint')"
            :type="passwordHide ? 'password' : 'text'"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                $t('form.common.rules.thisFieldIsRequired'),
              (val) =>
                (val && val.length >= 5) ||
                $t('form.changePassword.rules.minimalLength'),
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="passwordHide ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="passwordHide = !passwordHide"
              />
            </template>
          </q-input>

          <q-input
            autocomplete="new-password"
            v-model="confirmPassword"
            type="password"
            filled
            :label="$t('form.changePassword.fields.passwordConfirm.label')"
            :hint="$t('form.changePassword.fields.passwordConfirm.hint')"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                $t('form.common.rules.thisFieldIsRequired'),
              (val) =>
                val === password ||
                $t('form.changePassword.rules.passwordDoesNotMatch'),
            ]"
          />

          <div class="row justify-center">
            <q-btn
              :label="$t('form.changePassword.buttons.changePassword.label')"
              :loading="buttonLoading"
              :disable="buttonLoading || buttonDisabled"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import qs from "querystring";

import { defineComponent, ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import { useQuasar, useDialogPluginComponent } from "quasar";

import { pve } from "boot/axios";

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],
  props: {
    userId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { t } = useI18n({ useScope: "global" });
    const $q = useQuasar();

    const { dialogRef } = useDialogPluginComponent();
    const password = ref("");
    const passwordHide = ref(true);
    const confirmPassword = ref("");

    const buttonLoading = ref(false);
    const buttonDisabled = computed(
      () => password.value.length < 5 || password.value != confirmPassword.value
    );

    return {
      dialogRef,
      password,
      passwordHide,
      confirmPassword,
      buttonLoading,
      buttonDisabled,


      async changePassword() {
        buttonLoading.value = true;
        try {
          await pve.put(
            "access/password",
            qs.stringify({ password: password.value, userid: props.userId })
          );
          $q.notify({
            message: t("notify.passwordChanged"),
            position: "top",
            type: "positive",
          });
          dialogRef.value.hide();
        } catch (error) {
          $q.notify({
            message: error.message,
            position: "top",
            type: "negative",
          });
        }

        buttonLoading.value = false;
      },
    };
  },
});
</script>
