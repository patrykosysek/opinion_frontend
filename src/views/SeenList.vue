<template>
  <div class="recommendation">
    <h1>Seen List</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>

    <b-container>
      <b-row align-v="center">
        <b-col>
          <p class="text">Work of culture type</p>
          <b-form-select
            class="select"
            v-model="selectedType"
            :options="this.types"
            v-on:change="changeWorks"
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
    <b-container align="center">
      <b-row>
        <b-col align-v="center">
          <seen-list
            v-for="rec in seenList"
            :name="rec.title"
            :id="rec.id"
            :image="rec.imageUrl"
            :key="rec.id"
            :type="rec.workOfCultureType"
            :removeWork="removeWorkFromWatchList"
            :watchListAlert="watchListAlert"
          ></seen-list>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SeenListCard from "@/components/SeenListCard.vue";

export default {
  components: { "seen-list": SeenListCard },
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
      alerText: "",
      currentPage: 1,
      perPage: 1,
      rows: 0,
      seenList: [],
      loading: false,
      selectedType: null,
    };
  },
  methods: {
    async paginate(currentPage) {
      this.alertShow = false;
      const start = (currentPage - 1) * this.perPage;

      let url =
        "http://localhost:8080/api/seen-lists/" +
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

      this.seenList = data.content;
    },

    async changeWorks() {
      this.watchList = [];
      this.alertShow = false;

      let page = this.currentPage - 1;

      let url =
        "http://localhost:8080/api/seen-lists/" +
        this.selectedType +
        "?page=" +
        page +
        "&size=" +
        this.perPage;
      try {
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

        this.seenList = data.content;
        this.loading = false;
        this.rows = data.totalElements;

        if (this.rows == 0) {
          this.alertVariant = "warning";
          this.alerText = "No work of culture was found";
          this.alertShow = true;
        }
      } catch (error) {
        console.log(error.message);
        this.loading = false;

        this.alertVariant = "danger";
        this.alerText = "Cannot connect to the server";
        this.alertShow = true;
      }
    },
    removeWorkFromWatchList(id) {
      this.watchList = this.watchList.filter((item) => item.id !== id);
      this.paginate(this.currentPage);
      this.rows = this.rows - 1;
    },
    watchListAlert() {
      this.alertShow = true;
      this.alertVariant = "danger";
      this.alerText = "Cannot connect to the server";
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
