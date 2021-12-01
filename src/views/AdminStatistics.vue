<template>
  <div class="registration">
    <h1>Statistics</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alertText
    }}</b-alert>
    <b-container>
      <b-row>
        <b-col md="auto">
          <b-form-group
            id="input-group-3"
            label="Start date:"
            label-for="calendar1"
          >
            <b-calendar
              v-model="valueStart"
              @context="onContextStart"
              locale="en-US"
              id="calendar1"
            ></b-calendar>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="input-group-4"
            label="End date:"
            label-for="calendar2"
          >
            <b-calendar
              v-model="valueEnd"
              @context="onContextEnd"
              locale="en-US"
              id="calendar2"
            ></b-calendar>
          </b-form-group>
        </b-col>
        <b-col cols="5">
          <b-container>
            <b-row>
              <b-col>
                <p class="text">Work of culture type</p>
                <b-form-select
                  class="select"
                  v-model="selectedType"
                  :options="types"
                  :disabled="show"
                  v-on:change="resetGenre"
                >
                </b-form-select>
              </b-col>
              <b-col>
                <p class="text">Genre</p>
                <b-form-select
                  class="select"
                  v-model="selectedGenre"
                  :options="displayGenres"
                  :disabled="show"
                  v-on:change="setDisplayStatistics"
                >
                </b-form-select>
              </b-col>
            </b-row>
            <hr />
            <b-row>
              <b-col>
                <b-form>
                  <b-button
                    :disabled="showButton"
                    @click="downloadData"
                    variant="primary"
                    >Download statistics</b-button
                  >
                </b-form>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <hr />
      <h2>Discussions statistics</h2>
      <p></p>
      <b-row>
        <b-col>
          <p>Discussion count: {{ this.stats.discussionCount }}</p>
        </b-col>
        <b-col>
          <p>Discussion count before: {{ this.stats.discussionCountBefore }}</p>
        </b-col>
        <b-col>
          <p>Discussion count gain: {{ this.stats.discussionCountGain }}</p>
        </b-col>
        <b-col>
          <p>
            Discussion count gain%: {{ this.stats.discussionCountGainPercent }}%
          </p>
        </b-col>
      </b-row>
      <hr />
      <h2>Reviews statistics</h2>
      <p></p>
      <b-row>
        <b-col>
          <p>Review count: {{ this.stats.reviewCount }}</p>
        </b-col>
        <b-col>
          <p>Review count before: {{ this.stats.reviewCountBefore }}</p>
        </b-col>
        <b-col>
          <p>Review count gain: {{ this.stats.reviewCountGain }}</p>
        </b-col>
        <b-col>
          <p>Review count gain%: {{ this.stats.reviewCountGainPercent }}%</p>
        </b-col>
      </b-row>
      <hr />
      <h2>Seenlists statistics</h2>
      <p></p>
      <b-row>
        <b-col>
          <p>Seenlist count: {{ this.stats.seenListCount }}</p>
        </b-col>
        <b-col>
          <p>Seenlist count before: {{ this.stats.seenListCountBefore }}</p>
        </b-col>
        <b-col>
          <p>Seenlist count gain: {{ this.stats.seenListCountGain }}</p>
        </b-col>
        <b-col>
          <p>
            Seenlist count gain%: {{ this.stats.seenListCountGainPercent }}%
          </p>
        </b-col>
      </b-row>
      <hr />
      <h2>Watchlists statistics</h2>
      <p></p>
      <b-row>
        <b-col>
          <p>Watchlist count: {{ this.stats.watchListCount }}</p>
        </b-col>
        <b-col>
          <p>Watchlist count before: {{ this.stats.watchListCountBefore }}</p>
        </b-col>
        <b-col>
          <p>Watchlist count gain: {{ this.stats.watchListCountGain }}</p>
        </b-col>
        <b-col>
          <p>
            Watchlist count gain%: {{ this.stats.watchListCountGainPercent }}%
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: ["ANIME", "MANGA", "TVSERIES", "MOVIE", "GAME"],
      selectedGenre: "ACTION",
      selectedType: "ANIME",
      displayGenres: [],
      mangaGenres: [],
      animeGenres: [],
      movieGenres: [],
      gameGenres: [],
      tvSeriesGenres: [],

      valueStart: "",
      contextStart: null,
      valueEnd: "",
      contextEnd: null,
      value: "",

      timeStamp: {
        startDate: "",
        endDate: "",
      },

      statistics: [],
      stats: {
        discussionCount: "",
        discussionCountBefore: "",
        discussionCountGain: "",
        discussionCountGainPercent: "",

        reviewCount: "",
        reviewCountBefore: "",
        reviewCountGain: "",
        reviewCountGainPercent: "",

        seenListCount: "",
        seenListCountBefore: "",
        seenListCountGain: "",
        seenListCountGainPercent: "",

        watchListCount: "",
        watchListCountBefore: "",
        watchListCountGain: "",
        watchListCountGainPercent: "",
      },

      show: true,
      showButton: false,
      alertShow: false,
      alertVariant: "success",
      alertText: "Successful registered",
    };
  },
  mounted() {
    this.getGenres();
  },
  methods: {
    onContextStart(ctx) {
      this.timeStamp.startDate = ctx.selectedYMD;
      this.showButton = false;
    },
    onContextEnd(ctx) {
      this.timeStamp.endDate = ctx.selectedYMD;
      this.showButton = false;
    },
    setDisplayStatistics() {
      this.alertShow = false;
      let i = 0;
      for (i; i < this.statistics.length; i++) {
        if (this.statistics[i].workOfCultureType == this.selectedType) {
          this.setDisplayStatisticsForType(i);
        }
      }
    },
    setDisplayStatisticsForType(index) {
      let j = 0;
      for (j; j < this.statistics[index].genreStatistic.length; j++) {
        if (
          this.statistics[index].genreStatistic[j].genreType ==
          this.selectedGenre
        ) {
          this.setStatistics(index, j);
        }
      }
    },
    setStatistics(i, j) {
      this.stats.discussionCount = this.statistics[i].genreStatistic[
        j
      ].discussionCount;
      this.stats.discussionCountBefore = this.statistics[i].genreStatistic[
        j
      ].discussionCountBefore;
      this.stats.discussionCountGain = this.statistics[i].genreStatistic[
        j
      ].discussionCountGain;
      this.stats.discussionCountGainPercent = this.statistics[i].genreStatistic[
        j
      ].discussionCountGainPercent;

      this.stats.reviewCount = this.statistics[i].genreStatistic[j].reviewCount;
      this.stats.reviewCountBefore = this.statistics[i].genreStatistic[
        j
      ].reviewCountBefore;
      this.stats.reviewCountGain = this.statistics[i].genreStatistic[
        j
      ].reviewCountGain;
      this.stats.reviewCountGainPercent = this.statistics[i].genreStatistic[
        j
      ].reviewCountGainPercent;

      this.stats.seenListCount = this.statistics[i].genreStatistic[
        j
      ].seenListCount;
      this.stats.seenListCountGain = this.statistics[i].genreStatistic[
        j
      ].seenListCountGain;
      this.stats.seenListCountBefore = this.statistics[i].genreStatistic[
        j
      ].seenListCountBefore;
      this.stats.seenListCountGainPercent = this.statistics[i].genreStatistic[
        j
      ].seenListCountGainPercent;

      this.stats.watchListCount = this.statistics[i].genreStatistic[
        j
      ].watchListCount;
      this.stats.watchListCountGain = this.statistics[i].genreStatistic[
        j
      ].watchListCountGain;
      this.stats.watchListCountBefore = this.statistics[i].genreStatistic[
        j
      ].watchListCountBefore;
      this.stats.watchListCountGainPercent = this.statistics[i].genreStatistic[
        j
      ].watchListCountGainPercent;
    },
    resetGenre() {
      this.selectedGenre = null;
      this.stats.reviewCount = "";
      this.stats.reviewCountBefore = "";
      this.stats.reviewCountGain = "";
      this.stats.reviewCountGainPercent = "";

      this.stats.discussionCount = "";
      this.stats.discussionCountBefore = "";
      this.stats.discussionCountGain = "";
      this.stats.discussionCountGainPercent = "";

      this.stats.watchListCount = "";
      this.stats.watchListCountBefore = "";
      this.stats.watchListCountGain = "";
      this.stats.watchListCountGainPercent = "";

      this.stats.seenListCountGain = "";
      this.stats.seenListCountGainPercent = "";
      this.stats.seenListCountBefore = "";
      this.stats.seenListCount = "";

      this.changeDisplayGenre();
    },
    changeDisplayGenre() {
      if (this.selectedType == "ANIME") {
        this.displayGenres = this.animeGenres;
      } else if (this.selectedType == "MANGA") {
        this.displayGenres = this.mangaGenres;
      } else if (this.selectedType == "GAME") {
        this.displayGenres = this.gameGenres;
      } else if (this.selectedType == "TVSERIES") {
        this.displayGenres = this.tvSeriesGenres;
      } else if (this.selectedType == "MOVIE") {
        this.displayGenres = this.movieGenres;
      }
    },
    async downloadData() {
      if (
        new Date(this.timeStamp.startDate) <= new Date(this.timeStamp.endDate)
      ) {
        let url = "http://localhost:8080/api/work-of-culture/overall-statistic";

        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.accessToken,
          },
          method: "POST",
          body: JSON.stringify(this.timeStamp),
        });

        const data = await response.json();
        this.statistics = data.statistic;

        if (this.statistics !== undefined) {
          this.showButton = true;
          this.show = false;
          this.setDisplayStatistics();
        } else {
          this.alertShow = true;
          this.alertVariant = "danger";
          this.alertText = "Cannot connect to the server";
        }
      } else {
        this.alertShow = true;
        this.alertVariant = "warning";
        this.alertText = "Set proper dates";
      }
    },
    async getGenres() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/work-of-culture/genres"
        );
        const data = await response.json();
        this.setGenres(data);
      } catch (error) {
        this.alertShow = true;
        this.alertVariant = "danger";
        this.alertText = "Cannot connect to the server";
      }
    },
    setGenres(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].workOfCultureType == "ANIME") {
          this.animeGenres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "MANGA") {
          this.mangaGenres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "GAME") {
          this.gameGenres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "TVSERIES") {
          this.tvSeriesGenres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "MOVIE") {
          this.movieGenres = data[i].genreTypes;
        }
        this.displayGenres = this.animeGenres;
      }
    },
  },
};
</script>

<style scoped>
.registration {
  padding: 30px;
  font-weight: 700;
}

.select {
  margin-top: -8px;
}
</style>
