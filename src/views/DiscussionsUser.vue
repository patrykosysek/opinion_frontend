<template>
  <div class="recommendation">
    <h1>Discussions</h1>
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
          ></b-form-select>
        </b-col>
        <b-col>
          <p class="text">Discussion topic</p>
          <b-form-input
            size="sm"
            class="mr-sm-2"
            placeholder="Search"
            v-model="search"
          ></b-form-input>
        </b-col>
        <b-col>
          <p class="text">Sort by</p>
          <b-form-select
            class="select"
            v-model="selectedSort"
            :options="this.sortTypes"
          ></b-form-select>
        </b-col>
        <b-col>
          <b-button
            @click="submitSearch"
            style="width: 10vh"
            type="submit"
            variant="primary"
            >Search</b-button
          >
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
            v-for="rec in displayDiscussions"
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

  data() {
    return {
      types: ["ANIME", "MANGA", "TVSERIES", "MOVIE", "GAME"],
      sortTypes: ["DATE ↓", "DATE ↑", "TOPIC ↓", "TOPIC ↑"],
      alertShow: false,
      alertVariant: "",
      alertText: "",
      currentPage: 1,
      perPage: 1,
      rows: 0,
      search: "",
      discussions: [],
      displayDiscussions: [],
      loading: false,
      selectedType: "ANIME",
      selectedSort: "DATE ↓",
      url: "",
    };
  },

  methods: {
    async paginate(currentPage) {
      this.alertShow = false;
      const start = (currentPage - 1) * this.perPage;
      this.displayDiscussions = this.discussions.slice(start, start + 1);

      if (this.search.length > 0) {
        this.url = this.url + "&page=" + start + "&size=" + this.perPage;
      } else {
        this.url = this.url + "?page=" + start + "&size=" + this.perPage;
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
      this.displayDiscussions = data.content;
    },

    async submitSearch() {
      this.currentPage = 1;
      this.perPage = 1;
      this.rows = 0;
      this.alertShow = false;
      this.displayDiscussions = [];

      this.url = "http://localhost:8080/api/discussion/" + this.selectedType;
      const user = JSON.parse(localStorage.getItem("user"));
      if (this.search.length > 0) {
        let params = {
          topic: this.search,
        };

        let query = Object.keys(params)
          .map(
            (k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
          )
          .join("&");

        this.url + "?" + query;
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
        this.discussions = data.content;
        this.rows = data.totalElements;
        console.log("1", data);

        if (this.rows != 0) {
          this.displayDiscussions = data.content.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alertText = "No reviews were found";
          this.alertShow = true;
        }
      } else {
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
        this.discussions = data.content;
        this.rows = data.totalElements;
        console.log("2", data);
        if (this.rows != 0) {
          this.displayDiscussions = data.content.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alertText = "No reviews were found";
          this.alertShow = true;
        }
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
