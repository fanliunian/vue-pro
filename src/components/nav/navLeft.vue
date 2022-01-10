<template>
   <div class="navs_info">
      <template v-for="(item, index) in columns">
         <div
            :class="{ 'column-name': true, active: item.active, 'lnk-active': item.lnkActive }"
            :key="index"
            @click="
               item.path
                  ? goPage({ path: item.path, title: item.title, isLink: item.isLink })
                  : getColumnName(item.title)
            "
         >
            <div class="columns_info flex_layout">
               <div class="columns_img pr-10" v-if="item.icon && item.icon.length > 0">
                  <div :class="['columns_icon', item.icon]"></div>
               </div>
               <div>{{ item.title }}</div>
               <div class="icon el-icon-arrow-right" v-if="item.children && item.children.length > 0"></div>
            </div>
         </div>
         <el-collapse-transition>
            <div class="next-wrap" v-show="item.active" v-if="item.children && item.children.length > 0">
               <left-column
                  v-if="item.children && item.children.length > 0"
                  :columns="item.children"
                  @goPage="goPage($event)"
                  @getColumnName="getColumnName($event)"
               >
               </left-column>
            </div>
         </el-collapse-transition>
      </template>
   </div>
</template>

<script>
export default {
   name: "LeftColumn",
   data() {
      return {};
   },
   props: {
      columns: {
         type: Array,
         required: true
      },
      level: {
         type: Number,
         default: 0
      }
   },
   created() {},
   methods: {
      goPage(data) {
         this.$emit("goPage", data);
      },
      getColumnName(data) {
         this.$emit("getColumnName", data);
      }
   }
};
</script>

<style scoped>
.navs_info {
   height: 100%;
   position: relative;
}

.columns_info {
   color: rgba(255, 255, 255, 0.5);
   font-size: 14px;
   padding-left: 20px;
   padding-right: 10px;
   cursor: pointer;
   height: 43px;
   line-height: 43px;
   position: relative;
   box-sizing: border-box;
   background: transparent;
   transition: all 0.2s ease-out 0.2s;
}

.columns_info:after {
   content: "";
   position: absolute;
   top: 0;
   left: 0;
   height: 100%;
   width: 3px;
   background: transparent;
   transition: all 0.2s ease-out 0.2s;
}

.columns_info .icon {
   position: absolute;
   right: 12px;
   top: 50%;
   transform: translate(0, -50%);
   transition: all 0.2s ease-out 0.2s;
}

.column-name.active .columns_info {
   background: rgba(72, 154, 244, 0.4);
   color: #fff;
}

.column-name.active .columns_info:after {
   background: #50efa6;
}

.column-name.active .icon {
   transform: translate(0, -50%) rotate(90deg);
}

.column-name.active + .next-wrap .column-name.lnk-active .columns_info {
   background: rgba(72, 154, 244, 0.4);
   color: #ffffff;
   box-sizing: border-box;
}

.column-name + .next-wrap .column-name .columns_info {
   padding-left: 45px;
}

.column-name.lnk-active > .columns_info {
   background: rgba(72, 154, 244, 0.4);
   color: #ffffff;
   box-sizing: border-box;
}

.column-name.lnk-active > .columns_info:after {
   background: #50efa6;
}

.columns_icon {
   width: 17px;
   height: 17px;
}

.icon-hydb {
   background: url("../../assets/images/meeting/home_1.png") no-repeat;
}

.icon-hylb {
   background: url("../../assets/images/meeting/home_2.png") no-repeat;
}

.icon-ytk {
   background: url("../../assets/images/meeting/home_3.png") no-repeat;
}

.icon-hyk {
   background: url("../../assets/images/meeting/home_4.png") no-repeat;
}
</style>
