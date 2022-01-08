//预约会议
<template>
  <div class="apply-metting">
    <div class="logo-header">
      <div class="title">会议管理系统</div>
    </div>
    <div class="box">
      <div class="head-title">预约会议</div>
      <div class="apply-content">
        <div class="box-row">
          <div class="row">
            <div class="title">
              <div class="name">
                <span class="sign">*</span>
                会议标题
              </div>
            </div>
            <div class="input" style="width: 400px">
              <el-input
                  placeholder="请输入"
                  size="small"
                  clearable
                  v-model="putData.meetName"
              >
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="title">
              <div class="name"><span class="sign">*</span>
                会议时间
              </div>
            </div>
            <div class="input">
              <span>会议日期：</span>
              <el-date-picker
                  v-model="dataPickerTime"
                  @change="getDataPickTime"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
              >
              </el-date-picker>
              <span class="dataTitle">开始时间：</span>
              <el-time-select
                  placeholder="起始时间"
                  v-model="startTime"
                  @change="pickStartTime"
                  :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '22:30'
    }">
              </el-time-select>
              <span class="dataTitle">结束时间：</span>
              <el-time-select
                  placeholder="结束时间"
                  @change="pickEndTime"
                  v-model="endTime"
                  :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '22:30',
                  minTime: startTime
    }">
              </el-time-select>
            </div>
          </div>
          <div class="row">
            <div class="title">
              <div class="name"><span class="sign">*</span>
                会议室
              </div>
            </div>
            <div class="input">
              <!--              <el-input-->
              <!--                  placeholder="请选择"-->
              <!--                  size="small"-->
              <!--                  clearable-->
              <!--                  :disabled="true"-->
              <!--                  v-model="putData.meetRoom_name"-->
              <!--              >-->
              <!--                <el-button slot="append" @click="openRoomBooking">选择会议室</el-button>-->
              <!--              </el-input>-->
              <span>会议地点：</span>
              <el-cascader :options="roomlayerList"
                           v-model="roomlayer"
                           @change="handleChange">
              </el-cascader>
              <span class="dataTitle">会议室：</span>
              <el-select v-model="meetingRoom" placeholder="请选择">
                <el-option
                    v-for="(item,index) in meetingRoomList"
                    :key="index"
                    :label="item.RoomName"
                    :value="item">
                </el-option>
              </el-select>
              <el-button size="mini" style="margin-left: 20px" type="primary" @click="doMeeting()">预订</el-button>
            </div>
          </div>
          <div class="row">
            <div class="title">
              <div class="name"><span class="sign" v-if="openTable">*</span>
                全程参会人员
              </div>
            </div>
            <div class="input2">
              <div class="input-content">
                <div>
                  <el-tag v-for="(item,index) in allAttendManList" :key="index" closable @close="handleClose(item)"
                          class="tag "
                  >
                    {{ item.fullname }}
                  </el-tag>
                </div>
              </div>
              <div class="add" @click="openUserDiolog()">
                <div><i class="el-icon-plus" style="color: #3fa1ff;margin-right: 3px"></i>
                  <span>选择人员</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="title">
              <div class="name"><span class="sign" v-if="openTable">*</span>
                会议材料
              </div>
            </div>
            <div class="input2">
              <div class="input-content">
                <el-tag v-for="(item,index) in refFilesList" :key="index" closable @close="handleRefClose(item)"
                        class="tag "
                >
                  {{ item.name }}
                </el-tag>
              </div>
              <div class="add" @click="OpenuploadDiolog('metail')">
                <div><i class="el-icon-upload2" style="color: #3fa1ff;margin-right: 3px"></i>
                  <span>添加文件</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="title">
              <div class="name">视频会议</div>
            </div>
            <div class="input">
              <div class="input2">
                <div class="input-content">
                  <el-switch v-model="putData.meetRoom_isVideo"
                             active-value="1"
                             inactive-value="0">
                  </el-switch>
                </div>
                <div class="add" style="border-left:none;width: auto">
                  <div @click="showVideo">
                    <i class="el-icon-arrow-down" v-if="putData.meetRoom_isVideo==='0'"></i>
                    <i class="el-icon-arrow-up" v-else></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template v-if="putData.meetRoom_isVideo==='1'">
            <div class="row2">
              <div class="title">
                <div class="name">视频会议时间</div>
              </div>
              <div class="input">
                <el-date-picker
                    v-model="putData.videoTime"
                    type="datetime"
                    size="small"
                    value-format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="row2">
              <div class="title">
                <div class="name">视频编号</div>
              </div>
              <div class="input">
                <el-input placeholder="请输入" :disabled="true" v-model="putData.videoCode"></el-input>
              </div>
              <div class="title">
                <div class="name">会议密码</div>
              </div>
              <div class="input" style="border-right: none">
                <el-input placeholder="请输入" v-model="putData.passWord" show-password></el-input>
              </div>
            </div>
          </template>
          <div class="row" :style="{borderBottom:openTable?'':'none'}">
            <div class="title">
              <div class="name">无纸化会议</div>
            </div>
            <div class="input2">
              <div class="input-content">
                <el-switch v-model="openTable">
                </el-switch>
              </div>
              <div class="add" style="border-left:none;width: auto">
                <div @click="showDircect">
                  <i class="el-icon-arrow-down" v-if="!openTable"></i>
                  <i class="el-icon-arrow-up" v-else></i>
                </div>
              </div>
            </div>
          </div>
          <div v-if="openTable">
            <div class="row2">
              <div class="title">
                <div class="name">会议分类</div>
              </div>
              <div class="input">
                <el-select placeholder="请选择" v-model="putData.meetType" style="width: 400px">
                  <el-option v-for="(item,index) in meetTypeList" :key="index" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="title">
                <div class="name">会议主持</div>
              </div>
              <div class="input" style="border-right: none">
                <user-selector @confirmHandle="userSelectorHandle" :current="sqr"/>
              </div>
            </div>
            <div class="row3">
              <div class="title">
                <span class="name">议题</span>
              </div>
              <div class="content">
                <div class="table">
                  <div class="header">
                    <div class="table-title">议题名称</div>
                    <div class="table-title">汇报人</div>
                    <div class="table-title">领导意见</div>
                    <div class="table-title">时常（分钟）</div>
                    <div class="table-title" style="border-right: none">操作</div>
                  </div>
                  <div class="content" v-for="(item,index) in applyList" :key="index">
                    <div class="table-title">{{ item.issueName }}</div>
                    <div class="table-title">
                      <div>{{ item.reporterAndRel }}</div>
                    </div>
                    <div class="table-title">
                      <div>{{ item.mainOpinions }}</div>
                    </div>
                    <div class="table-title">
                      <div>
                        {{ item.issueLong }}
                      </div>
                    </div>
                    <div class="table-title" style="border-right: none">
                      <div>
                        <el-button type="danger" size="small">删除</el-button>
                      </div>
                    </div>
                  </div>
                  <div class="button-box">
                    <!--                    <el-button size="small" @click="openAddMetting">新增议题</el-button>-->
                    <el-button size="small" @click="openChooseApply" type="primary">选择议题</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="title">
                <div class="name">会议议程</div>
              </div>
              <div class="input2">
                <el-input
                    type="textarea"
                    placeholder="请输入"
                    :rows="textareaHight"
                    v-model="putData.meetItems"
                >
                </el-input>
              </div>
            </div>

            <div class="row">
              <div class="title">
                <div class="name">议题材料</div>
              </div>
              <div class="input2">
                <div>
                  <div v-for="(item,index) in applyList" :key="index" class="filename">
                              <span>{{ index + 1 }}、{{
                                  item.issueName
                                }}
                              </span>
                    <span v-for="(item2,index2) in JSON.parse(item.refFile)" class="file"
                          @click="fileDownload(item2.id)">
                                <i class="el-icon-download"></i>
                                {{ item2.name }}
                              </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="title">
                <div class="name">议题参会人员</div>
              </div>
              <div class="input2">
                <div>
                  <div v-for="(item,index) in applyList" :key="index" class="filename">
                              <span>{{ index + 1 }}、{{
                                  item.issueName
                                }}
                              </span>
                    <div>
                      <el-tag v-for="(item2,index2) in getAttendArr(item.sugAttendMan)" :key="index2" closable
                              @close="handleAttendClose(item,item2)"
                              class="tag"
                      >
                        {{ item2.name }}
                      </el-tag>
                    </div>
                    <div style="margin-top: 10px">
                      <el-button size="small" type="primary" @click="openUserDiolog(item)">选择</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="title">
                <div class="name">参会部门</div>
              </div>
              <div class="input2">
                <div class="input-content">
                  <el-tag v-for="(item,index) in orgList" :key="index" closable @close="handleOrgClose(item)"
                          class="tag "
                  >
                    {{ item.orgname }}
                  </el-tag>
                </div>
                <div class="add" @click="openDiologOrg()">
                  <div><i class="el-icon-plus" style="color: #3fa1ff;margin-right: 3px"></i>
                    <span>选择部门</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="title">
                <div class="name">有关事项</div>
              </div>
              <div class="input2">
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="putData.refEvent"
                >
                </el-input>
              </div>
            </div>
            <div class="row" style="border-bottom: none">
              <div class="title">
                <div class="name">联系方式</div>
              </div>
              <div class="input2">
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="putData.contactorInfo"
                >
                </el-input>
              </div>
            </div>
            <!--            <div class="row" style="border-bottom: none">-->
            <!--              <div class="title">-->
            <!--                <div class="name">发起部门</div>-->
            <!--              </div>-->
            <!--              <div class="input2">-->
            <!--                <el-input-->
            <!--                    type="textarea"-->
            <!--                    :rows="3"-->
            <!--                    placeholder="请输入"-->
            <!--                    v-model="putData.contactorInfo"-->
            <!--                >-->
            <!--                </el-input>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
      <div class="meeting-text">
        <div class="text-box">
          <div class="header-title">
            <div style="font-weight: bold;width: 100px;text-align: right">会议纪要正文</div>
            <div class="upload" @click="OpenuploadDiolog('content')"><i class="el-icon-upload2"
                                                                        style="color: #3fa1ff;margin-right: 3px"></i>
              <span>上传会议纪要</span></div>
          </div>
          <div class="fileName" v-for="(item,index) in meetMinutesList">{{ item.name }}</div>
        </div>
      </div>
      <div class="submit-box">
        <el-button type="primary" size="small" @click="submitTable">确认提交</el-button>
      </div>
    </div>
    <!--    全程参会人员-->
    <LeaveUserSelector ref="choosePeople" v-if="choosePeopleShow" @confirmHandle="getChoosePeople"
                       :current="LeaveUserList"/>
    <!--    选择议题-->
    <chooseApply ref="chooseApply" v-if="chooseApplyShow" @chooseApply="handleChooseApply"></chooseApply>
    <!--    选择组织-->
    <organizationSelector ref="organizationSelector" v-if="organizationSelectorShow"
                          @confirmHandle="getSelectOrg"></organizationSelector>
    <!--    文件上传-->
    <uploadDiolog ref="uploadDiolog" v-if="uploadDiologShow" :uploadDiologType="uploadDiologType"
                  @uploadHandle="uploadHandle"></uploadDiolog>
    <!--    新增议题-->
    <addMetting ref="addMetting" v-if="addMettingShow"></addMetting>
  </div>
