<template>
   <div class="content">
      <div :class="{ left_info: true, slide: !isLeftShow }">
         <el-scrollbar wrapClass="el-scrollbar__change" style="height: 100%">
            <LeftColumn :columns="columns" @goPage="goPage($event)" @getColumnName="getColumnName($event)"></LeftColumn>
         </el-scrollbar>
      </div>
      <div class="main_warp">
         <el-scrollbar wrapClass="el-scrollbar__change" style="height: 100%">
            <div :class="{ main_info: true, full: !isLeftShow }">
               <!--            <div class="nav_header">-->
               <!--                <div :class="{'slider-icon':true,rotate:!isLeftShow}" @click="changeLeft()">-->
               <!--                    <div class="line el-icon-s-fold"></div>-->
               <!--                </div>-->
               <!--                <div class="nav-position">-->
               <!--                    个人事务 {{positionName}}-->
               <!--                </div>-->
               <!--            </div>-->
               <div class="nav_info">
                  <div class="tags_info radius_btm_none">
                     <div class="arrow" @click="moveLeft()"><i class="el-icon-arrow-left"></i></div>
                     <div class="tags" ref="tags">
                        <div class="tags-data" ref="tags-data" :style="{ left: moveVal + 'px' }">
                           <transition-group
                              mode="out-in"
                              enter-active-class="animate__animated animate__fadeInRight animate__faster"
                              leave-active-class="animate__animated animate__fadeOut animate__faster"
                           >
                              <div
                                 v-for="(item, index) in tags"
                                 :key="index"
                                 :class="{ tag_item: true, active: item.lnkActive }"
                                 @click="goTabgsPage(item.path, index, item.title)"
                              >
                                 <div class="tag_item_info">
                                    <div class="tag_icon">
                                       <img src="../../assets/images/nav/nav_icon.png" alt="" />
                                    </div>
                                    <div class="tag_span">{{ item.title }}</div>
                                    <div class="tag_close" v-show="index > 0" @click.stop="closeTags(index)">
                                       <img src="../../assets/images/nav/nav_close.png" alt="" />
                                    </div>
                                 </div>
                              </div>
                           </transition-group>
                        </div>
                     </div>
                     <div class="arrow" @click="moveRight()"><i class="el-icon-arrow-right"></i></div>
                  </div>
               </div>
               <div class="business">
                  <transition
                     mode="out-in"
                     enter-active-class="animate__animated animate__fadeIn animate__faster"
                     leave-active-class="animate__animated animate__fadeOut animate__faster"
                  >
                     <router-view></router-view>
                  </transition>
               </div>
            </div>
         </el-scrollbar>
      </div>
   </div>
</template>

<script>
import LeftColumn from "./navLeft";

