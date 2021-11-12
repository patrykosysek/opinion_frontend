<template>
  <div class="home">
    <h1>Recommendation</h1>
    <hr />
    <div v-if="loading">
      <b-spinner label="Loading..." class="m-5"></b-spinner>
    </div>
    <b-form @submit="onSubmit">
      <b-button type="submit" variant="primary">TEST</b-button>
    </b-form>
    <b-container align="center">
      <b-col align-v="center">
        <job-card
          v-for="rec in recommendations"
          :name="rec.title"
          :id="rec.id"
          :image="rec.imageUrl"
          :key="rec.id"
          :type="rec.workOfCultureType"
        ></job-card>
      </b-col>
      <!-- <b-pagination
        v-model="currentPage"
        :total-rows="getRows"
        :per-page="perPage"
        first-text="First"
        prev-text="Prev"
        next-text="Next"
        last-text="Last"
        @input="paginate(currentPage)"
      ></b-pagination> -->
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import JobCard from "@/components/JobCard.vue";

export default {
  name: "home",
  mounted() {
    this.getRecommendations();
  },
  data() {
    return {
      currentPage: 1,
      perPage: 3,
      recommendations: [],
      loading: false,
    };
  },
  components: { "job-card": JobCard },
  methods: {
    // paginate(currentPage) {
    //   this.$store.dispatch("paginate", { currentPage, perPage: this.perPage });
    // },
    // async getRecords() {
    //   await this.$store.dispatch("fetchJobs");
    // },

    async onSubmit(event) {
      event.preventDefault();
      console.log("dziala");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://localhost:8080/api/users", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
           Authorization: "Bearer " + user.accessToken
        },
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    },

    async getRecommendations() {
      this.loading = true;
      try {
        const response = await fetch(
          "http://localhost:8080/api/work-of-culture/recommendation"
        );
        const data = await response.json();
        console.log(data);
        this.recommendations = data;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
