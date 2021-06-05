<template>
  <q-select
    v-model="locale"
    :options="localeOptions"
    :label="$t('common.language')"
    filled
    emit-value
    map-options
  />
</template>

<script>
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  setup() {
    const { locale } = useI18n({ useScope: "global" });

    return {
      locale,
      localeOptions: [
        { value: "en-US", label: "English" },
        { value: "fr-FR", label: "Français" },
      ],
    };
  },
});
</script>
