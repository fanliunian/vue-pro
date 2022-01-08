<!--部门议题库-->
<template>
  <div class="main_information">
    <!--部门查询-->
    <div class="form_search mb-16 radius_top_none">
      <div class="flex_layout search_info">
        <div class="search_input flex_layout">
          <div class="search_input_info flex_layout">
            <div style="width: 100px">议题编号：</div>
            <el-input placeholder="请输入" v-model="issueNum"></el-input>
          </div>
          <div class="search_input_info flex_layout">
            <div style="width: 100px">议题名称：</div>
            <el-input placeholder="请输入" v-model="issueName"></el-input>
          </div>
        </div>
        <div class="search_btn">
          <button type="button" class="btn btn_blue" @click="searchData"><span>查询</span></button>
          <button type="button" class="btn btn_wathet" @click="resetData"><span>重置</span></button>
        </div>
      </div>
    </div>
    <!--部门表格-->
    <div class="form_main border_radius">
      <div class="form_table_title pb-16 flex_layout flex_between">
        <div class="table_title">议题管理</div>
        <div class="wtsc_title_btn">
          <button type="button" class="btn btn_blue" @click="addmeeting"><span>新增</span></button>
          <button type="button" class="btn btn_wathet" @click="delect(multipleSelection)"><span>批量删除</span>
          </button>
        </div>
      </div>
      <div class="form_table">
        <el-table :data="tableData" stripe style="width: 100%;height: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="议题编号" prop="issueNum"></el-table-column>
          <el-table-column label="议题名称" prop="issueName" min-width="150">
            <template slot-scope="scope">
              <div class="form_title_color form_limit" :title="scope.row.issueName" @click="detail(scope.row)">
                {{ scope.row.issueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="汇报人及职务" prop="reporterAndRel"></el-table-column>
          <el-table-column label="列席领导或部门" prop="presentMember"></el-table-column>
          <el-table-column label="添加时间" prop="createTime" :formatter="meetingtime" sortable>
            <template slot="header" slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="点击排序" placement="top">
                <span>添加时间</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="updateTime" :formatter="arrivaltime" sortable>
            <template slot="header" slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="点击排序" placement="top">
                <span>更新时间</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <div class="form_operation">
                <div title="编辑" @click="editor(scope.row)">
                  <img src="../../../assets/images/icon/edit.png" alt="">
                </div>
              </div>
              <div class="form_operation">
                <div title="明细" @click="detail(scope.row)">
                  <img src="../../../assets/images/icon/detail.png" alt="">
                </div>
              </div>
              <div class="form_operation">
                <div title="删除" @click="delect(scope.row)">
                  <img src="../../../assets/images/icon/delete.png" alt="">
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--部门分页-->
      <div class="form_page">
        <el-pagination background layout="sizes,prev, pager, next"
                       :page-size="this.rowsSize" :page-sizes="[10, 20, 30, 40]" :total="tablePage"
                       :current-page="pageSize"
                       @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <!--弹窗-->
    <el-dialog title="议题库共享记录管理" :visible.sync="openURL" width="1000px" append-to-body :close-on-click-modal='false'>
      <div class="iframe_info">
        <iframe :src=this.meetURL frameborder="0"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {dateFormat} from '@/assets/js/public'
import {getIssueDepartmentData, delectIssueData} from '@/api/meeting'

export default {
  name: "issueUnit",
  data() {
    return {
      tableData: [],//表单数据
      tablePage: 0, //总页数
      pageSize: 1, //当前页
      rowsSize: 10, //条数
      issueNum: "", //搜索议题编号
      issueName: '',//搜索议题名称
      multipleSelection: [],//批量删除
      openURL: false,
      meetURL: '',
    }
  },
  created() {
    window.addEventListener('focus', this.getData);
    this.getData()
  },
  beforeDestroy() {
    window.removeEventListener('focus', this.getData);
  },
  methods: {
    //获取列表数据
    getData() {
      let data = {
        "page": this.pageSize,
        "rows": this.rowsSize,
        "issueNum": this.issueNum,
        "issueName": this.issueName
      }
      getIssueDepartmentData(data).then(res => {
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
      // if (this.issueNum == '' && this.issueName == '') {
      //   this.$message.error('请填写要查询的信息！！');
      // } else {
      this.pageSize = 1
      this.getData();
      // }
    },
    //重置
    resetData() {
      this.pageSize = 1;
      this.rowsSize = 10;
      this.issueNum = "";
      this.issueName = '';
      this.getData();
    },
    //时间格式化
    meetingtime(val) {
      return dateFormat(val.createTime);
    },
    arrivaltime(val) {
      return dateFormat(val.updateTime);
    },
    //链接跳转
    addmeeting() {
      let url = process.env.VUE_APP_MEET + '/form/formBus/yt/edit?parentGridId=grid'
      window.open(url, "_blank");
    },
    editor(row) {
      let url = process.env.VUE_APP_MEET + '/form/formBus/yt/edit?id=' + row.id + '&parentGridId=grid&keyId=' + row.id
      window.open(url, "_blank");
    },
    shared(row) {
      let url = process.env.VUE_APP_MEET + '/meeting/issue/issueShareRecord/issueShareRecordList?issueId=' + row.id + '&shareType=1'
      this.meetURL = url;
      this.openURL = true;
    },
    detail(row) {
      let url = process.env.VUE_APP_MEET + '/form/formBus/yt/get?id=' + row.id + '&parentGridId=grid&keyId=' + row.id
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
          delectIssueData(data).then(res => {
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