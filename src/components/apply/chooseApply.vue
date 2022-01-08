<template>
  <div>
    <el-dialog
        title="选择议题"
        :visible.sync="dialogVisible"
        width="1100px"
        :before-close="handleClose">
      <div class="choose-apply">
        <div class="search-box">
          <div>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="inout-row">
                  <div> 议题名称：</div>
                  <div>
                    <el-input size="small" placeholder="请输入" v-model="putData.issueName"></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="inout-row">
                  <div> 汇报人：</div>
                  <div>
                    <el-input size="small" placeholder="请输入" v-model="putData.reporterAndRel"></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="search_btn">
                  <el-button size="small" type="primary" @click="search"><span>查询</span></el-button>
                  <el-button size="small" @click="reset"><span>重置</span></el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="content-box">
          <div class="table">
            <el-table style="width: 100%"
                      ref="multipleTable"
                      tooltip-effect="dark"
                      @selection-change="handleSelectionChange"
                      :data="tableData"
                      stripe
            >
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
              <el-table-column
                  label="议题编号"
                  prop="issueNum"
                  width="200"
              >
              </el-table-column>
              <el-table-column
                  label="议题名称"

              >
                <template slot-scope="scope">
                  <span :title="scope.row.issueName">{{ scope.row.issueName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                  label="汇报人及职务"
                  prop="reporterAndRel"
                  width="120"
              >
              </el-table-column>
              <el-table-column
                  label="添加时间"
                  width="200"
              >
                <template slot-scope="scope">
                  <span>{{ formatTime("YYYY-mm-dd HH:MM", scope.row.createTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="pageTotal">
            </el-pagination>
          </div>
        </div>
        <div class="footer-button">
          <div class="button-box">
            <el-button size="mini" type="primary" @click="handleOk">确定</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getIssuesList} from '@/api/apply'

export default {
  name: "chooseApply",
  data() {
    return {
      dialogVisible: false,
      currentPage: 1,
      pageTotal: 0,
      pageSize: 10,
      tableData: [],
      putData: {
        reporterAndRel: '',
        issueName: ''
      },
      selectRow: []
    }
  }, methods: {
    onLoad() {
      this.dialogVisible = true
      this.getData()
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSelectionChange(arr) {
      this.selectRow = arr
    },
    handleSizeChange() {
    },
    handleCurrentChange(val) {
      this.getData()
    },
    getData() {
      const data = {
        page: this.currentPage,
        rows: this.pageSize,
        reporterAndRel: this.reporterAndRel,
        issueName: this.issueName
      }
      getIssuesList(data).then(res => {
        if (res.data.status === '0') {
          this.tableData = res.data.data.records
          this.pageTotal = res.data.data.total
        }
      })
    },
    search() {
      this.getData()
    },
    reset() {
      this.putData.reporterAndRel = ''
      this.putData.issueName = ''
      this.currentPage = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    formatTime(fmt, time) {
      const date = new Date(time)
      let ret
      const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
        ;
      }
      ;
      return fmt;
    },
    handleOk() {
      this.$emit('chooseApply', this.selectRow)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.choose-apply {
  font-size: 13px;
  /*height: 500px;*/
  overflow: auto;
}

.choose-apply .content-box {
  width: 100%;
  margin-top: 20px;
}

.choose-apply .content-box .pagination {
  /*text-align: right;*/
  margin-top: 20px;
  padding-bottom: 20px;
}

.choose-apply .search-box {
}

.choose-apply .search-box .search_btn {
  text-align: right;
}

.choose-apply .search-box .inout-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.choose-apply .footer-button {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  background: #fafafa;
}

.choose-apply .footer-button .button-box {
  padding: 10px 20px 10px 5px;
  text-align: right;
}
</style>