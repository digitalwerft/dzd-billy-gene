<template>
  <div>
    <VueMultiselect
      v-model="selected"
      :options="options"
      :multiple="true">
    </VueMultiselect>
  </div>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import meshterms from '../../meshterms';

export default {
  components: { VueMultiselect },
  data () {
    return {
      selected: [],
      options: meshterms
    }
  }
}
</script>

<style>
@import "vue-multiselect/dist/vue-multiselect.css";

.multiselect__tag {
  background: var(--accent6);
}

.multiselect__option--highlight,
.multiselect__option--highlight::after,
.multiselect__option--selected::after,
.multiselect__option--selected.multiselect__option--highlight::after,
.multiselect__option--group-selected.multiselect__option--highlight::after
 {
  background: var(--accent4);
  color: #fff;
}

</style>