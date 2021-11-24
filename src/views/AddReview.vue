<template>
  <div class="recommendation">
    <h1>{{ this.title }}</h1>
    <hr />
    <b-alert :show="alertShow" :variant="alertVariant">{{
      this.alerText
    }}</b-alert>

    <b-container>
      <b-row>
        <b-col>
          <b-form-textarea
            id="textarea"
            v-model="text.review"
            placeholder="Enter review..."
            rows="11"
            max-rows="11"
            :state="text.review.length > 0"
            no-resize
          ></b-form-textarea>

          <b-button @click="addReview" class="btn" variant="primary"
            >Add review</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.params.type,
      alertShow: false,
      alertVariant: "warning",
      alerText: "Review too long",
      title: "",
      text: {
        review: "",
      },
      isAdded: false,
    };
  },
  mounted() {
    this.getTitle();
  },
  methods: {
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
    async addReview() {
      let url =
        " http://localhost:8080/api/review/" + this.type + "/" + this.id;

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        },
        method: "POST",
        body: JSON.stringify(this.text),
      });

      console.log(response);

      if (this.isAdded == true) {
        this.alertVariant = "warning";
        this.alerText = "Work already reviewed";
        this.text.review = "";
      } else if (response.status == 400) {
        this.alertShow = true;
      } else if (response.status == 201) {
        this.alertShow = true;
        this.alertVariant = "success";
        this.alerText = "Review successfully added";
        this.text.review = "";
        this.isAdded = true;
      } else {
        this.alertShow = true;
        this.alertVariant = "danger";
        this.alerText = "Cannot connect to the server";
      }
    },
  },
};
</script>

<style scoped>
.recommendation {
  padding: 30px;
}

.btn {
  margin: 10px;
}

.text {
  font-weight: 700;
}
</style>