</template>

<script>
import userSelector from "@/components/apply/user-selector";
import LeaveUserSelector from "@/components/apply/leave-user-selector";
import chooseApply from "@/components/apply/chooseApply";
import organizationSelector from '@/components/apply/organization-selector'
import uploadDiolog from "@/components/apply/uploadDiolog";
import addMetting from "@/components/apply/addMetting";
import {
  cancleMeetBooking,
  saveMeetingInfo,
  meetingFilesUpload,
  searchavailableroom,
  roomAccesstoken,
  searchcitybuildingfloorlayer,
  oabooking,
  createVideo
} from "@/api/apply"
import config from "@/request/config";
import store from "@/store";
import DES3 from "@/assets/js/public/3des";
import base64 from "@/assets/js/public/base64";

export default {
  name: "meetApply",
  components: {userSelector, LeaveUserSelector, chooseApply, organizationSelector, uploadDiolog, addMetting},
  data() {
    return {
      startTime: '',
      endTime: '',
      putData: {
        meetName: '',//会议名称
        meetTime: '',//会议开始时间
        meetTimeEnd: '',//会议结束时间
        meetRoom_name: '',//会议室名称
        meetRoom_isVideo: 0,//是否视频会议 1 为是 0 为否
        meetRoom_no: '',//会议室编号
        meetRoom_beginTime: '',//会议室开始占用时间
        meetRoom_endTime: '',//会议室结束占用时间
        meetLocate: '',//会议地点
        meetType: '',//会议类型
        meetHoster: '',//主持人
        meetHosterId: '',//主持人 ID
        issues: '',// 议题
        meetItems: '',//会议议程
        allAttendMan: '',// 全程参会人员
        allAttendManId: '',//全程参会人员 ID
        attendMan: '',//议题参会人员
        attendManId: '',//议题参会人员 ID
        refEvent: '',//有关事项
        contactorInfo: '',//联系人及联系方式
        createDept: '',// 发起部门
        createDeptId: '',//发起部门 ID
        createTime: '2021-05-12 16:20',//发起日期
        remark: '',//说明备注
        state: '',//会议状态（1.已结束 0.未结束 2 未发布）
        meetMinutesFileId: '',//会议纪要
        refFiles: '',//会议材料
        meetRoom_lockTime: 0,//会议室占用时长
        meetBook_code: '',//会议室预订编号
        meetBook_no: '',
        OaBookingId: '',
        passWord: '',
        videoCode: '',
        videoTime: ''
      },
      openTable: false,
      dataPickerTime: '',
      meetTypeList: [
        {
          value: '党委员',
          label: '党委员'
        }, {
          value: '总经理办公会',
          label: '总经理办公会'
        }, {
          value: '专题专项会议',
          label: '专题专项会议'
        }, {
          value: '通用公司会议',
          label: '通用公司会议'
        }
      ],//会议类型下拉框
      sqr: [],//人员选择器值
      choosePeopleShow: false,
      allAttendManList: [],//全程参会人员
      chooseApplyShow: false,//议题选择弹窗
      organizationSelectorShow: false,
      orgList: [],//参会部门
      uploadDiologShow: false,
      uploadDiologType: 1,
      addMettingShow: false,
      applyList: [],//议题数组
      textareaHight: 3,
      refFilesList: [],//会议材料集合
      meetMinutesList: [],//会议纪要集合
      LeaveUserList: [],
      roomPutData: {
        TenantCode: 'Telecom',
        AppCode: 'SmartOffice',
        AccessCode: 'OA',
        AccessSecret: 'Hw5ertJRVOr7rMhTzwM75ihGp3v7SAW8'
      },
      roomlayerList: [],
      roomlayer: [],
      meetingRoom: '',
      meetingRoomList: [],
      username: this.$store.state.admin.username,
      OaBookingRoom: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      roomAccesstoken(this.roomPutData).then(res => {
        if (res.data.code === '0') {
          this.$store.commit('admin/MEETING_TOKEN', {token: res.data.result})
          this.getMeetingRoom()
        }
      })
    },
    getMeetingRoom() {
      let data = {
        UserId: this.username
      }
      searchcitybuildingfloorlayer(data).then(res => {
        if (res.data.code === '0') {
          this.roomlayerList = res.data.result.map(item => {
            item.value = item.CityCode
            item.label = item.CityName
            if (item.HasRoom === 'N') {
              item.disabled = true
            }
            if (item.Buildings.length !== 0) {
              item.children = item.Buildings.map(item2 => {
                item2.value = item2.BuildingCode
                item2.label = item2.BuildingName
                if (item2.HasRoom === 'N') {
                  item2.disabled = true
                }
                item2.children = item2.Floors.map(item3 => {
                  item3.value = item3.FloorNumber
                  item3.label = item3.FloorNumber + '层'
                  if (item3.HasRoom === 'N') {
                    item3.disabled = true
                  }
                  return item3
                })
                return item2
              })
            } else {
              item.children = []
            }
            return item
          })
        }
      })
    },
// 提交表单方法
    submitTable() {
      if (this.putData.meetName === '') {
        this.$message.warning('请先输入会议标题')
        return false
      }
      if (this.dataPickerTime === '') {
        this.$message.warning('请先选择会议日期')
        return false
      }
      if (this.startTime === '') {
        this.$message.warning('请先选择会议开始时间')
        return false
      }
      if (this.endTime === '') {
        this.$message.warning('请先选择会议结束时间')
        return false
      }
      if (!this.OaBookingRoom.RoomName) {
        this.$message.warning('请先预订会议室')
        return false
      } else {
        this.putData.meetRoom_name = this.OaBookingRoom.RoomName
        this.putData.meetBook_code = this.OaBookingRoom.OaBookingId
        this.putData.meetRoom_no = this.OaBookingRoom.RoomCode
        this.putData.OaBookingId = this.OaBookingRoom.OaBookingId
        this.putData.meetRoom_lockTime = this.OaBookingRoom.OA_RoomLockedTimeout
      }
      if (this.openTable) {
        if (this.allAttendManList.length === 0) {
          this.$message.warning('请选择全程参会人员')
          return false
        }
        if (this.refFilesList.length === 0) {
          this.$message.warning('请上传会议材料')
          return false
        }
      }
      if (((new Date() - new Date(this.putData.createTime)) / (1000 * 60)) > this.putData.meetRoom_lockTime) {
        this.$message.warning('会议室占用时间过长，请重新选择会议室')
      }
      // if (this.putData.meetRoom_isVideo === '1') {
      //   var key = "GT67UBOP820YH779U1XIF59C";
      //   let userInfo = {
      //     userInfo: this.allAttendManList,
      //     count: this.allAttendManList.length
      //   }
      //   let meetVideo = {
      //     content: this.putData.meetName,
      //     userId: this.username,
      //     meetPassword: this.putData.passWord,
      //     orderTime: this.putData.videoTime,
      //     topic: 3,
      //     type: 2,
      //     addressUserInfo: base64.base64encode(DES3.encrypt(key, JSON.stringify(userInfo))),
      //     userName: ''
      //   }
      //   createVideo(meetVideo).then(res => {
      //     console.log(res)
      //   })
      // }
      this.putData.meetTime = this.dataPickerTime + ' ' + this.startTime
      this.putData.meetTimeEnd = this.dataPickerTime + ' ' + this.endTime
      //参会部门
      let createDept = '' //发起部门
      let createDeptId = ''//发起部门id
      this.orgList.forEach((item, index) => {
        if (this.orgList.length === index + 1) {
          createDept = createDept.concat(item.orgname)
          createDeptId = createDeptId.concat(item.id)
        } else {
          createDept = createDept.concat(item.orgname, ',')
          createDeptId = createDeptId.concat(item.id, ',')
        }
      })
      //全程参会人员
      let allAttendMan = '' //全程参会人员
      let allAttendManId = ''//全程参会人员id
      this.allAttendManList.forEach((item, index) => {
            if (this.allAttendManList.length === index + 1) {
              allAttendMan = createDept.concat(item.orgname)
              allAttendManId = createDeptId.concat(item.id)
            } else {
              this.putData.allAttendMan = createDept.concat(item.orgname, ',')
              this.putData.allAttendManId = createDeptId.concat(item.id, ',')
            }
          }
      )

      if (this.LeaveUserList.length != 0) {
        this.putData.refFilesList = JSON.stringify(this.LeaveUserList)
      }
      this.putData.allAttendMan = allAttendMan
      this.putData.allAttendManId = allAttendManId
      this.putData.createDept = createDept
      this.putData.createDeptId = createDeptId
      if (this.sqr.length !== 0) {
        this.putData.meetHoster = this.sqr[0].fullname
        this.putData.meetHosterId = this.sqr[0].id
      }
      this.putData.refFiles = JSON.stringify(this.refFilesList)
      this.putData.meetMinutesFileId = JSON.stringify(this.meetMinutesList)
      this.putData.issues = JSON.stringify(this.applyList)
      saveMeetingInfo(this.putData).then(res => {
        console.log(res.data)
        if (res.data.status === '0') {
          this.$message.success('预定成功')
          setTimeout(function () {
            window.opener = null;
            window.open("about:blank", "_top").close()
          }, 4000);
        } else {
          this.$message.error(res.data.msg)
        }
      })
      console.log(this.putData)
    }
    ,
    getDataPickTime(time) {
      this.roomlayer = []
      this.meetingRoom = ''
      this.startTime = ''
      this.endTime = ''
    }
    ,
    pickStartTime(time) {
      this.roomlayer = []
      this.meetingRoom = ''
      this.endTime = ''
      let data1 = this.dataPickerTime + ' ' + time
      if (new Date() - new Date(data1) > 0) {
        this.$message.warning('会议开始时间不能小于当前时间')
        this.startTime = ''
      }
    },
    pickEndTime(time) {
      this.roomlayer = []
      this.meetingRoom = ''
    },
    userSelectorHandle(list) {
      this.sqr = list;
    }
    ,
    openUserDiolog(item) {
      this.choosePeopleShow = true
      this.$nextTick(() => {
        if (item) {
          this.$refs.choosePeople.appalyId = item.id
          this.$refs.choosePeople.appalyName = item.issueName
          if (item.sugAttendMan === '') {
            this.LeaveUserList = []
          } else {
            let arr = JSON.parse(item.sugAttendMan)
            arr = arr.map(item => {
              item.fullname = item.name
              return item
            })
            this.LeaveUserList = arr
          }
        } else {
          this.LeaveUserList = this.allAttendManList
        }
        this.$refs.choosePeople.dialogOpen();
      })
    }
    ,
    getChoosePeople(obj) {
      if (obj.appalyId === '') {
        this.allAttendManList = obj.selectList
        this.choosePeopleShow = false
      } else {
        this.applyList = this.applyList.map(item => {
          if (item.id === obj.appalyId) {
            item.sugAttendMan = JSON.stringify(obj.selectList)
            return item
          }
          return item
        })
        this.choosePeopleShow = false
      }
    }
    ,
    handleClose(val) {
      this.allAttendManList = this.allAttendManList.filter(item => {
        if (item.id === val.id) {
          return false
        } else {
          return true
        }
      })
    }
    ,
    openChooseApply() {
      this.chooseApplyShow = true
      this.$nextTick(() => {
        this.$refs.chooseApply.onLoad()
      })
    }
    ,
    openDiologOrg() {
      this.organizationSelectorShow = true
      this.$nextTick(() => {
        this.$refs.organizationSelector.dialogOpen()
      })
    }
    ,
    getSelectOrg(list) {
      this.orgList = list
    }
    ,
    handleOrgClose(val) {
      this.orgList = this.orgList.filter(item => {
        if (item.id === val.id) {
          return false
        } else {
          return true
        }
      })
    }
    ,
    OpenuploadDiolog(val) {
      this.uploadDiologShow = true
      this.$nextTick(() => {
        this.$refs.uploadDiolog.type = val
        this.$refs.uploadDiolog.onLoad()
      })
    }
    ,
    openAddMetting() {
      this.addMettingShow = true
      this.$nextTick(() => {
        this.$refs.addMetting.onLoad()
      })
    }
    ,
    handleChooseApply(arr) {
      this.applyList = this.applyList.concat(arr)
      this.textareaHight = 12
      const s = '\n1.超文书同志汇报（5分钟）\n' +
          '2.讨论发言\n' +
          '3.请领导讲话'
      let content = ''
      this.applyList.forEach((item, index) => {
            if (content === '') {
              content = content + this.numberChange(index + 1) + item.issueName + s
            } else {
              content = content + '\n' + this.numberChange(index + 1) + item.issueName + s
            }
          }
      )
      this.putData.meetItems = content
    }
    ,
    numberChange(number) {
      let s = ''
      switch (number) {
        case 1:
          s = '一'
          break;
        case 2:
          s = '二'
          break;
        case 3:
          s = '三'
          break;
        case 4:
          s = '四'
          break;
        case 5:
          s = '五'
          break;
        case 6:
          s = '六'
          break;
        case 7:
          s = '七'
          break;
        case 8:
          s = '八'
          break;
        case 9:
          s = '九'
          break;
        case 10:
          s = '十'
          break;
        case 11:
          s = '十一'
          break;

      }
      return '(' + s + ') '
    }
    ,
    fileDownload(id) {
      window.location.href = config.baseBase + '/meetingService/meet/meetingFilesUpload?id=' + id
    }
    ,
    uploadHandle(file) {
      if (file.fileType === 'metail') {
        this.refFilesList = this.refFilesList.concat(file.filesList)
      } else {
        this.meetMinutesList = this.meetMinutesList.concat(file.filesList)
      }
    }
    ,
    handleRefClose(item) {
      this.refFilesList = this.refFilesList.filter(item2 => {
            if (item2.id === item.id) {
              return false
            }
            return true
          }
      )
    }
    ,
    showDircect() {
      this.openTable = !this.openTable
    }
    ,
    getAttendArr(attendMan) {
      let arr = []
      if (attendMan !== '') {
        arr = JSON.parse(attendMan)
      }
      // console.log(arr)
      return arr
    }
    ,
    handleAttendClose(attend, str) {
      this.applyList = this.applyList.map(item => {
        let s = ''
        if (item.id === attend.id) {
          s = JSON.stringify(
              JSON.parse(item.sugAttendMan).filter(item2 => {
                if (item2.id == str.id) {
                  return false
                }
                return true
              })
          )
          item.sugAttendMan = s
          return item
        }
        return item
      })
    }
    ,
    showVideo() {
      if (this.putData.meetRoom_isVideo === '0') {
        this.putData.meetRoom_isVideo = '1'
      } else {
        this.putData.meetRoom_isVideo = '0'
      }
    }
    ,
    handleChange(value) {
      if (this.dataPickerTime === '') {
        this.$message.warning('请先选择会议日期')
        this.roomlayer = []
        this.meetingRoom = ''
        return false
      }
      if (this.startTime === '') {
        this.$message.warning('请先选择会议开始时间')
        this.roomlayer = []
        this.meetingRoom = ''
        return false
      }
      if (this.endTime === '') {
        this.$message.warning('请先选择会议结束时间')
        this.roomlayer = []
        this.meetingRoom = ''
        return false
      }
      let data = {
        CityCode: value[0],
        BuildingCode: value[1],
        Floor: value[2],
        BookDate: this.dataPickerTime,
        StartTime: this.startTime,
        EndTime: this.endTime,
        AvailableFlag: true,
        UserId: this.username
      }
      this.meetingRoom = ''
      searchavailableroom(data).then(res => {
        if (res.data.code === '0') {
          this.meetingRoomList = res.data.result
        }
      })
    }
    ,
    doMeeting() {
      if (this.putData.meetName === '') {
        this.$message.warning('请先输入会议室标题')
        return false
      }
      if (!this.meetingRoom.RoomCode) {
        this.$message.warning('请先选择会议室')
        return false
      }
      let data = {
        Title: this.putData.meetName,
        RoomCode: this.meetingRoom.RoomCode,
        BookDate: this.dataPickerTime,
        StartTime: this.startTime,
        EndTime: this.endTime,
        OrganizerCode: this.username,
        OaBookingId: this.putData.OaBookingId
      }
      oabooking(data).then(res => {
        if (res.data.code === '0') {
          this.OaBookingRoom = res.data.result
          this.putData.createTime = this.getTime()
          this.$message.success('预订成功')
        } else {
          this.$message.warning(res.data.desc)
        }
      })
    },
    getTime() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes();
      return currentdate;
    },
  }
}
</script>

