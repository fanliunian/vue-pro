<!--部门会议库-->
<template>
  <div class="main_information">
    <!--部门查询-->
    <div class="form_search mb-16 radius_top_none">
      <div class="flex_layout search_info">
        <div class="search_input flex_layout">
          <div class="search_input_info flex_layout">
            <div style="width: 100px">会议名称：</div>
            <el-input placeholder="请输入" v-model="meetName"></el-input>
          </div>
          <!--<div class="search_input_info flex_layout">
            <div style="width: 80px">会议分类：</div>
            <el-select v-model="meetType" placeholder="请选择">
              <el-option v-for="item in classification" :key="item.key" :label="item.text" :value="item.key">
              </el-option>
            </el-select>
          </div>-->
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
        <div class="table_title">会议管理</div>
        <div class="wtsc_title_btn">
          <button type="button" class="btn btn_blue" @click.stop="addmeeting"><span>新增会议</span></button>
        </div>
      </div>
      <div class="form_table">
        <el-table
            :data="tableData"
            stripe
            style="width: 100%;height: 100%"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="会议编号" prop="meetNo"></el-table-column>
          <el-table-column label="会议名称" prop="meetName" min-width="150">
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
          <!--<el-table-column label="会议分类" prop="meetType"></el-table-column>
          <el-table-column label="联系人及其联系方式" prop="contactorInfo" width="150"></el-table-column>-->
          <!--          <el-table-column label="发起部门" prop="createDept"></el-table-column>-->
          <el-table-column label="状态" prop="state" :formatter="Changestate" width="60"></el-table-column>
          <!--          <el-table-column label="发起日期" prop="createTime" :formatter="arrivaltime" sortable>-->
          <!--            <template slot="header" slot-scope="scope">-->
          <!--              <el-tooltip class="item" effect="dark" content="点击排序" placement="top">-->
          <!--                <span>发起日期</span>-->
          <!--              </el-tooltip>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="操作" min-width="130" align="center">
            <template slot-scope="scope">
              <div class="meetingDilogBox">
                <div class="meetingDilogRow">
                  <div class="form_operation" @click="notice(scope.row)">
                    <div title="发送会议通知" class="meetingDilogTitle">
                      <img src="../../../assets/images/icon/notice.png" alt=""/>
                      <div class="meetingDilogName">通知</div>
                    </div>
                  </div>
                  <div class="form_operation" @click="management(scope.row)">
                    <div title="通知管理" class="meetingDilogTitle">
                      <img src="../../../assets/images/icon/notice.png" alt=""/>
                      <div class="meetingDilogName">记录</div>
                    </div>
                  </div>
                 <!-- <div class="form_operation" @click="situation(scope.row)">
                    <div title="参会情况" class="meetingDilogTitle">
                      <img src="../../../assets/images/icon/participate.png" alt=""/>
                      <div class="meetingDilogName">参会</div>
                    </div>
                  </div>-->
                </div>
                <div class="meetingDilogRow">
                  <!--<div class="form_operation" @click="detail(scope.row)">
                    <div title="明细" class="meetingDilogTitle">
                      <img src="../../../assets/images/icon/detail.png" alt=""/>
                      <div class="meetingDilogName">明细</div>
                    </div>
                  </div>-->
                  <div class="form_operation">
                    <template v-if="scope.row.state === '0'">
                      <div title="会议设为已结束" @click="stateChage(scope.row, '1')" class="meetingDilogTitle">
                        <img src="@/assets/images/icon/meetban.png" alt=""/>
                        <div class="meetingDilogName">状态</div>
                      </div>
                    </template>
                    <template v-else>
                      <div title="会议设为未结束" @click="stateChage(scope.row, '0')" class="meetingDilogTitle">
                        <img src="@/assets/images/icon/meetsend.png" alt=""/>
                        <div class="meetingDilogName">状态</div>
                      </div>
                    </template>
                  </div>
                  <div class="form_operation">
                  </div>
                </div>
                <!--              <el-dropdown trigger="click" placement="bottom">-->
                <!--                <div class="el-dropdown-link" style="cursor: pointer">-->
                <!--                  <div class="table_more_icon">-->
                <!--                    <img src="../../../assets/images/icon/more.png" alt=""/>-->
                <!--                  </div>-->
                <!--                </div>-->
                <!--                <el-dropdown-menu slot="dropdown">-->
                <!--                  <div class="form_operation" @click="notice(scope.row)">-->
                <!--                    <div title="发送会议通知" class="meetingDilogTitle">-->
                <!--                      <img src="../../../assets/images/icon/notice.png" alt=""/>-->
                <!--                      <div class="meetingDilogName">发送</div>-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                  <div class="form_operation" @click="management(scope.row)">-->
                <!--                    <div title="通知管理" class="meetingDilogTitle">-->
                <!--                      <img src="../../../assets/images/icon/notice.png" alt=""/>-->
                <!--                      <div class="meetingDilogName">管理</div>-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                  <div class="form_operation" @click="situation(scope.row)">-->
                <!--                    <div title="参会情况" class="meetingDilogTitle">-->
                <!--                      <img src="../../../assets/images/icon/participate.png" alt=""/>-->
                <!--                      <div class="meetingDilogName">情况</div>-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                  <div class="form_operation" @click="detail(scope.row)">-->
                <!--                    <div title="明细" class="meetingDilogTitle">-->
                <!--                      <img src="../../../assets/images/icon/detail.png" alt=""/>-->
                <!--                      <div class="meetingDilogName">明细</div>-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                  <div class="form_operation">-->
                <!--                    <template v-if="scope.row.state === '0'">-->
                <!--                      <div title="会议设为已结束" @click="stateChage(scope.row, '1')" class="meetingDilogTitle">-->
                <!--                        <img src="@/assets/images/icon/meetban.png" alt=""/>-->
                <!--                        <div class="meetingDilogName">状态</div>-->
                <!--                      </div>-->
                <!--                    </template>-->
                <!--                    <template v-else>-->
                <!--                      <div title="会议设为未结束" @click="stateChage(scope.row, '0')" class="meetingDilogTitle">-->
                <!--                        <img src="@/assets/images/icon/meetsend.png" alt=""/>-->
                <!--                        <div class="meetingDilogName">状态</div>-->
                <!--                      </div>-->
                <!--                    </template>-->
                <!--                  </div>-->
                <!--                </el-dropdown-menu>-->
                <!--              </el-dropdown>-->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--部门分页-->
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
    <!--发送会议通知-->
    <el-dialog
        title="会议通知"
        :visible.sync="meeteNotices"
        width="1000px"
        append-to-body
        :close-on-click-modal="false"
    >
      <div class="iframe_info">
        <iframe :src="this.meeteNoticesUrl" frameborder="0" id="notices"></iframe>
      </div>
    </el-dialog>
    <!--发送会议管理-->
    <el-dialog title="会议纪要" :visible.sync="disURL" width="1000px" append-to-body :close-on-click-modal="false">
      <div class="iframe_info iframe_info_btm">
        <iframe :src="this.distributionURL" frameborder="0" id="distributionId"></iframe>
        <div class="text_right iframe_btn">
          <el-button type="primary" @click="distributionBtn">确定</el-button>
          <el-button @click="distributioncl">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--发送会议纪要-->
    <el-dialog title="通知" :visible.sync="notURL" width="1000px" append-to-body :close-on-click-modal="false">
      <div class="iframe_info iframe_info_btm">
        <iframe :src="this.noticetURL" frameborder="0" id="iframeid"></iframe>
        <div class="text_right iframe_btn">
          <el-button type="primary" @click="iframebtn">确定</el-button>
          <el-button @click="closeiframe">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--通知管理-->
    <el-dialog
        title="会议通知管理"
        :visible.sync="manaURL"
        width="1000px"
        append-to-body
        :close-on-click-modal="false"
    >
      <div class="iframe_info">
        <iframe :src="this.managementURL" frameborder="0"></iframe>
      </div>
    </el-dialog>
    <!--参会情况-->
    <el-dialog title="参会情况" :visible.sync="sitURL" width="1000px" append-to-body :close-on-click-modal="false">
      <div class="iframe_info">
        <iframe :src="this.situationtURL" frameborder="0"></iframe>
      </div>
    </el-dialog>
    <!--参会情况-->
    <el-dialog title="共享管理" :visible.sync="shaURL" width="1000px" append-to-body :close-on-click-modal="false">
      <div class="iframe_info">
        <iframe :src="this.sharedURL" frameborder="0"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {dateFormat} from "@/assets/js/public";
