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
          <discussion-card
            v-for="rec in displayDiscussions"
            :id="rec.id"
            :key="rec.id"
            :type="selectedType"
            :createDate="rec.createDate"
            :title="rec.title"
            :topic="rec.topic"
            :text="rec.text"
          ></discussion-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import DiscussionUserCard from "../components/DiscussionUserCard.vue";

export default {
  components: { "discussion-card": DiscussionUserCard },
  computed: {
    show() {
      return this.rows > 0;
    },
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
      search: "",
      discussions: [],
      displayDiscussions: [],
      loading: false,
      selectedType: "ANIME",
      url: "",
      topic: false,
      saveTopic: "",
    };
  },

  methods: {
    async paginate(currentPage) {
      this.alertShow = false;
      const start = (currentPage - 1) * this.perPage;
      this.displayDiscussions = this.discussions.slice(start, start + 1);

      if (this.topic == true) {
        this.url =
          "http://localhost:8080/api/discussion/" +
          this.selectedType +
          "/topic-desc?topic=" +
          this.saveTopic +
          "&page=" +
          start +
          "&size=" +
          this.perPage;
      } else {
        this.url =
          "http://localhost:8080/api/discussion/" +
          this.selectedType +
          "/desc?page=" +
          start +
          "&size=" +
          this.perPage;
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
        this.saveTopic = this.search;
        this.topic = true;
        this.url = this.url + "/topic-desc?topic=" + this.search;

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

        if (this.rows != 0) {
          this.displayDiscussions = data.content.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alertText = "No discussions were found";
          this.alertShow = true;
        }
      } else {
        this.url = this.url + "/desc";
        this.topic = false;

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

        if (this.rows != 0) {
          this.displayDiscussions = data.content.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alertText = "No discussions were found";
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
