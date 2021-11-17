<template>
  <div class="home">
    <h1>Our Recommendation</h1>
    <hr />

    <b-container align="center">
      <b-row>
        <b-col>
          <b-pagination
            class="pagination"
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
      <b-row>
        <b-col align-v="center">
          <job-card
            class="work"
            v-for="rec in displayRecommendations"
            :name="rec.title"
            :id="rec.id"
            :image="rec.imageUrl"
            :key="rec.id"
            :type="rec.workOfCultureType"
          ></job-card>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="loading">
      <b-spinner label="Loading..." class="m-5"></b-spinner>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import JobCard from "@/components/JobCard.vue";

export default {
  name: "home",
  mounted() {
    this.getRecommendations();
    // this.paginate(this.currentPage);
  },
  data() {
    return {
      currentPage: 1,
      perPage: 1,
      rows: 2,
      recommendations: [],
      displayRecommendations: [],
      loading: false,
    };
  },
  components: { "job-card": JobCard },
  methods: {
    paginate(currentPage) {
      const start = (currentPage - 1) * this.perPage;
      this.displayRecommendations = this.recommendations.slice(
        start,
        start + 1
      );
    },

    async getRecommendations() {
      this.loading = true;
      try {
        const response = await fetch(
          "http://localhost:8080/api/work-of-culture/recommendation"
        );
        const data = await response.json();
        this.recommendations = data;
        this.loading = false;
        this.rows = this.recommendations.length;
        this.displayRecommendations = data.slice(0, 1);
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },

    // async paginate(currentPage) {

    //   console.log(currentPage);

    //   this.loading = true;
    //   try {
    //     const response = await fetch(
    //       "http://localhost:8080/api/work-of-culture/recommendation"
    //     );
    //     const data = await response.json();
    //     console.log(data);
    //     this.recommendations = data;
    //     this.loading = false;
    //   } catch (error) {
    //     console.log(error);
    //     this.loading = false;
    //   }

    //   //alert("paginate", currentPage);
    // },

    // async onSubmit(event) {
    //   event.preventDefault();
    //   console.log("dziala");
    //   const user = JSON.parse(localStorage.getItem("user"));
    //   const response = await fetch("http://localhost:8080/api/users", {
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + user.accessToken,
    //     },
    //     method: "GET",
    //   });
    //   const data = await response.json();
    //   console.log(data);
    // },
  },
};
</script>
<style lang="scss" scoped>
.home {
  padding: 30px;
}

.work {
  padding: 20px;
}
</style>
