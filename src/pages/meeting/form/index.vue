<!--会议首页-->
<template>
  <div id="meetingHome" class="meetingBlock">
    <div class="container">
      <!--图标-->
      <ul class="meetList">
        <!--<li v-for="(item, index) in summaryInfo" :key="index">
          <p>{{ item.typeKey }}</p>
          <span>{{ item.typeCount }}<img src="../../../assets/images/meeting/dg_icon.png" alt=""/></span>
        </li>-->
        <!--            <li>-->
        <!--               <p>公司会议</p>-->
        <!--               <span>{{ summaryInfo.zrbgh }}<img src="../../../assets/images/meeting/zr_icon.png" alt=""/></span>-->
        <!--            </li>-->
        <!--            <li>-->
        <!--               <p>专题会议</p>-->
        <!--               <span>{{ summaryInfo.dgwzthy }}<img src="../../../assets/images/meeting/ld_icon.png" alt=""/></span>-->
        <!--            </li>-->
        <!--            <li>-->
        <!--               <p>党委会会议</p>-->
        <!--               <span>{{ summaryInfo.gwhzth }}<img src="../../../assets/images/meeting/zt_icon.png" alt=""/></span>-->
        <!--            </li>-->
        <!--            <li>-->
        <!--               <p>其他会议</p>-->
        <!--               <span>{{ summaryInfo.qthy }}<img src="../../../assets/images/meeting/qt_icon.png" alt=""/></span>-->
        <!--            </li>-->
      </ul>
      <div class="items-row">
        <!--会议库-->
        <div class="item" v-if="getConferenceDepartment()">
          <div class="flex_layout flex_between">
            <h4><img src="@/assets/images/meeting/hyk_icon.png" alt=""/>会议库</h4>
            <div style="cursor: pointer" @click="goDetail('/main/meeting/form/conferenceDepartment')">
              <img src="@/assets/images/meeting/more.png" alt=""/>
            </div>
          </div>
          <el-table :data="meetInfoList.slice(0, 5)" stripe style="width: 100%">
            <el-table-column label="会议名称" prop="meetName" min-width="150">
              <template slot-scope="scope">
                <div
                    class="form_title_color form_limit"
                    :title="scope.row.meetName"
                    @click="goDepartment(scope.row)"
                >
                  {{ scope.row.meetName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="会议时间" prop="meetTime" :formatter="meetingtime" sortable></el-table-column>
            <el-table-column label="发起部门" prop="createDept"></el-table-column>
          </el-table>
        </div>
        <!--议题库-->
        <div class="item" v-if="getIssueDepartment()">
          <div class="flex_layout flex_between">
            <h4><img src="@/assets/images/meeting/ytk_icon.png" alt=""/>议题库</h4>
            <div style="cursor: pointer" @click="goDetail('/main/meeting/form/issueDepartment')">
              <img src="@/assets/images/meeting/more.png" alt=""/>
            </div>
          </div>

          <el-table :data="issueLibraryList.slice(0, 5)" stripe style="width: 100%">
            <el-table-column label="议题名称" prop="issueName">
              <template slot-scope="scope">
                <div
                    class="form_title_color form_limit"
                    :title="scope.row.issueName"
                    @click="goissueDepartment(scope.row)"
                >
                  {{ scope.row.issueName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="汇报人" prop="reporterAndRel" width="150"></el-table-column>
          </el-table>
        </div>
      </div>
      <!--我的会议-->
      <div class="items-row">
        <div class="item item-all">
          <div class="flex_layout flex_between">
            <h4><img src="@/assets/images/meeting/wdhy_icon.png" alt=""/>我的会议</h4>
            <div style="cursor: pointer" @click="goDetail('/main/meeting/form/meetList')">
              <img src="@/assets/images/meeting/more.png" alt=""/>
            </div>
          </div>
          <el-table :data="meetToDoList.slice(0, 6)" stripe style="width: 100%">
            <el-table-column label="会议名称" prop="meetName" min-width="200">
              <template slot-scope="scope">
                <div
                    class="form_title_color form_limit"
                    :title="scope.row.meetName"
                    @click="gomeetList(scope.row)"
                >
                  {{ scope.row.meetName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="会议时间" prop="meetTime" :formatter="meetingtime" sortable></el-table-column>
            <el-table-column label="会议地点" prop="meetLocate">
              <template slot-scope="scope">
                <div class="form_limit">{{ scope.row.meetLocate }}</div>
              </template>
            </el-table-column>
            <el-table-column label="发起部门" prop="meetCreateDept"></el-table-column>
            <el-table-column
                label="送达时间"
                prop="receiveTime"
                :formatter="arrivaltime"
                sortable
            ></el-table-column>
            <el-table-column label="操作" min-width="40">
              <template slot-scope="scope">
                <div title="反馈参会情况" @click="gomeetopen(scope.row)">
                  <button class="btn handle-btn"></button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--弹窗-->
      <el-dialog
          title="反馈参会情况"
          :visible.sync="openURL"
          width="1000px"
          append-to-body
          :close-on-click-modal="false"
      >
        <div class="iframe_info">
          <iframe :src="this.meetURL" frameborder="0"></iframe>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {getMeetIndex} from "@/api/meeting";
import {getoaLogin} from "@/api/login";
import {dateFormat} from "@/assets/js/public";

export default {
  name: "meetingindex",
  data() {
    return {
      summaryInfo: "", //图标
      meetInfoList: [], //会议库
      issueLibraryList: [], //议题库
      meetToDoList: [], //我的会议
      openURL: false,
      meetURL: ""
    };
  },
  created() {
    this.getData();
    // 防止this的指向改变
    let self = this;
    // 在window对象上暴露出一个变量，赋值一个函数
    window.refreshTargetGrid = () => {
      // 当iframe中的报表提交按钮点击之后，回调此方法
      self.changeNodeMsg();
    };
  },
  methods: {
    getConferenceDepartment() {
      let flag = false
      this.$store.state.menu.menu.children.forEach(item => {
        item.children.forEach(item2 => {
          if (item2.path === '/main/meeting/form/conferenceDepartment') {
            flag = true
          }
        })
      })
      return flag
    },
    getIssueDepartment() {
      let flag = false
      this.$store.state.menu.menu.children.forEach(item => {
        item.children.forEach(item2 => {
          if (item2.path === '/main/meeting/form/issueDepartment') {
            flag = true
          }
        })
      })
      return flag
    },
    getData() {
      getMeetIndex().then(res => {
        this.summaryInfo = res.data.data.summaryInfo;
        this.meetInfoList = res.data.data.meetInfoList;
        this.issueLibraryList = res.data.data.issueLibraryList;
        this.meetToDoList = res.data.data.meetToDoList;
      });
    },
    goDetail(url) {
      this.$router.push({
        path: url,
        query: {
          authcode: this.$store.state.admin.authcode
        }
      });
    },
    //时间格式化
    meetingtime(val) {
      return dateFormat(val.meetTime);
    },
    arrivaltime(val) {
      return dateFormat(val.receiveTime);
    },
    //链接跳转
    goDepartment(row) {
      let url =
          process.env.VUE_APP_MEET + "/form/formBus/hyfa/get?id=" + row.id + "&parentGridId=grid&keyId=" + row.id;
      window.open(url, "_blank");
    },
    goissueDepartment(row) {
      let url = process.env.VUE_APP_MEET + "/form/formBus/yt/get?id=" + row.id;
      window.open(url, "_blank");
    },
    gomeetList(row) {
      let url =
          process.env.VUE_APP_MEET +
          "/form/formBus/hyfa/get?id=" +
          row.meetId +
          "&parentGridId=grid&keyId=" +
          row.meetId;
      window.open(url, "_blank");
    },
    gomeetopen(row) {
      let url = process.env.VUE_APP_MEET + "/meeting/meet/meetAttendance/meetAttendanceEdit?todoId=" + row.id;
      this.meetURL = url;
      this.openURL = true;
    },
    changeNodeMsg() {
      this.openURL = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.iframe_info {
  width: 100%;
  height: 600px;
  position: relative;

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
