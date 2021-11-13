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
        :disabled="disabled"
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
      </b-form>
    </b-container>
    <hr />
  </div>
</template>

<script>
export default {
  mounted() {
    this.getGernes();
  },
  data() {
    return {
      selectedType: null,
      selectedGenre: null,
      types: ["ANIME", "MANGA", "TVSERIES", "MOVIE", "GAME", "PREFERENCE"],
      genres: [],
      genresTypes: [],
      alertShow: false,
      alertVariant: "success",
      alerText: "Successful login",
      works: [],
      search: "",
      disabled: false,
    };
  },
  methods: {
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
        console.log(this.genres);
      } catch (error) {
        console.log(error);
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

      console.log(url);

      try {
        const response = await fetch(url);
        const data = await response.json();
        this.works = data;
        console.log(this.works);
      } catch (error) {
        console.log(error);
        this.alertShow = 3;
        this.alertVariant = "danger";
        this.alerText = "Select genre or name the title ";
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

      console.log(url);

      try {
        const response = await fetch(url);
        const data = await response.json();
        this.works = data;
        console.log(this.works);
        this.search = "";
      } catch (error) {
        console.log(error);
        this.alertShow = 3;
        this.alertVariant = "danger";
        this.alerText = "Cannot connect to the server";
      }
    },

    async getRecommendation(event) {
      event.preventDefault();

      if (this.search == "") this.getRecommendationByGenre();
      else this.getRecommendationBySearch();
    },

    setGernes() {
      for (let i = 0; i < this.genres.length; i++) {
        if (this.genres[i].workOfCultureType == this.selectedType) {
          this.genresTypes = this.genres[i].genreTypes;
          console.log(this.selectedType);
          this.disabled = false;
        }
      }
        if(this.selectedType == "PREFERENCE")
        this.disabled= true;


      this.selectedGenre = null;
    },
  },
};
</script>
