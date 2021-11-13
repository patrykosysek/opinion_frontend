<template>
  <div>
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>
    <b-container @change="setGernes">
      <b-form-select
        v-model="selectedType"
        :options="this.types"
      ></b-form-select>
    </b-container>
    <b-container>
      <b-form-select
        v-model="selectedGenre"
        :options="genresTypes"
      ></b-form-select>
    </b-container>
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
      types: ["ANIME", "MANGA", "TVSERIES", "MOVIE", "GAME"],
      genres: [],
      genresTypes: [],
      alertShow: false,
      alertVariant: "success",
      alerText: "Successful login",
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
        this.genresTypes = this.genres[0].genreTypes;
        this.selectedGenre = null;
      } catch (error) {
        console.log(error);
        this.alertShow = true;
        this.alertVariant = "danger";
        this.alerText = "Cannot connect to the server";
      }
    },

    async getRecommendation() {
      let params = {
        param1: "value1",
        param2: "value2",
      };

      let query = Object.keys(params)
        .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");

      let url = "https://example.com/search?" + query;

    console.log(url);

        // http://localhost:8080/api/work-of-culture/ANIME?genreType=ACTION

    },

    setGernes(event) {
      event.preventDefault();

      if (this.selectedType == "ANIME") {
        this.genresTypes = this.genres[0].genreTypes;
        this.selectedGenre = null;
      } else if (this.selectedType == "MANGA") {
        this.genresTypes = this.genres[1].genreTypes;
        this.selectedGenre = null;
      } else if (this.selectedType == "TVSERIES") {
        this.genresTypes = this.genres[2].genreTypes;
        this.selectedGenre = null;
      } else if (this.selectedType == "MOVIE") {
        this.genresTypes = this.genres[3].genreTypes;
        this.selectedGenre = null;
      } else if (this.selectedType == "GAME") {
        this.genresTypes = this.genres[1].genreTypes;
        this.selectedGenre = null;
      }
    },
  },
};
</script>
