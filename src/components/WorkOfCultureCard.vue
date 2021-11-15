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
        <b-button-group vertical v-if="isLogged">
          <b-button
            class="btn"
            v-b-tooltip.hover
            title="Open works details"
            variant="primary"
            >Details</b-button
          >

          <b-button
            v-b-tooltip.hover
            title="Open works discussions"
            variant="primary"
            >Discussions</b-button
          >

          <b-button
            v-b-tooltip.hover
            title="Open works reviews"
            variant="primary"
            >Reviews</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="Add to your watch list"
            variant="primary"
            @click="addToWatchList"
            >Add to watch list</b-button
          >
          <b-button
            v-b-tooltip.hover
            title="Add to your seen list"
            variant="primary"
            @click="addToSeenList"
            >Add to seen list</b-button
          >

          <b-button v-b-tooltip.hover title="Add review" variant="primary"
            >Add review</b-button
          >
        </b-button-group>
      </b-card>
    </b-col>
  </div>
</template>

<script>
export default {
  props: ["name", "id", "image", "type", "alertWatch", "alertSeen"],
  computed: {
    isLogged() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user != null) return true;
      else return false;
    },
  },
  methods: {
    async addToWatchList() {
      let url =
        "http://localhost:8080/api/watch-lists/" + this.type + "/" + this.id;

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "POST",
      });
      const data = await response.json();

      if (data == this.id) {
        this.alertWatch("s");
      } else this.alertWatch("f");
    },
    async addToSeenList() {
      let url =
        "http://localhost:8080/api/seen-lists/" + this.type + "/" + this.id;

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "POST",
      });
      const data = await response.json();

      if (data == this.id) {
        this.alertSeen("s");
      } else this.alertSeen("f");
    },
  },
};
</script>

<style scoped>
.btn {
  margin: 10px;
}
</style>
