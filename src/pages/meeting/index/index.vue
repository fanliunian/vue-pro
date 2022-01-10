<template>
  <Nav :columns="columns" :tags="tags" v-if="flag"></Nav>
</template>

<script>
import Nav from "@/components/nav";
import {getMenu} from "@/api/meeting";
import store from "@/store";

export default {
  data() {
    return {
      flag: false,
      columns: [],
      tags: [
        //标签
        {
          title: "会议管理",
          path: "/main/meeting/form/conferenceDepartment",
          lnkActive: true
        }
      ]
    };
  },
  components: {
    Nav
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      // try {
      //   let res = await getMenu();
      //   if (res.status === 200) {
      //     this.columns = res.data.data.children;
      //     this.flag = true;
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
      this.$store.dispatch("menu/getMenu").then(res => {
        if (res) {
          this.columns = this.$store.state.menu.menu.children;
          this.flag = true;
        }
      })
    }
  }
};
</script>

<style scoped></style>
