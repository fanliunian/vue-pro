<template>
  <div class="meetNotices">
    <div style="padding: 0 20px">
      <div class="meeteNoticesTitle">选择通知模板</div>
      <div class="meeteNoticesSelectBox">
        <div>
          <el-select placeholder="请选择" v-model="meetingModelType" @change="selectOption">
            <el-option :label="item.name" :value="item.type" v-for="(item,index) in meetingModel"
                       :key="index"></el-option>
          </el-select>
        </div>
        <div>
          <el-button @click="meetMsgShow()">通知纪录</el-button>
        </div>
      </div>
      <div class="meetingNoticesTextarea">
        <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="textarea"
            maxlength="400"
            show-word-limit>
        </el-input>
      </div>
      <div class="meetingJoin">
        <div class="title">全程参会人员</div>
        <div class="check-box">
          <template>
            <div class="titleBox" style="border-bottom: #E6E6E6 1px solid;">
              <div>
                <el-checkbox @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate"
                >全选
                </el-checkbox>
              </div>
              <div class="choosed">已选（{{ checkedAllattendMan.length }}）</div>
            </div>
            <div class="peopleBox">
              <el-checkbox-group @change="handleCheckedCitiesChange" v-model="checkedAllattendMan">
                <el-checkbox v-for="(item,index) in isAllattend.isAllattendMan"
                             :key="index" :checked="item.checked" @change="handleCheckedCitiesChange(item)"
                             :label="item">
                  {{ item.isAllattendMan }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </div>
      </div>
      <div class="meetingJoin">
        <div class="title">议题参会人员</div>
        <div class="check-box">
          <div class="titleBox">
            <div>
              <el-checkbox @change="handleAttendManAllChange" v-model="checkAttendManAll"
                           :indeterminate="issueAttendManShow">全选
              </el-checkbox>
            </div>
            <div class="choosed">已选（{{ checkedAttendMan.length }}）</div>
          </div>
          <div class="AllattendManBox">
            <el-checkbox-group v-model="checkedAttendMan">
              <el-collapse accordion>
                <el-collapse-item
                    v-for="(item,index) in isAllattend.isAttendMan"
                    :key="index">
                  <template slot="title">
                    <span class="ellipsis1" :title="item.issueName">{{ index + 1 }}、{{ item.issueName }}</span>
                  </template>
                  <el-checkbox :label="item2" v-for="(item2,index2) in item.issueAttendMan"
                               :key="index2" :value="item2" :checked="item2.checked"
                               @change="handleCheckedAttendManChange(item,item2)"
                  >
                    {{ item2.attendMan }}
                  </el-checkbox>
                </el-collapse-item>
              </el-collapse>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="footer_button">
        <el-button type="primary" @click="sendMessage()">发送通知</el-button>
      </div>
    </div>
    <!--    通知纪录-->
    <el-dialog :visible.sync="meetMsg" title="通知纪录" width="800px" append-to-body
               :close-on-click-modal="false">
      <template>
        <el-table
            style="width: 100%;min-height: 300px;padding: 0 20px 20px 20px"
            :data="meetMsgData"
        >
          <el-table-column
              type="index"

          >
          </el-table-column>
          <el-table-column
              label="通知内容"
              width="450px"
          >
            <template slot-scope="scope">
              <span :title="scope.row.receivenote">{{ scope.row.receivenote }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="receiveallattend"
              label="通知人员"
              width="100px"
          >
          </el-table-column>
          <el-table-column
              label="通知时间"
              width="150px"
          >
            <template slot-scope="scope">
              <span>{{ receivetime(scope.row) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="sizes,prev, pager, next"
            :page-size="receiveRowsSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="receiveTablePage"
            :current-page="receivePageSize"
            @size-change="handleReSizeChange"
            @current-change="handleReCurrentChange"
        >
        </el-pagination>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getisAttendMan, getMeetSendMsgListJson, saveMeetSendMsg} from "@/api/meeting";
import {dateFormat} from "@/assets/js/public";

export default {
  name: "meetNotices",
  data() {
    return {
      receiveTablePage: 0,//通知公告总页数
      receiveRowsSize: 10,//通知公告条数
      receivePageSize: 1, //通知公告当前页
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
      textarea: '',
      meetId: ''
    }
  },
  created() {
    this.meetId = this.$route.query.meetId
    this.getData()
  },
  methods: {
    //时间格式化
    receivetime(val) {
      if (val.receivetime) {
        return dateFormat(val.receivetime);
      }
    },
    //下一页
    handleReCurrentChange(val) {
      this.receivePageSize = val;
      this.meetMsgShow();
    },
    //每页显示几条
    handleReSizeChange(val) {
      this.receiveRowsSize = val;
      this.meetMsgShow();
    },
    meetMsgShow() {
      let data = {
        id: this.isAllattend.meetingInfo.id,
        page: this.receivePageSize,
        rows: this.receiveRowsSize
      }
      getMeetSendMsgListJson(data).then(res => {
        if (res.status === 200) {
          this.receiveTablePage = res.data.data.total
          this.meetMsgData = res.data.data.rows

        }
      })
      this.meetMsg = true
    },
    selectOption(val) {
      this.getMeetingNotices(this.isAllattend.meetingInfo.meetName, this.isAllattend.meetingInfo.meetTime, this.isAllattend.meetingInfo.meetLocate, this.isAllattend.meetingInfo.contactorInfo, this.meetingModelType)
    },
    //发送通知
    sendMessage() {
      this.$confirm('是否发送通知', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          temp: {
            noticeTemplate: this.meetingModelType,
            textarea: this.textarea
          },
          isAllattendMan: this.isAllattend.isAllattendMan,
          isAttendMan: this.isAllattend.isAttendMan,
          meetId: this.isAllattend.meetingInfo.id
        }
        saveMeetSendMsg({key: JSON.stringify(data)}).then(res => {
          if (res.data.status === '0') {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }).catch(() => {
        this.$message.info("已取消发送");
      });
    },
    getMeetingNotices(meetName, meetTime, meetLocate, contactorInfo, meetingModelType) {
      if (meetName !== undefined) {
        if (meetingModelType === '1') {
          this.textarea = '会议通知：【' + meetName + '】将于【' + dateFormat(meetTime) + '】在【' + meetLocate + '】进行, 望您准时参加。联系人：【' + contactorInfo + '】'
        } else if (meetingModelType === '0') {
          this.textarea = '会议通知：【很抱歉地通知您，原定于举行的【' + meetName + '】，改为于【' + dateFormat(meetTime) + '】在【' + meetLocate + '】举行，望您准时参加'
        } else if (meetingModelType === '2') {
          this.textarea = '【' + meetName + '】将于【' + dateFormat(meetTime) + '】在【' + meetLocate + '】进行, 望您准时参加。联系人：【' + contactorInfo + '】'
        } else {
          this.textarea = '会议通知取消：原定于【' + dateFormat(meetTime) + '】在【' + meetLocate + '】进行的【' + meetName + '】暂时取消。联系人：【' + contactorInfo + '】'
        }
      }
    },
    //全程参会人员复选框
    handleCheckAllChange(val) {
      if (val) {
        this.isAllattend.isAllattendMan = this.isAllattend.isAllattendMan.map(item => {
          item.checked = true
          return item
        })
        this.checkedAllattendMan = this.isAllattend.isAllattendMan
      } else {
        this.isAllattend.isAllattendMan = this.isAllattend.isAllattendMan.map(item => {
          item.checked = false
          return item
        })
        this.checkedAllattendMan = []
      }
    },
    handleCheckedCitiesChange(value) {
      this.isAllattend.isAllattendMan = this.isAllattend.isAllattendMan.map(item => {
        if (value.isAllattendManId === item.isAllattendManId) {
          item.checked = !item.checked
          return item
        }
        return item
      })
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.isAllattend.isAllattendMan.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.isAllattend.isAllattendMan.length
    },
    //议题参会人员复选框全选
    handleAttendManAllChange(val) {
      if (val) {
        this.isAllattend.isAttendMan = this.isAllattend.isAttendMan.map(item => {
          item.issueAttendMan.map(item2 => {
            item2.checked = true
            return item2
          })
          return item
        })
        this.checkedAttendMan = this.checkedAttendManAll
      } else {
        this.isAllattend.isAttendMan = this.isAllattend.isAttendMan.map(item => {
          item.issueAttendMan.map(item2 => {
            item2.checked = false
            return item2
          })
          return item
        })
        this.checkedAttendMan = []
      }
    },
    //议题参会人员复选框
    handleCheckedAttendManChange(value, value2) {
      this.isAllattend.isAttendMan = this.isAllattend.isAttendMan.map(item => {
        if (item.issueId === value.issueId) {
          item.issueAttendMan.map(item2 => {
            if (item2.attendManId === value2.attendManId) {
              item2.checked = !item2.checked
              return item2
            }
            return item2
          })
          return item
        }
        return item
      })
      // let checkedCount = value.length;
      // this.checkAttendManAll = checkedCount === this.checkedAttendManAll.length;
      // this.issueAttendManShow = checkedCount > 0 && checkedCount < this.checkedAttendManAll.length
    },
    getData() {
      this.checkedAttendMan = []
      this.checkedAllattendMan = []
      this.checkAttendManAll = false
      this.checkAll = false
      let data = {
        id: this.meetId
      }
      getisAttendMan(data).then(res => {
        if (res.status === 200) {
          this.isAllattend = res.data.data;
          this.meetingModelType = res.data.data.meetingInfo.state
          this.getMeetingNotices(res.data.data.meetingInfo.meetName, res.data.data.meetingInfo.meetTime, res.data.data.meetingInfo.meetLocate, res.data.data.meetingInfo.contactorInfo, this.meetingModelType)
          res.data.data.isAttendMan.forEach(item => {
            if (item.issueAttendMan !== undefined) {
              item.issueAttendMan.forEach(item2 => {
                this.checkedAttendManAll.push(item2)
              })
            }

          })
        }
      });
    },
  }
}
</script>

<style scoped>
.meetNotices {
  /*padding: 20px;*/
  background: #FFFFFF;
  min-height: 550px;
}

.ellipsis1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #333333;
}

/*会议通知*/
.meeteNoticesTitle {
  color: #969696;
  font-size: 13px;
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
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  /*width: 100%;*/
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  padding-bottom: 10px;
}

.meetingJoin {
  margin-top: 10px;
  min-height: 100px;
}

.title {
  color: #323233;
  font-size: 16px;
  font-weight: bold;
}

.check-box {
  margin-top: 10px;
  border: #E6E6E6 1px solid;
}

.titleBox {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.AllattendManBox {
  padding: 0 10px 10px 10px;
}

::v-deep .el-checkbox__label {
  font-size: 13px
}

::v-deep .el-textarea__inner {
  font-size: 13px;
}

::v-deep .el-input__inner {
  font-size: 13px;
}

.check-box {
  margin-top: 10px;
  border: #E6E6E6 1px solid;
}

.titleBox {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.choosed {
  color: #0087FF;
  font-size: 13px;
}

.peopleBox {
  padding: 10px 40px;
}

.AllattendManBox {
  padding: 0 10px 10px 10px;
}
</style>