<template>
  <div>
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>
    <hr />
    <b-container>
      <p>Work of culture type</p>
      <b-form-select
        v-model="selectedType"
        :options="this.types"
        v-on:change="setGernes"
      ></b-form-select>
    </b-container>
    <hr />
    <b-container>
      <p>Work of culture genre</p>
      <b-form-select
        v-model="selectedGenre"
        :options="genresTypes"
        :disabled="getStatus"
      ></b-form-select>
    </b-container>
    <hr />
    <b-container>
      <p>Work of culture title</p>
      <b-form-input
        size="sm"
        class="mr-sm-2"
        placeholder="Search"
        v-model="search"
      ></b-form-input>
      <hr />
      <b-form @submit="getRecommendation">
        <b-button type="submit" variant="primary">Search</b-button>
        <hr />
        <b-form-checkbox
          id="checkbox-1"
          v-model="status"
          name="checkbox-1"
          value="true"
          unchecked-value="false"
        >
          Search by preference
        </b-form-checkbox>
      </b-form>
    </b-container>
    <hr />
    <div v-if="loading">
      <b-spinner label="Loading..." class="m-5"></b-spinner>
    </div>
    <b-container align="center">
      <b-col align-v="center">
        <work-of-culture
          v-for="rec in displayRecommendations"
          :name="rec.title"
          :id="rec.id"
          :image="rec.imageUrl"
          :key="rec.id"
          :type="rec.workOfCultureType"
        ></work-of-culture>
      </b-col>
      <hr />
      <hr />
      <b-pagination
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
    </b-container>
  </div>
</template>

<script>
import WorkOfCultureCard from "@/components/WorkOfCultureCard.vue";

export default {
  components: { "work-of-culture": WorkOfCultureCard },
  mounted() {
    this.getGernes();
  },
  computed: {
    getStatus() {
      if (this.status == "false") return false;
      else return true;
    },
  },
  data() {
    return {
      selectedType: null,
      selectedGenre: null,
      types: ["ANIME", "MANGA", "TVSERIES", "MOVIE", "GAME"],
      genres: [],
      genresTypes: [],
      alertShow: false,
      alertVariant: "success",
      alerText: "Successful login",
      search: "",
      disabled: false,
      currentPage: 1,
      perPage: 1,
      rows: 2,
      recommendations: [],
      displayRecommendations: [],
      loading: false,
      status: "false",
    };
  },
  methods: {
    paginate(currentPage) {
      const start = (currentPage - 1) * this.perPage;
      this.displayRecommendations = this.recommendations.slice(
        start,
        start + 1
      );
    },
    async getGernes() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/work-of-culture/genres"
        );
        const data = await response.json();
        this.genres = data;

        this.selectedType = "ANIME";
        this.setGernes();
        this.selectedGenre = null;
      } catch (error) {
        console.log(error.message);
        this.alertShow = true;
        this.alertVariant = "danger";
        this.alerText = "Cannot connect to the server";
      }
    },

    async getRecommendationByGenre() {
      let params = {
        genreType: this.selectedGenre,
      };

      let query = Object.keys(params)
        .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");

      let url =
        "http://localhost:8080/api/work-of-culture/" +
        this.selectedType +
        "?" +
        query;

      try {
        const response = await fetch(url);
        const data = await response.json();
        this.recommendations = data.content;
        this.loading = false;
        this.rows = data.totalElements;
        if (this.rows != 0) {
          this.displayRecommendations = data.content.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alerText = "No work of culture was found";
          this.alertShow = true;
        }
      } catch (error) {
        console.log(error.message);
        this.loading = false;

        this.alertVariant = "danger";
        this.alerText = "Select genre or name the title ";
        this.alertShow = true;
      }
    },

    async getRecommendationBySearch() {
      let params = {
        title: this.search,
      };

      let query = Object.keys(params)
        .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");

      let url =
        "http://localhost:8080/api/work-of-culture/" +
        this.selectedType +
        "/filter" +
        "?" +
        query;

      try {
        const response = await fetch(url);
        const data = await response.json();
        this.search = "";
        this.recommendations = data.content;
        this.loading = false;
        this.rows = data.totalElements;
        if (this.rows != 0)
          this.displayRecommendations = data.content.slice(0, 1);
        else {
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

    async getRecommendationByPreference(token) {
      let url =
        "http://localhost:8080/api/work-of-culture/" +
        this.selectedType +
        "/preference";

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
          method: "GET",
        });
        const data = await response.json();
        this.recommendations = data.content;
        this.loading = false;
        this.rows = data.totalElements;
        if (this.rows != 0) {
          this.displayRecommendations = data.content.slice(0, 1);
        } else {
          this.alertVariant = "warning";
          this.alerText = "No work of culture was found";
          this.alertShow = true;
        }
      } catch (error) {
        console.log(error.message);
        this.loading = false;

        this.alertVariant = "danger";
        this.alerText = "Select genre or name the title ";
        this.alertShow = true;
      }
    },

    async getRecommendation(event) {
      event.preventDefault();
      this.alertShow = false;
      this.loading = true;
      this.displayRecommendations = [];
      this.currentPage = 1;

      if (this.search != "") this.getRecommendationBySearch();
      else if (this.getStatus == true) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user == null) {
          this.alertVariant = "warning";
          this.alerText = "Please log in";
          this.alertShow = true;
          this.loading = false;
        } else this.getRecommendationByPreference(user.accessToken);
      } else this.getRecommendationByGenre();
    },

    setGernes() {
      for (let i = 0; i < this.genres.length; i++) {
        if (this.genres[i].workOfCultureType == this.selectedType) {
          this.genresTypes = this.genres[i].genreTypes;
          this.disabled = false;
        }
      }

      this.selectedGenre = null;
    },
  },
};
</script>
