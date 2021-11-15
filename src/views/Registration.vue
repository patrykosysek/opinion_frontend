<template>
  <div class="registration">
    <h1>Registration</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>
    <b-container>
      <b-row>
        <b-col cols="6" md="4">
          <b-form-group
            id="input-group-4"
            label="Date of birth:"
            label-for="calendar"
          >
            <b-calendar
              v-model="value"
              @context="onContext"
              locale="en-US"
              id="calendar"
            ></b-calendar>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="8">
          <b-container>
            <b-row>
              <b-col>
                <b-form-group
                  id="input-group-1"
                  label="Email address:"
                  label-for="input-1"
                >
                  <b-form-input
                    id="input-1"
                    v-model="registration.email"
                    type="email"
                    placeholder="Enter email"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  id="input-group-2"
                  label="Nickname:"
                  label-for="input-2"
                >
                  <b-form-input
                    id="input-2"
                    v-model="registration.nickname"
                    type="text"
                    placeholder="Enter nickname"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  id="input-group-3"
                  label="Password:"
                  label-for="input-3"
                >
                  <b-form-input
                    id="input-3"
                    v-model="registration.password"
                    type="password"
                    placeholder="Enter password"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col align-self="start">
                <p>Favourite genre:</p>
                <b-form-select
                  class="select"
                  v-model="registration.favouriteGenre"
                  :options="allGeneres"
                ></b-form-select>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h2>Optional preferences</h2>
                <hr />
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <p class="text">ANIME</p>
                <b-form-select
                  class="select"
                  v-model="preferenceAnime"
                  :options="animeGeneres"
                >
                  <b-form-select-option :value="null">
                    NO PREFERENCE</b-form-select-option
                  >
                </b-form-select>
              </b-col>
              <b-col>
                <p class="text">MANGA</p>
                <b-form-select
                  class="select"
                  v-model="preferenceManga"
                  :options="mangaGeneres"
                >
                  <b-form-select-option :value="null">
                    NO PREFERENCE</b-form-select-option
                  ></b-form-select
                >
              </b-col>
              <b-col>
                <p class="text">GAMES</p>
                <b-form-select
                  class="select"
                  v-model="preferenceGame"
                  :options="gameGeneres"
                  ><b-form-select-option :value="null">
                    NO PREFERENCE</b-form-select-option
                  ></b-form-select
                >
              </b-col>
              <b-col>
                <p class="text">TV SERIES</p>
                <b-form-select
                  class="select"
                  v-model="preferenceTvSeries"
                  :options="tvSeriesGeneres"
                  ><b-form-select-option :value="null">
                    NO PREFERENCE</b-form-select-option
                  ></b-form-select
                >
              </b-col>
              <b-col>
                <p class="text">MOVIES</p>
                <b-form-select
                  class="select"
                  v-model="preferenceMovie"
                  :options="movieGeneres"
                  ><b-form-select-option :value="null">
                    NO PREFERENCE</b-form-select-option
                  ></b-form-select
                >
              </b-col>
            </b-row>
            <hr />
            <b-row>
              <b-col>
                <b-form @submit="onSubmit" v-if="show">
                  <b-button style="width: 12%" type="submit" variant="primary"
                    >Register</b-button
                  >
                </b-form>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registration: {
        email: "",
        nickname: "",
        password: "",
        favouriteGenre: null,
        dateOfBirth: "",
        preferences: [],
      },

      allGeneres: [],
      mangaGeneres: [],
      animeGeneres: [],
      movieGeneres: [],
      gameGeneres: [],
      tvSeriesGeneres: [],

      preferenceAnime: null,
      preferenceManga: null,
      preferenceMovie: null,
      preferenceTvSeries: null,
      preferenceGame: null,

      value: "",
      context: null,

      show: true,
      alertShow: false,
      alertVariant: "success",
      alerText: "Successful registered",
    };
  },
  mounted() {
    this.getGenres();
    this.getAllGenres();
  },
  methods: {
    onContext(ctx) {
      this.registration.dateOfBirth = ctx.selectedYMD;
    },

    async onSubmit(event) {
      event.preventDefault();

      this.setPreferences();

      const response = await fetch(
        "http://localhost:8080/api/users/registration",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(this.registration),
        }
      );
      const data = await response.json();
      console.log(data);
      if (
        data.code == "email.required" ||
        data.code == "email.invalid" ||
        data.code == "email.taken"
      ) {
        this.alertShow = true;
        this.alertVariant = "warning";
        this.alerText = "Incorrect email ";
      } else if (
        data.code == "password.size" ||
        data.code == "password.required"
      ) {
        this.alertShow = true;
        this.alertVariant = "warning";
        this.alerText = "Incorrect password ";
      } else if (
        data.code == "nickname.size" ||
        data.code == "nickname.required"
      ) {
        this.alertShow = true;
        this.alertVariant = "warning";
        this.alerText = "Incorrect nickname ";
      } else if (data.code == "favouriteGenre.required") {
        this.alertShow = true;
        this.alertVariant = "warning";
        this.alerText = "Incorrect favourite genre ";
      } else if (
        data.code == "dateOfBirth.required" ||
        data.code == "age.notProper"
      ) {
        this.alertShow = true;
        this.alertVariant = "warning";
        this.alerText = "Incorrect date of birth ";
      } else {
        this.alertShow = true;
        this.alertVariant = "success";
        this.alerText = "Registration successful ";

        this.preferenceAnime = null;
        this.preferenceManga = null;
        this.preferenceMovie = null;
        this.preferenceTvSeries = null;
        this.preferenceGame = null;

        this.registration.email = "";
        this.registration.nickname = "";
        this.registration.password = "";
        this.favouriteGenre = null;
        this.dateOfBirth = "";
        this.value="";
      }

      this.preferences = [];
    },

    setPreferences() {
      if (this.preferenceAnime != null) {
        let preference = {
          workOfCultureType: "ANIME",
          favouriteGenre: this.preferenceAnime,
        };
        this.registration.preferences.push(preference);
      }
      if (this.preferenceManga != null) {
        let preference = {
          workOfCultureType: "MANGA",
          favouriteGenre: this.preferenceManga,
        };
        this.registration.preferences.push(preference);
      }
      if (this.preferenceMovie != null) {
        let preference = {
          workOfCultureType: "MOVIE",
          favouriteGenre: this.preferenceMovie,
        };
        this.registration.preferences.push(preference);
      }
      if (this.preferenceTvSeries != null) {
        let preference = {
          workOfCultureType: "TVSERIES",
          favouriteGenre: this.preferenceTvSeries,
        };
        this.registration.preferences.push(preference);
      }
      if (this.preferenceGame != null) {
        let preference = {
          workOfCultureType: "GAME",
          favouriteGenre: this.preferenceGame,
        };
        this.registration.preferences.push(preference);
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
        console.log(error.message);
        this.alertShow = true;
        this.alertVariant = "danger";
        this.alerText = "Cannot connect to the server";
      }
    },
    async getAllGenres() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/work-of-culture/allGenres"
        );
        const data = await response.json();

        this.allGeneres = data;
      } catch (error) {
        console.log(error.message);
        this.alertShow = true;
        this.alertVariant = "danger";
        this.alerText = "Cannot connect to the server";
      }
    },
    setGenres(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].workOfCultureType == "ANIME") {
          this.animeGeneres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "MANGA") {
          this.mangaGeneres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "GAME") {
          this.gameGeneres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "TVSERIES") {
          this.tvSeriesGeneres = data[i].genreTypes;
        } else if (data[i].workOfCultureType == "MOVIE") {
          this.movieGeneres = data[i].genreTypes;
        }
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