export default {
   data() {
      return {
         isLeftShow: true,
         positionName: "",
         moveVal: 0,
         columnStr: ""
      };
   },
   props: {
      //菜单
      columns: {
         type: Array,
         required: true
      },
      //标签
      tags: {
         type: Array,
         required: true
      }
   },
   components: {
      LeftColumn
   },
   created() {
      this.changeColumnPathStyle(this.$route.path);
   },
   methods: {
      goPage(data) {
         if (data.isLink) {
            //如果是外链
            window.open(data.path, "_blank");
         } else {
            this.$router.push({
               path: data.path,
               query: {
                  authcode: this.$store.state.admin.authcode
               }
            });
            this.clearColumnStyle();
            this.changeColumnPathStyle(data.path);
         }
      },
      getColumnName(name) {
         this.changeColumnStyle(name);
      },
      //点击展示一级目录切换
      changeColumnPathStyle(path, parentData, data) {
         data = data || this.columns;
         if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
               if (data[i].path == path) {
                  for (let a = 0; a < data.length; a++) {
                     data[a].active = false;
                  }
                  if (!data[i].children || data[i].children.length <= 0) {
                     this.positionName = "";
                     data[i].lnkActive = true;
                     if (parentData) {
                        parentData.active = true;
                        this.positionName += " / " + parentData.title + " / " + data[i].title;
                     } else {
                        this.positionName = " / " + data[i].title;
                     }
                     //添加tags标签
                     this.addTags({
                        title: data[i].title,
                        path: data[i].path,
                        lnkActive: data[i].lnkActive
                     });
                  }
                  break;
               }
               if (data[i].children && data[i].children.length > 0) {
                  this.changeColumnPathStyle(path, data[i], data[i].children);
               }
            }
         }
      },
      //添加tags数据
      addTags(data) {
         let isSame = false;
         if (this.tags.length > 0) {
            for (let key in this.tags) {
               if (this.tags[key].lnkActive) {
                  this.tags[key].lnkActive = false;
               }
            }
            for (let key in this.tags) {
               if (this.tags[key].path === data.path) {
                  isSame = true;
                  this.tags[key].lnkActive = true;
                  break;
               }
            }
         }
         if (!isSame) {
            this.tags.push(data);
         }
      },
      //关闭tags数据
      closeTags(index) {
         let prevPath = this.tags[index - 1].path;
         this.tags[index - 1].lnkActive = true;
         this.$set(this.tags, index - 1, this.tags[index - 1]);
         for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].active = false;
         }
         this.clearColumnStyle();
         this.changeColumnPathStyle(prevPath);
         this.$router.push({
            path: prevPath,
            query: {
               authcode: this.$store.state.admin.authcode
            }
         });
         this.tags.splice(index, 1);
      },
      //点击便签切换页面
      goTabgsPage(path, index, name) {
         for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].active = false;
         }
         this.clearColumnStyle();
         this.changeColumnPathStyle(path);
         if (this.tags.length > 0) {
            for (let key in this.tags) {
               if (this.tags[key].lnkActive) {
                  this.tags[key].lnkActive = false;
                  break;
               }
            }
         }
         this.tags[index].lnkActive = true;
         this.$set(this.tags, index, this.tags[index]);
         this.$router.push({
            path: path,
            query: {
               authcode: this.$store.state.admin.authcode
            }
         });
      },
      clearColumnStyle(data) {
         data = data || this.columns;
         for (let i = 0; i < data.length; i++) {
            if (data[i].lnkActive == true) {
               data[i].lnkActive = false;
               break;
            }
            if (data[i].children && data[i].children.length > 0) {
               this.clearColumnStyle(data[i].children);
            }
         }
      },
      //点击展示二级目录
      changeColumnStyle(name, parentName, data) {
         data = data || this.columns;
         if (data.length > 0) {
            this.clearColumnStyle();
            for (let i = 0; i < data.length; i++) {
               if (data[i].title == name) {
                  if (!data[i].active) {
                     for (let a = 0; a < data.length; a++) {
                        data[a].active = false;
                     }
                  }
                  data[i].active = !data[i].active;
                  if (!data[i].children || data[i].children.length <= 0) {
                     this.positionName = "";
                     data[i].lnkActive = true;
                     if (parentName) {
                        this.positionName += " / " + parentName + " / " + data[i].title;
                     } else {
                        this.positionName = " / " + name;
                     }
                  }
                  break;
               }
               if (data[i].children && data[i].children.length > 0) {
                  this.changeColumnStyle(name, data[i].title, data[i].children);
               }
            }
         }
      },
      changeLeft() {
         this.isLeftShow = !this.isLeftShow;
      },
      //右移动
      moveRight() {
         let tags = this.$refs["tags"];
         let tagsData = this.$refs["tags-data"];
         let offsetVal = Math.abs(parseInt(tagsData.style.left));
         if (tagsData.offsetWidth >= tags.offsetWidth && offsetVal < tags.offsetWidth) {
            this.moveVal += -300;
         }
      },
      //左移动
      moveLeft() {
         let tagsData = this.$refs["tags-data"];
         let offsetVal = parseInt(tagsData.style.left);
         if (offsetVal < 0) {
            this.moveVal -= -300;
         }
      }
   },
   watch: {
      //路由跳转后监听添加标签
      $route(val, old) {
         this.changeColumnPathStyle(val.path);
      }
   }
};
</script>

<style scoped lang="scss">
.content,
.main_warp {
   height: 100%;
}

.main_warp {
   margin-left: 186px;

   > .el-scrollbar__view {
      min-height: 100%;
      display: flex;
   }
}

.main_info {
   height: auto;
   width: 100%;
   padding: 16px 16px 16px 0;
   box-sizing: border-box;
}

.left_info {
   position: fixed;
   top: 110px;
   height: calc(100% - 90px);
   width: 170px;
   background: #2779d6;
   background-size: 100% 100%;
   padding: 20px 0;
   box-sizing: border-box;
}

.tags_info {
   background: #e4e7ec;
   overflow: hidden;
   display: flex;
}

.tags {
   width: auto;
   height: 35px;
   position: relative;
   z-index: 1;
   overflow: hidden;
   flex: 1;
   box-sizing: border-box;
}

.arrow {
   cursor: pointer;
   height: 35px;
   line-height: 35px;
   width: 30px;
   text-align: center;
   background: #e4e7ec;
}

.arrow:first-child {
   border-right: 1px solid #ccd3df;
}

.arrow:last-child {
   border-left: 1px solid #ccd3df;
}

.tags .tags-data {
   width: auto;
   height: 100%;
   position: absolute;
   z-index: 1;
   left: 0;
   top: 0;
   display: -webkit-box;
   -webkit-transition: left 1s;
   transition: left 1s;
}

.tags-data > span {
   display: block;
   width: 100%;
}

.tag_item {
   display: inline-block;
}

.tag_item_info {
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 14px;
   height: 35px;
   line-height: 35px;
   padding: 0 20px;
   position: relative;
   z-index: 1;
   cursor: pointer;
   background: #e4e7ec;
   color: #333333;
   border-right: 1px solid #ccd3df;
   transition: all 0.2s ease-out 0.2s;
}

.tag_item.active .tag_item_info {
   background: #fff;
}

.tag_icon {
   margin-right: 7px;
}

.tag_close {
   margin-left: 7px;
}

.nav-position {
   height: 30px;
   line-height: 30px;
   font-size: 14px;
}

.nav_header {
   display: flex;
   align-items: center;
}

.slider-icon {
   font-size: 14px;
   margin-right: 20px;
}

.business {
   height: calc(100% - 35px);
}
</style>
