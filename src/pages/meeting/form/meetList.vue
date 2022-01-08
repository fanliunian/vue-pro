<!--我的会议-->
<template>
   <div class="main_information">
      <!--会议查询-->
      <div class="form_search mb-16 radius_top_none">
         <div class="flex_layout search_info">
            <div class="search_input flex_layout">
               <div class="search_input_info flex_layout">
                  <div style="width: 100px">会议名称：</div>
                  <el-input placeholder="请输入" v-model="meetName"></el-input>
               </div>
               <div class="search_input_info flex_layout">
                  <div style="width: 100px">发起部门：</div>
                  <el-input placeholder="请输入" v-model="createDept"></el-input>
               </div>
               <div class="search_input_info flex_layout">
                  <div style="width: 80px">状态：</div>
                  <el-select v-model="stateData" placeholder="请选择">
                     <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                     </el-option>
                  </el-select>
               </div>
            </div>
            <div class="search_btn">
               <button type="button" class="btn btn_blue" @click="searchData"><span>查询</span></button>
               <button type="button" class="btn btn_wathet" @click="resetData"><span>重置</span></button>
            </div>
         </div>
      </div>
      <!--会议表格-->
      <div class="form_main border_radius">
         <div class="form_table_title pb-16 flex_layout">
            <div class="table_title">我的会议</div>
         </div>
         <div class="form_table">
            <el-table :data="tableData" stripe style="width: 100%;height: 100%">
               <el-table-column label="会议名称" prop="meetName" min-width="250">
                  <template slot-scope="scope">
                     <div class="form_title_color form_limit" :title="scope.row.meetName" @click="detail(scope.row)">
                        {{ scope.row.meetName }}
                     </div>
                  </template>
               </el-table-column>
               <el-table-column label="会议时间" prop="meetTime" :formatter="meetingtime" sortable>
                  <template slot="header" slot-scope="scope">
                     <el-tooltip class="item" effect="dark" content="点击排序" placement="top">
                        <span>会议时间</span>
                     </el-tooltip>
                  </template>
               </el-table-column>
               <el-table-column label="会议地点" prop="meetLocate"></el-table-column>
               <el-table-column label="发起部门" prop="meetCreateDept"></el-table-column>
               <el-table-column label="状态" prop="state" :formatter="state"></el-table-column>
               <el-table-column label="类型" prop="post" :formatter="typePost"></el-table-column>
               <el-table-column label="送达时间" prop="arrivaltime" :formatter="arrivaltime" sortable>
                  <template slot="header" slot-scope="scope">
                     <el-tooltip class="item" effect="dark" content="点击排序" placement="top">
                        <span>送达时间</span>
                     </el-tooltip>
                  </template>
               </el-table-column>
               <el-table-column label="操作" min-width="80">
                  <template slot-scope="scope">
                     <div class="form_operation">
                        <div title="反馈参会情况" @click="situation(scope.row)">
                           <img src="../../../assets/images/icon/participate.png" alt="" />
                        </div>
                     </div>
                     <div class="form_operation">
                        <div title="明细" @click="detail(scope.row)">
                           <img src="../../../assets/images/icon/detail.png" alt="" />
                        </div>
                     </div>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <!--会议分页-->
         <div class="form_page">
            <el-pagination
               background
               layout="sizes,prev, pager, next"
               :page-size="this.rowsSize"
               :page-sizes="[10, 20, 30, 40]"
               :total="tablePage"
               :current-page="pageSize"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
            >
            </el-pagination>
         </div>
      </div>
      <!--弹窗-->
      <el-dialog title="反馈参会情况" :visible.sync="openURL" width="1000px" append-to-body>
         <div class="iframe_info">
            <iframe :src="this.meetURL" frameborder="0"></iframe>
         </div>
      </el-dialog>
   </div>
</template>

<script>
import { dateFormat } from "@/assets/js/public";
import { getMeetListData } from "@/api/meeting";

export default {
   name: "meetList",
   data() {
      return {
         tableData: [], //表单数据
         tablePage: 0, //总页数
         pageSize: 1, //当前页
         rowsSize: 10, //条数
         meetName: "", //搜索会议名称
         createDept: "", //搜索发起部门
         stateData: "", //搜索状态
         options: [
            {
               value: "0",
               label: "未结束"
            },
            {
               value: "1",
               label: "已结束"
            }
         ],
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
      //获取列表数据
      getData() {
         let data = {
            page: this.pageSize,
            rows: this.rowsSize,
            meetName: this.meetName,
            createDept: this.createDept,
            state: this.stateData
         };
         getMeetListData(data).then(res => {
            this.tableData = res.data.data.rows;
            this.tablePage = res.data.data.total;
         });
      },
      //下一页
      handleCurrentChange(val) {
         this.pageSize = val;
         this.getData();
      },
      //每页显示几条
      handleSizeChange(val) {
         this.rowsSize = val;
         this.getData();
      },
      //搜索
      searchData() {
         // if (this.meetName == "" && this.createDept == "" && this.stateData == "") {
         //    this.$message.error("请填写要查询的信息！！");
         // } else {
            this.pageSize = 1;
            this.getData();
         // }
      },
      //重置
      resetData() {
         this.pageSize = 1;
         this.rowsSize = 10;
         this.meetName = "";
         this.createDept = "";
         this.stateData = "";
         this.getData();
      },
      //时间格式化
      meetingtime(val) {
         return dateFormat(val.meetTime);
      },
      arrivaltime(val) {
         return dateFormat(val.receiveTime);
      },
      state(val) {
         switch (val.state) {
            case "0":
               return "未结束";
            case "1":
               return "已结束";
         }
      },
      typePost(val) {
         switch (val.post) {
            case "LEADER":
               return "个人";
            case "DEPT":
               return "部门";
         }
      },
      //链接跳转
      situation(row) {
         let url = process.env.VUE_APP_MEET + "/meeting/meet/meetAttendance/meetAttendanceEdit?todoId=" + row.id;
         this.meetURL = url;
         this.openURL = true;
      },
      detail(row) {
         let url =
            process.env.VUE_APP_MEET +
            "/form/formBus/hyfa/get?id=" +
            row.meetId +
            "&parentGridId=grid&keyId=" +
            row.meetId;
         window.open(url, "_blank");
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
   height: 700px;
   position: relative;

   iframe {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 0;
   }
}
</style>
