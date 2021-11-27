<template>
  <div class="recommendation">
    <h1>{{ this.title }}</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alertText
    }}</b-alert>

    <b-container>
      <b-row align-v="center">
        <b-col>
          <p class="text">Sort by</p>
          <b-form-select
            class="select"
            v-model="selectedType"
            :options="this.types"
            v-on:change="changeSort"
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
            :type="type"
            :createDate="rec.createDate"
            :title="rec.title"
            :topic="rec.topic"
            :text="rec.text"
            :sAlert="answerAdded"
            :fAlert="answerNotAdded"
          ></discussion-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import DiscussionWorkCardVue from "../components/DiscussionWorkCard.vue";

export default {
  components: { "discussion-card": DiscussionWorkCardVue },
  computed: {
    show() {
      return this.rows > 0;
    },
  },
  mounted() {
    this.getDiscussions();
    this.getTitle();
  },
  data() {
    return {
      types: ["DATE ↓", "DATE ↑"],
      id: this.$route.params.id,
      type: this.$route.params.type,
      alertShow: false,
      alertVariant: "",
      alertText: "",
      currentPage: 1,
      perPage: 1,
      rows: 0,
      search: "",
      displayDiscussions: [],
      loading: false,
      selectedType: "DATE ↓",
      url: "",
      topic: false,
      saveTopic: "",
      title: "",
    };
  },

  methods: {
    async paginate(currentPage) {
      this.alertShow = false;
      const start = (currentPage - 1) * this.perPage;
      let url = "";

      if (this.topic == true) {
        if (this.selectedType == "DATE ↓") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/topic-desc?topic=" +
            this.saveTopic +
            "&page=" +
            start +
            "&size=" +
            this.perPage;
        } else if (this.selectedType == "DATE ↑") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/topic-asc?topic=" +
            this.saveTopic +
            "&page=" +
            start +
            "&size=" +
            this.perPage;
        }
      } else {
        if (this.selectedType == "DATE ↓") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/desc?page=" +
            start +
            "&size=" +
            this.perPage;
        } else if (this.selectedType == "DATE ↑") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/asc?page=" +
            start +
            "&size=" +
            this.perPage;
        }
      }

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
      this.displayDiscussions = data.content;
    },
    async changeSort() {
      this.currentPage = 1;
      this.perPage = 1;
      this.rows = 0;
      this.alertShow = false;
      let url = "";
      if (this.topic == true) {
        if (this.selectedType == "DATE ↓") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/topic-desc?topic=" +
            this.saveTopic;
        } else if (this.selectedType == "DATE ↑") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/topic-asc?topic=" +
            this.saveTopic;
        }
      } else {
        if (this.selectedType == "DATE ↓") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/desc";
        } else if (this.selectedType == "DATE ↑") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/asc";
        }
      }

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

      this.loading = false;
      this.discussions = data.content;
      this.rows = data.totalElements;

      if (this.rows != 0) {
        this.displayDiscussions = this.discussions.slice(0, 1);
      } else {
        this.alertVariant = "warning";
        this.alertText = "No discussions were found";
        this.alertShow = true;
      }
    },
    async submitSearch() {
      this.currentPage = 1;
      this.perPage = 1;
      this.rows = 0;
      this.alertShow = false;
      this.displayDiscussions = [];

      const user = JSON.parse(localStorage.getItem("user"));

      if (this.search.length > 0) {
        let url = "";
        if (this.selectedType == "DATE ↓") {
          this.saveTopic = this.search;
          this.topic = true;
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/topic-desc?topic=" +
            this.search;
        } else if (this.selectedType == "DATE ↑") {
          this.saveTopic = this.search;
          this.topic = true;
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/topic-asc?topic=" +
            this.search;
        }

        const response = await fetch(url, {
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
          this.displayDiscussions = this.discussions.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alertText = "No discussions were found";
          this.alertShow = true;
        }
      } else {
        let url = "";
        if (this.selectedType == "DATE ↓") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/desc";
        } else if (this.selectedType == "DATE ↑") {
          url =
            "http://localhost:8080/api/discussion/" +
            this.type +
            "/" +
            this.id +
            "/asc";
        }
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
          method: "GET",
        });

        this.topic = false;
        const data = await response.json();

        this.loading = false;
        this.discussions = data.content;
        this.rows = data.totalElements;
        if (this.rows != 0) {
          this.displayDiscussions = this.discussions.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alertText = "No discussions were found";
          this.alertShow = true;
        }
      }
    },
    async getDiscussions() {
      let url =
        "http://localhost:8080/api/discussion/" +
        this.type +
        "/" +
        this.id +
        "/desc?page=0&size=1";

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

      this.loading = false;
      this.displayDiscussions = data.content;
      this.rows = data.totalElements;
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
    answerAdded() {
      this.alertVariant = "success";
      this.alertText = "Answer successfully added";
      this.alertShow = true;
    },
    answerNotAdded() {
      this.alertVariant = "warning";
      this.alertText = "Cannot add answer";
      this.alertShow = true;
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
