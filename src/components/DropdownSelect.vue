<template>
  <b-field :label="label" label-position="inside">
    <b-select
      :model-value="modelValue"
      expanded
      :disabled="disabled"
      @update:model-value="onUpdate"
    >
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </b-select>
  </b-field>
</template>

<script>
export default {
  name: "DropdownSelect",
  props: {
    modelValue: {
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    parser: {
      type: Function,
      default: (v) => v,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    onUpdate(value) {
      this.$emit("update:modelValue", this.parser(value));
    },
  },
};
</script>
