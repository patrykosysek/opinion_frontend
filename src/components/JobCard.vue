<template>
  <div>
    <b-col>
      <b-card
        :title="name"
        :img-src="image"
        img-alt="Image"
        img-top
        img-width="20px"
        img-height="200"
        style="max-width: 20rem;"
        tag="article"
        class="mb-2"
        :footer="type"
      >
        <b-button
          @click="this.getDetails"
          v-b-tooltip.hover
          title="Open works details"
          variant="primary"
          >Details</b-button
        >
        <b-modal title="BootstrapVue">
          <p class="my-4">Hello from modal!</p>
        </b-modal>
      </b-card>
    </b-col>
  </div>
</template>

<script>
export default {
  props: ["name", "id", "image", "type"],
  methods: {
    getDetails() {
      window.open("http://localhost:3000/details/" + this.type + "/" + this.id);
    },
  },
};
</script>

<style scoped></style>
