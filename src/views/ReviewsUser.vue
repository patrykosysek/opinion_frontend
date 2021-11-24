<template>
  <div class="recommendation">
    <h1>Reviews</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alertText
    }}</b-alert>

    <b-container>
      <b-row align-v="center">
        <b-col>
          <p class="text">Work of culture type</p>
          <b-form-select
            class="select"
            v-model="selectedType"
            :options="this.types"
            v-on:change="changeType"
          ></b-form-select>
        </b-col>
      </b-row>
    </b-container>

    <hr />

    <b-container align="center">
      <b-row>
        <b-col>
          <b-pagination
            v-if="show"
            align="center"
            v-model="currentPage"
            :per-page="perPage"
            :total-rows="rows"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
            @input="paginate(currentPage)"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>

    <div v-if="loading">
      <b-spinner label="Loading..." class="m-5"></b-spinner>
    </div>

    <b-container>
      <b-row>
        <b-col>
          <review-card
            v-for="rec in displayReviews"
            :author="rec.author"
            :id="rec.id"
            :comment="rec.comment"
            :key="rec.id"
            :type="selectedType"
            :createDate="rec.createDate"
            :title="rec.title"
            :likes="rec.likes"
          ></review-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ReviewUserCard from "../components/ReviewUserCard.vue";

export default {
  components: { "review-card": ReviewUserCard },
  computed: {
    show() {
      return this.rows > 0;
    },
  },
  mounted() {
    //this.getByAnime();
  },
  data() {
    return {
      types: ["ANIME", "MANGA", "TVSERIES", "MOVIE", "GAME"],
      alertShow: false,
      alertVariant: "",
      alertText: "",
      currentPage: 1,
      perPage: 1,
      rows: 0,
      title: "",
      reviews: [],
      displayReviews: [],
      loading: false,
      selectedType: null,
      url: "",
    };
  },

  methods: {
    async paginate(currentPage) {
      this.alertShow = false;
      const start = (currentPage - 1) * this.perPage;
      this.displayReviews = this.reviews.slice(start, start + 1);

      let url =
        "http://localhost:8080/api/review/" +
        this.selectedType +
        "?page=" +
        start +
        "&size=" +
        this.perPage;

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
      this.displayReviews = data.content;
    },

    async changeType() {
      this.currentPage = 1;
      this.perPage = 1;
      this.rows = 0;
      this.alertShow = false;
      this.displayReviews = [];

      this.url = "http://localhost:8080/api/review/" + this.selectedType;

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(this.url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "GET",
      });
      const data = await response.json();

      this.loading = false;
      this.reviews = data.content;
      this.rows = data.totalElements;

      if (this.rows != 0) {
        this.displayReviews = data.content.slice(0, 1);
      } else {
        this.alertVariant = "warning";
        this.alertText = "No reviews were found";
        this.alertShow = true;
      }
    },
  },
};
</script>

<style scoped>
.recommendation {
  padding: 30px;
}

.check {
  padding: 10px;
}

.select {
  margin: 10px;
  width: 20vh;
}

.text {
  font-weight: 700;
}
</style>
