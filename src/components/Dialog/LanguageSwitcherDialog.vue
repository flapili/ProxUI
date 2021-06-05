<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef">
    <q-card :style="{'min-width': '200px'}">
      <q-card-section>
        {{ $t('common.language') }}
        <language-switcher />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { useDialogPluginComponent } from "quasar";

import LanguageSwitcher from "components/LanguageSwitcher.vue";

export default defineComponent({
  components: {
    LanguageSwitcher,
  },
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef } = useDialogPluginComponent();

    return { dialogRef };
  },
});
</script>