import meeteNotices from "../component/meeteNotices";
import {
  changeMeetState,
  getClassificationData,
  getConferenceDepartmentData,
  meetinDoNotice,
  removeMeeting,
  sendMeetNotice,
  sendMinutes,
  getisAttendMan,
  saveMeetSendMsg,
  getMeetSendMsgListJson
} from "@/api/meeting";

export default {
  name: "conferenceDepartment",
  data() {
    return {
      receiveTablePage: 0,//通知公告总页数
      receiveRowsSize: 10,//通知公告条数
      receivePageSize: 1, //通知公告当前页
      tableData: [], //表单数据
      tablePage: 0, //总页数
      pageSize: 1, //当前页
      rowsSize: 10, //条数
      meetName: "", //搜索会议名称
      meetType: "", //搜索会议分类
      classification: [], //分类
      multipleSelection: [], //批量删除
      disURL: false,
      distributionURL: "",
      notURL: false,
      noticetURL: "",
      manaURL: false,
      managementURL: "",
      sitURL: false,
      situationtURL: "",
      shaURL: false,
      sharedURL: "",
      meeteNotices: false,
      meeteNoticesUrl: "",
      meetMsg: false,
      meetMsgData: [],
      noticesData: "",
      checkAll: false,
      isAllattend: {
        meetingInfo: {},
        isAllattendMan: [],
        isAttendMan: []
      },//会议通知
      checkedAllattendMan: [],
      isIndeterminate: false,
      checkAttendManAll: false,
      issueAttendManShow: false,
      checkedAttendMan: [],
      checkedAttendManAll: [],
      //会议下拉框
      meetingModel: [{name: '会议通知', type: '1'},
        {name: '会议时间变更通知', type: '0'},
        {name: '会议信息更正', type: '2'},
        {name: '会议取消通知', type: '4'}],
      meetingModelType: '1',
      textarea: ''
    };
  },
  components: {
    meeteNotices
  },
  created() {
    window.addEventListener('focus', this.getData);
    this.getData();
    // //获取分类
    getClassificationData().then(res => {
      this.classification = res.data.data;
    });
    let _this = this;
    window.addEventListener(
        "message",
        function (event) {
          console.log(event);
          if (event.data.sendmsg.status === "0") {
            _this.$message.success(event.data.sendmsg.msg);
            _this.noticeClose();
          } else {
            _this.$message.success(event.data.sendmsg.msg);
          }
        },
        false
    );
  },
  beforeDestroy() {
    window.removeEventListener('focus', this.getData);
  },
  methods: {
    //获取列表数据
    getData() {
      let data = {
        page: this.pageSize,
        rows: this.rowsSize,
        meetName: this.meetName,
        meetType: this.meetType
      };
      getConferenceDepartmentData(data).then(res => {
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
      // if (this.meetName == "" && this.meetType == "") {
      //   this.$message.error("请填写要查询的信息！！");
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
      this.meetType = "";
      this.getData();
    },
    //时间格式化
    meetingtime(val) {
      if (val.meetTime) {
        return dateFormat(val.meetTime);
      }
    },
    arrivaltime(val) {
      return dateFormat(val.createTime);
    },
    Changestate(val) {
      switch (val.state) {
        case "0":
          return "未结束";
        case "1":
          return "已结束";
        case "2":
          return "未发布";
      }
    },
    //链接跳转
    addmeeting() {
      let url =
          process.env.VUE_APP_MEET +
          "/form/formBus/hyfa/edit?canSave=true&canExport=true&type=MANAGER&parentGridId=grid";
      window.open(url, "_black");
    },
    //发送会议通知
    notice(row) {
      //this.meeteNoticesUrl = process.env.VUE_APP_MEET + "/meeting/meet/meetSendMsg/meetingSendNotice?meetId=" + row.id;
      //location.origin + '/yun/main/meeting/form/meetNotices?meetId=' + row.id
      // + '&authcode=' + this.$route.query.authcode
      this.meeteNoticesUrl = process.env.VUE_APP_MEET + "/meeting/meet/meetSendMsg/meetingSendNotice?meetId=" + row.id;
      this.meeteNotices = true;
    },
    //通知管理
    management(row) {
      this.managementURL = process.env.VUE_APP_MEET + "/meeting/meet/meetSendMsg/meetSendMsgList?meetId=" + row.id;
      this.manaURL = true;
    },
    //参会情况
    situation(row) {
      let url =
          process.env.VUE_APP_MEET +
          "/meeting/meet/meetAttendance/meetAttendanceList?meetId=" +
          row.id +
          "&parentGridId=grid&keyId=" +
          row.id;
      this.situationtURL =
          process.env.VUE_APP_MEET +
          "/meeting/meet/meetAttendance/meetAttendanceList?meetId=" +
          row.id +
          "&parentGridId=grid&keyId=" +
          row.id;
      this.sitURL = true;
    },
    shared(row) {
      let url =
          process.env.VUE_APP_MEET +
          "/meeting/issue/issueShareRecord/issueShareRecordList?issueId=" +
          row.id +
          "&shareType=2";

      this.sharedURL = url;
      this.shaURL = true;
    },
    //明细
    detail(row) {
      let url =
          process.env.VUE_APP_MEET +
          "/form/formBus/hyfa/edit?id=" +
          row.id +
          "&canSave=false&canExport=true&parentGridId=grid&keyId=" +
          row.id;
      window.open(url, "_blank");
    },
    distribution(row) {
      if (row.meetMinutesFileId) {
        this.distributionURL =
            process.env.VUE_APP_MEET + "/meeting/meet/meetSendMsg/meetSendMsgList?meetId=" + row.id;
        this.disURL = true;
      } else {
        this.$message({
          type: "error",
          message: "未上传会议纪要不能分发"
        });
      }
    },
    //会议状态改变
    stateChage(row, number) {
      let title = "";
      switch (number) {
        case "0":
          title = "是否将会议设为未结束";
          break;
        case "1":
          title = "是否将会议设为已结束";
      }

      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            let data = {
              id: row.id,
              state: number
            };
            changeMeetState(data).then(res => {
              if (res.status === 200) {
                if (res.data.code) {
                  this.$message.success("操作成功");
                  this.getData();
                }
              }
            });
          })
          .catch(() => {
            this.$message.info("已取消设置");
          });
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
            type: "error",
            message: "请勾选要删除的信息"
          });
        }
      } else {
        //是单行删除
        arr.push(row.id);
      }
      if (arr.length > 0) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
            .then(() => {
              let data = {id: arr.toString()};
              removeMeeting(data).then(res => {
                console.log(res);
                if (res.status === 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.getData();
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
      }
    },
    //iframe
    iframebtn() {
      let data = document.getElementById("iframeid").contentWindow.getResult();
      meetinDoNotice(data.data).then(res => {
        if (res.status == 200) {
          if (res.data.status == 0) {
            this.$message({
              type: "success",
              message: res.data.data.message
            });
            this.closeiframe();
          } else if (res.data.status == 1) {
            this.$message({
              type: "error",
              message: res.data.data.message
            });
          }
        }
      });
    },
    closeiframe() {
      this.notURL = false;
    },
    //发送会议纪要
    distributionBtn() {
      let data = document.getElementById("distributionId").contentWindow.getResult();
      sendMinutes(data.data).then(res => {
        if (res.status == 200) {
          if (res.data.result == 1) {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.distributioncl();
          } else if (res.data.result == 0) {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        }
      });
    },
    distributioncl() {
      this.disURL = false;
    },
    noticeClose() {
      this.meeteNotices = false;
      this.getData();
    }
  },
  beforeDestory() {
    window.removeEventListener("message");
  }
};
</script>
<style scoped lang="scss">
.form_operation {
  margin: 0 3px;
  font-size: 13px;
  width: 47px;
}

.iframe_info {
  position: relative;
  width: 100%;
  height: 600px;

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .iframe_btn {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  //会议通知
  .meeteNoticesTitle {
    color: #969696;
    font-size: 14px;
  }

  .meeteNoticesSelectBox {
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
  }

  .meetingNoticesTextarea {
    margin-top: 10px;
  }

  .footer_button {
    //position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    //width: 100%;
    background: #FFFFFF;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    padding-bottom: 10px;
  }

  .meetingJoin {
    margin-top: 10px;
    min-height: 190px;

    .title {
      color: #323233;
      font-size: 16px;
      font-weight: bold;
    }

    .check-box {
      margin-top: 10px;
      border: #E6E6E6 1px solid;

      .titleBox {
        display: flex;
        justify-content: space-between;
        padding: 10px;

        .choosed {
          color: #0087FF;
          font-size: 13px;
        }
      }

      .peopleBox {
        padding: 10px 40px;
      }

      .AllattendManBox {
        padding: 0 10px 10px 10px;
      }
    }
  }
}

.iframe_info_btm iframe {
  height: 90%;
}

.table_more_icon {
  height: 41px;
  display: table-cell;
  vertical-align: middle;
}

.ellipsis1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #333333;
}

::v-deep .el-dialog__body {
  overflow-x: auto;
}

.meetingDilogTitle {
  display: flex;
  flex-direction: row;
  line-height: 20px;
  align-items: center;
}

.meetingDilogName {
  margin-left: 5px;
}

::v-deep div.cell {
  height: auto !important;
  min-height: 60px;
  line-height: 60px !important;
}

.meetingDilogBox {
  line-height: 30px;
  white-space: normal;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.meetingDilogRow {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  width: 100%;
  justify-content: center;
}

//::v-deep .el-select-dropdown__item {
//  font-size: 13px;
//}
</style>
