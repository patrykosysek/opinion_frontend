<template>
  <div class="details">
    <h1>{{ details.title }}</h1>
    <hr />

    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>

    <div v-if="loading">
      <b-spinner label="Loading..." class="m-5"></b-spinner>
    </div>

    <b-container>
      <b-row >
        <b-col cols="6" md="4">
          <b-row>
            <b-col >
              <b-img
                thumbnail
                fluid
                :src="details.imageUrl"
                alt="Image 1"
                width="1000px"
                
              ></b-img>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" md="8">
          <b-row class="mb-2">
            <b-col>
              <b-card
                bg-variant="info"
                text-variant="white"
                header="Description"
                class="text-center"
              >
                <b-card-text>{{ this.details.description }}</b-card-text>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-card-group deck>
                <b-card
                  bg-variant="secondary"
                  text-variant="white"
                  header="Release date"
                  class="text-center"
                >
                  <b-card-text>{{ this.details.releaseDate }}</b-card-text>
                </b-card>
                <b-card
                  bg-variant="secondary"
                  text-variant="white"
                  header="Type"
                  class="text-center"
                >
                  <b-card-text>{{
                    this.details.workOfCultureType
                  }}</b-card-text>
                </b-card>
                <b-card
                  bg-variant="secondary"
                  text-variant="white"
                  header="Genres"
                  class="text-center"
                >
                  <b-card-text>
                    <li v-for="g in this.details.genres" :key="g">
                      {{ g }}
                    </li>
                  </b-card-text>
                </b-card>
              </b-card-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      let url =
        "http://localhost:8080/api/work-of-culture/" +
        this.type +
        "/" +
        this.id +
        "/information";

      this.loading = true;
      this.alertShow = false;
      try {
        const response = await fetch(url);
        const data = await response.json();
        this.details.title = data.title;
        this.details.description = data.description;
        this.details.releaseDate = data.releaseDate;
        this.details.imageUrl = data.imageUrl;
        this.details.genres = data.genres;
        this.details.workOfCultureType = data.workOfCultureType;

        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.alertShow = true;
      }
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.params.type,
      alertShow: false,
      alertVariant: "danger",
      alerText: "Cannot connect to the server",
      loading: false,
      details: {
        title: "",
        description: "",
        releaseDate: "",
        imageUrl: "",
        genres: [],
        workOfCultureType: "",
      },
    };
  },
};
</script>

<style scoped>
.details {
  padding: 30px;
}
</style>
