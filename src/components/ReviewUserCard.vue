<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="6" md="4">
          <b-row>
            <b-col>
              <b-card
                title="Likes"
                style="max-width: 20rem;"
                tag="article"
                class="mb-2"
                :footer="getPostDate"
              >
                <b-container>
                  <b-row>
                    <b-col>
                      <b-button-group vertical>
                        <p
                          v-bind:class="[
                            { greenLike: isLiked },
                            { redLike: !isLiked },
                          ]"
                        >
                          {{ this.likes }}
                        </p>
                      </b-button-group>
                    </b-col>
                  </b-row>
                </b-container>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" md="8">
          <b-row class="mb-2">
            <b-col>
              <b-card
                bg-variant="info"
                text-variant="white"
                :header="this.title"
                class="text-center"
              >
                <b-card-text>{{ this.comment }}</b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  props: ["comment", "id", "type", "createDate", "likes", "title"],
  computed: {
    getPostDate() {
      return "Create date: " + this.createDate;
    },
    isLiked() {
      return this.likes >= 0;
    },
  },
};
</script>

<style scoped>
.greenLike {
  font-size: 5vh;
  font-weight: 700;
  padding: -10px;
  color: green;
}
.redLike {
  font-size: 5vh;
  font-weight: 700;
  padding: -10px;
  color: red;
}

.comment {
  font-weight: 700;
  font-size: 2vh;
}
</style>
