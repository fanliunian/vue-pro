<!--会议室审批-->
<template>
  <div class="main_information">
    <!--会议室查询-->
    <div class="form_search mb-16 radius_top_none">
      <div class="flex_layout search_info">
        <div class="search_input flex_layout">
          <div class="search_input_info flex_layout">
            <div style="width: 130px">会议室名称：</div>
            <el-input placeholder="请输入" v-model="meetingName"></el-input>
          </div>
        </div>
        <div class="search_btn">
          <button type="button" class="btn btn_blue" @click="searchData"><span>查询</span></button>
          <button type="button" class="btn btn_wathet" @click="resetData"><span>重置</span></button>
        </div>
      </div>
    </div>
    <!--会议室表格-->
    <div class="form_main border_radius">
      <div class="form_table_title pb-16 flex_layout flex_between">
        <div class="table_title">会议室审批</div>
        <div class="wtsc_title_btn">
          <button type="button" class="btn btn_wathet" @click="delect(multipleSelection)"><span>批量删除</span>
          </button>
        </div>
      </div>
      <div class="form_table">
        <el-table :data="tableData" stripe style="width: 100%;height: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="预定人" prop="fUsername"></el-table-column>
          <el-table-column label="预定部门" prop="fOrgname"></el-table-column>
          <el-table-column label="会议室名称" prop="fMeetingname" min-width="150">
            <template slot-scope="scope">
              <div class="form_title_color form_limit" :title="scope.row.fMeetingname">{{ scope.row.fMeetingname }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="申请预定时间" prop="fApplytime" :formatter="fApplytime" sortable></el-table-column>
          <el-table-column label="预定开始日期" prop="fBegindate" :formatter="fBegindate" sortable></el-table-column>
          <el-table-column label="预定结束日期" prop="fEnddate" :formatter="fEnddate" sortable></el-table-column>
          <el-table-column label="预定开始时间" prop="fBegintime" sortable></el-table-column>
          <el-table-column label="预定结束时间" prop="fEndtime" sortable></el-table-column>
          <el-table-column label="预定用途" prop="fContent"></el-table-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <div class="form_operation">
                <div title="删除" @click="delect(scope.row)">
                  <img src="../../../assets/images/personal_form/delete.png" alt="">
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--会议室分页-->
      <div class="form_page">
        <el-pagination background layout="sizes,prev, pager, next"
                       :page-size="this.rowsSize" :page-sizes="[10, 20, 30, 40]" :total="tablePage"
                       :current-page="pageSize"
                       @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {dateFormat} from '@/assets/js/public'
import {delectMeetExamineData, getMeetExamineData} from '@/api/meeting'

export default {
  name: "issueUnit",
  data() {
    return {
      tableData: [],//表单数据
      tablePage: 0, //总页数
      pageSize: 1, //当前页
      rowsSize: 10, //条数
      meetingName: "", //搜索会议室名称
      multipleSelection: [],//批量删除
    }
  },
  created() {
    this.getData()
  },
  methods: {
    //获取列表数据
    getData() {
      let data = {
        "page": this.pageSize,
        "rows": this.rowsSize,
        "meetingName": this.meetingName,
      }
      getMeetExamineData(data).then(res => {
        this.tableData = res.data.data.rows;
        this.tablePage = res.data.data.total
      })
    },
    //下一页
    handleCurrentChange(val) {
      this.pageSize = val;
      this.getData()
    },
    //每页显示几条
    handleSizeChange(val) {
      this.rowsSize = val;
      this.getData()
    },
    //搜索
    searchData() {
      // if (this.meetingName == '') {
      //     this.$message.error('请填写要查询的信息！！');
      // } else {
      this.pageSize = 1
      this.getData();
      // }
    },
    //重置
    resetData() {
      this.pageSize = 1;
      this.rowsSize = 10;
      this.meetingName = "";
      this.getData();
    },
    //时间格式化
    fApplytime(val) {
      return dateFormat(val.fApplytime);
    },
    fBegindate(val) {
      return dateFormat(val.fBegindate);
    },
    fEnddate(val) {
      return dateFormat(val.fEnddate);
    },
    //链接跳转
    editor(row) {
      let url = process.env.VUE_APP_MEET + '/meeting/meet/meetingRoom/MeetingRoomEdit?id=' + row.id + '&parentGridId=grid&keyId=' + row.id;
      window.open(url, "_blank");
    },
    //删除、批量删除
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delect(row) {
      let arr = [];
      if (typeof row == "object" && row.constructor == Array) {
        //判断批量删除还是删除
        //是批量删除
        if (row.length > 0) {
          for (let i = 0; i < row.length; i++) {
            arr.push(row[i].id);
          }
        } else {
          this.$message({
            type: 'error',
            message: '请勾选要删除的信息'
          });
        }
      } else {
        //是单行删除
        arr.push(row.id)
      }
      if (arr.length > 0) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {"id": arr.toString()}
          delectMeetExamineData(data).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }

    },
  }
}
</script>
<style scoped>
</style>