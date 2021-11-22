<template>
  <div class="recommendation">
    <h1>{{ this.title }}</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>

    <b-container>
      <b-row align-v="center">
        <b-col >
          <p class="text">Sort by</p>
          <b-form-select
            class="select"
            v-model="selectedType"
            :options="this.types"
            v-on:change="changeSort"
          ></b-form-select>
        </b-col>
      </b-row>
    </b-container>

    <hr />

    <b-container align="center">
      <b-row>
        <b-col >
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
        <b-col >
          <review-card
            v-for="rec in displayReviews"
            :author="rec.author"
            :id="rec.id"
            :comment="rec.comment"
            :key="rec.id"
            :type="type"
            :createDate="rec.createDate"
            :userLike="rec.userLike"
            :likes="rec.likes"
          ></review-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ReviewCard from "../components/ReviewCard.vue";

export default {
  components: { "review-card": ReviewCard },
  computed: {
    show() {
      return this.rows > 0;
    },
  },
  mounted() {
    this.getTitle();
    this.getByDate();
  },
  data() {
    return {
      types: ["DATE ↓", "DATE ↑", "LIKES ↓", "LIKES ↑"],
      alertShow: false,
      alertVariant: "",
      alerText: "",
      currentPage: 1,
      perPage: 1,
      rows: 0,
      id: this.$route.params.id,
      type: this.$route.params.type,
      title: "",
      reviews: [],
      displayReviews: [],
      loading: false,
      selectedType: "DATE ↓",
      url: "",
    };
  },

  methods: {
    async paginate(currentPage) {
      this.alertShow = false;
      const start = (currentPage - 1) * this.perPage;
      this.displayReviews = this.reviews.slice(start, start + 1);
    },

    async changeSort() {
      this.currentPage = 1;
      this.perPage = 1;
      this.rows = 0;
      this.alertShow =false;

      if (this.selectedType == "DATE ↓") {
        this.url =
          "http://localhost:8080/api/review/" +
          this.type +
          "/" +
          this.id +
          "/date?oldest=true";
      } else if (this.selectedType == "DATE ↑") {
        this.url =
          "http://localhost:8080/api/review/" +
          this.type +
          "/" +
          this.id +
          "/date?oldest=false";
      } else if (this.selectedType == "LIKES ↑") {
        this.url =
          "http://localhost:8080/api/review/" +
          this.type +
          "/" +
          this.id +
          "/likes?favourite=false";
      } else if (this.selectedType == "LIKES ↓") {
        this.url =
          "http://localhost:8080/api/review/" +
          this.type +
          "/" +
          this.id +
          "/likes?favourite=true";
      }

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
        this.alerText = "No reviews were found";
        this.alertShow = true;
      }

    },
    async getByDate() {
      this.url =
        "http://localhost:8080/api/review/" +
        this.type +
        "/" +
        this.id +
        "/date?oldest=false";

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
      this.rows = data.totalElements;
      this.reviews = data.content;
      this.rows = data.totalElements;

      if (this.rows != 0) {
        this.displayReviews = data.content.slice(0, 1);
      } else {
        this.alertVariant = "warning";
        this.alerText = "No reviews were found";
        this.alertShow = true;
      }

      console.log(data);
    },

    async getTitle() {
      let url =
        "http://localhost:8080/api/work-of-culture/" +
        this.type +
        "/" +
        this.id +
        "/information";

      const response = await fetch(url);
      const data = await response.json();

      this.title = data.title;
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
