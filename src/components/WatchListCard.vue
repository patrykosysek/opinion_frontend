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
        <b-button-group vertical>
          <b-button
            @click="this.getDetails"
            v-b-tooltip.hover
            title="Open works details"
            variant="primary"
            >Details</b-button
          >
          <b-button
            @click="this.deleteFromWatchList"
            v-b-tooltip.hover
            title="Remove work from watch list"
            variant="primary"
            >Remove</b-button
          >
        </b-button-group>
      </b-card>
    </b-col>
  </div>
</template>

<script>
export default {
  props: ["name", "id", "image", "type", "removeWork", "watchListAlert"],
  methods: {
    async deleteFromWatchList() {
      let url =
        "http://localhost:8080/api/watch-lists/" + this.type + "/" + this.id;

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "DELETE",
      });
      const data = await response.json();

      if (data == this.id) this.removeWork(this.id);
      else this.watchListAlert();
    },
    getDetails() {
      window.open("http://localhost:3000/details/" + this.type + "/" + this.id);
    },
  },
};
</script>

<style scoped>
.btn {
  margin: 10px;
}
</style>
