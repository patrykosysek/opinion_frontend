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
            class="btn"
            v-b-tooltip.hover
            title="Open works details"
            variant="primary"
            @click="getDetails"
            >Details</b-button
          >

          <b-button
            v-b-tooltip.hover
            title="Open works discussions"
            variant="primary"
            @click="goToDiscussions"
            >Discussions
          </b-button>

          <b-button
            v-b-tooltip.hover
            title="Open works reviews"
            variant="primary"
            @click="goToReviews"
            >Reviews</b-button
          >
          <b-button
            v-if="isLogged"
            v-b-tooltip.hover
            title="Add to your watch list"
            variant="primary"
            @click="addToWatchList"
            >Add to watch list</b-button
          >
          <b-button
            v-if="isLogged"
            v-b-tooltip.hover
            title="Add to your seen list"
            variant="primary"
            @click="addToSeenList"
            >Add to seen list</b-button
          >

          <b-button
            v-if="isLogged"
            v-b-tooltip.hover
            title="Add review"
            variant="primary"
            @click="addReview"
            >Add review</b-button
          >

          <b-button
            v-if="isLogged"
            v-b-tooltip.hover
            title="Add review"
            variant="primary"
            @click="addDiscussion"
            >Add discussion</b-button
          >
          <b-button
            v-if="isAdmin"
            v-b-tooltip.hover
            title="Show statistics"
            variant="primary"
            @click="getStatistics(id, type)"
            >Statistics</b-button
          >
        </b-button-group>
      </b-card>
    </b-col>
  </div>
</template>

<script>
export default {
  props: [
    "name",
    "id",
    "image",
    "type",
    "alertWatch",
    "alertSeen",
    "alertReview",
    "getStatistics",
  ],
  computed: {
    isLogged() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user != null) return true;
      else return false;
    },
    isAdmin() {
      const user = JSON.parse(localStorage.getItem("user"));
      return this.isLogged && user.role == "ADMIN";
    },
    reviewCount() {
      return this.statistics.reviewCount == null
        ? 0
        : this.statistics.reviewCount;
    },
  },
  methods: {
    getDetails() {
      window.open("http://localhost:3000/details/" + this.type + "/" + this.id);
    },

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
    async addReview() {
      let url =
        "http://localhost:8080/api/review/" +
        this.type +
        "/" +
        this.id +
        "/reviewed";

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "GET",
      });
      const data = await response.json();
      console.log(data);

      if (data == false) {
        window.open(
          "http://localhost:3000/review" + "/" + this.type + "/" + this.id
        );
      } else this.alertReview();
    },
    async addDiscussion() {
      window.open(
        "http://localhost:3000/discussion" + "/" + this.type + "/" + this.id
      );
    },
    async goToReviews() {
      window.open(
        "http://localhost:3000/reviews-work" + "/" + this.type + "/" + this.id
      );
    },
    async goToDiscussions() {
      window.open(
        "http://localhost:3000/discussions-work" +
          "/" +
          this.type +
          "/" +
          this.id
      );
    },
  },
};
</script>

<style scoped>
.btn {
  margin: 10px;
}
</style>