<style lang="scss" scoped>
.apply-metting {
  font-size: 14px;
  color: #000000;
  /*margin-top: 20px;*/
  font-weight: 500;
  width: 1200px;
  margin: auto;
}

.apply-metting .logo-header {
  background: url(/yun/assets/img/xabglogo.50a2a485.png);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  padding-left: 40px;
  height: 90px;
  line-height: 90px;
  background-size: 100% 100%;
}

.apply-metting .logo-header .title {
  font-size: 30px;
  color: #FFFFFF;
}

.apply-metting .box {
  background: #FFFFFF;
  margin-top: 110px;
}

.apply-metting .box .head-title {
  padding: 10px 20px;
  border-bottom: 1px solid #E5E5E5;
  font-weight: bold;
  font-size: 15px;
}

.apply-metting .box .apply-content {
  padding: 20px;
}


.apply-metting .box .apply-content .box-row {
  border: 1px solid #E5E5E5;
  width: 100%;
  /*height: 600px;*/
}

.apply-metting .box .apply-content .box-row .row {
  border-bottom: 1px solid #E5E5E5;
  min-height: 50px;
  /*line-height: 50px;*/
  display: flex;
  flex-direction: row;
}

.apply-metting .box .apply-content .box-row .row .title {
  border-right: 1px solid #E5E5E5;
  width: 150px;
  text-align: center;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.apply-metting .box .apply-content .box-row .row .input2 {
  display: flex;
  align-items: center;
  width: 995px;
}

.apply-metting .box .apply-content .box-row .row .input2 .filename {
  padding: 10px 0 5px 0;
  line-height: 20px;
}

.apply-metting .box .apply-content .box-row .row .input2 .filename .tag {
  margin: 5px 10px 5px 5px;
}

.apply-metting .box .apply-content .box-row .row .input2 .file {
  margin-left: 5px;
  color: #3fa1ff;
}

.apply-metting .box .apply-content .box-row .row .input2 .file:hover {
  cursor: pointer;
}

.apply-metting .box .apply-content .box-row .row .input {
  display: flex;
  align-items: center;
  //width: 400px;
}

.apply-metting .box .apply-content .box-row .row .input2 .input-content {
  width: 995px;
}

.apply-metting .box .apply-content .box-row .row .input2 .input-content .tag {
  margin: 5px 10px 5px 5px;
  /*width: 70px;*/
}

.apply-metting .box .apply-content .box-row .row .input2 .add {
  padding: 0 10px;
  display: flex;
  border-left: 1px solid #E5E5E5;
  height: 100%;
  width: 10%;
  margin: auto;
  align-items: center;
  justify-content: center;
  cursor: pointer
}

.apply-metting .box .apply-content .box-row .row .title .name {
  padding: 0 10px;
  /*margin: auto;*/
  text-align: center;
  width: 100%;
  font-weight: bold;
}

.apply-metting .box .apply-content .box-row .row2 {
  border-bottom: 1px solid #E5E5E5;
  min-height: 50px;
  /*line-height: 50px;*/
  display: flex;
  flex-direction: row;
}

.apply-metting .box .apply-content .box-row .row2 .title {
  border-right: 1px solid #E5E5E5;
  width: 150px;
  text-align: center;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.apply-metting .box .apply-content .box-row .row2 .input {
  border-right: 1px solid #E5E5E5;
  /*padding-right: 10px;*/
  padding: 10px 10px 10px 0;
  width: 400px;
}

.apply-metting .box .apply-content .box-row .row2 .name {
  padding: 0 10px;
  /*margin: auto;*/
  text-align: center;
  width: 100%;
  font-weight: bold;
}

.apply-metting .box .apply-content .box-row .row3 {
  border-bottom: 1px solid #E5E5E5;
  min-height: 50px;
  /*line-height: 50px;*/
  display: flex;
  flex-direction: row;
}

.apply-metting .box .apply-content .box-row .row3 .name {
  padding: 0 10px;
  /*margin: auto;*/
  text-align: center;
  width: 100%;
  font-weight: bold;
}

.apply-metting .box .apply-content .box-row .row3 .title {
  border-right: 1px solid #E5E5E5;
  width: 150px;
  text-align: center;
  /*margin-right: 10px;*/
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.apply-metting .box .apply-content .box-row .row3 .content {
  width: 1009px;
}

.apply-metting .box .apply-content .box-row .row3 .content .table {

}

.apply-metting .box .apply-content .box-row .row3 .content .table .button-box {
  padding: 10px;
  text-align: right;
}

.apply-metting .box .apply-content .box-row .row3 .content .table .header {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #E5E5E5;
}

.apply-metting .box .apply-content .box-row .row3 .content .table .content {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #E5E5E5;
  width: 100%;
}

.apply-metting .box .apply-content .box-row .row3 .content .table .content .table-title {
  width: 20%;
  border-right: 1px solid #E5E5E5;
  text-align: center;
  background: #FFFFFF;
  /*line-height: 50px;*/
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apply-metting .box .apply-content .box-row .row3 .content .table .header .table-title {
  width: 20%;
  border-right: 1px solid #E5E5E5;
  text-align: center;
  background: #f5f7fa;
  line-height: 50px;
}

.apply-metting .box .meeting-text {
  padding: 0 20px 20px 20px;
}

.apply-metting .box .meeting-text .text-box {
  border: 1px solid #E5E5E5;
  padding: 15px;
}

.apply-metting .box .meeting-text .text-box .header-title {
  display: flex;
  justify-content: space-between;
}

.apply-metting .box .meeting-text .text-box .fileName {
  padding-top: 10px;
}

.apply-metting .box .meeting-text .text-box .upload {
  cursor: pointer;
  color: #3fa1ff;
}

.apply-metting .box .submit-box {
  padding-bottom: 50px;
  text-align: center;
}

::v-deep .el-textarea__inner {
  border-color: #FFFFFF;
}

.iframe_info {
  width: 100%;
  height: calc(100vh - 72px);
  position: relative;

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 0;
  }
}

.sign {
  color: #DC143C
}

.dataTitle {
  margin-left: 20px;
  width: 70px;
  text-align: right;
}
</style>