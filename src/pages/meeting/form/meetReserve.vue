<!--会议室预定-->
<template>
  <div class="main_information">
    <!--会议室预定查询-->
    <div class="form_search mb-16 radius_top_none">
      <div class="flex_layout search_info">
        <div class="search_input flex_layout">
          <div class="search_input_info flex_layout">
            <div style="width: 100px">容纳人数：</div>
            <el-input placeholder="请输入" v-model="meetingSize"></el-input>
          </div>
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
    <!--会议预定表格-->
    <div class="form_main border_radius">
      <!--会议日期-->
      <div class="scheduled_title flex_layout">
        <div class="scheduled_icon scheduled_left" @click="weekChoose(weekData.lastWeekStr)"><i
            class="el-icon-arrow-left"></i></div>
        <div class="scheduled_week" @click="weekChoose(weekData.curWeekStr)">回到本周</div>
        <div class="scheduled_time">{{ weekData.curWeekStr }}</div>
        <div class="scheduled_icon scheduled_right" @click="weekChoose(weekData.nextWeekStr)"><i
            class="el-icon-arrow-right"></i></div>
      </div>
      <div class="scheduled_table">
        <div class="calendar_info">
          <!--会议头部-->
          <div class="calendar_top ">
            <section class="schedu-title">会议室</section>
            <section v-for="(item,index) in dateList" :key="index">
              <div>{{ item.weekDay }} <br> {{ item.day }}</div>
            </section>
          </div>
          <!--会议表-->
          <div class="calendar_box">
            <div class="schedu_info" v-for="(item,index) in roomList" :key="'room-'+ index">
              <section class="schedu-title">
                <div class="room_info">
                  <div class="room_title">
                    <div class="buildName">{{ item.meetingName }}</div>
                  </div>
                  <div class="room_table">
                    <div class="room_main">
                      <div class="room_left">容纳人数：</div>
                      <div class="room_right">{{ item.meetingSize }}人</div>
                    </div>
                    <div class="room_main">
                      <div class="room_left">座机：</div>
                      <div class="room_right">{{ item.meetingPhone }}</div>
                    </div>
                    <div class="room_main">
                      <div class="room_left">管理员：</div>
                      <div class="room_right">{{ item.createUsername }}</div>
                    </div>
                    <div class="room_main">
                      <div class="room_left">电话：</div>
                      <div class="room_right">{{ item.adminPhone }}</div>
                    </div>
                  </div>
                </div>
              </section>
              <section v-for="(value, key, index) in item.map" :key="index">
                <div class="scheduled_room">
                  <div class="scheduled_warp">
                    <template v-if="Object.keys(value).length !== 0">
                      <div v-for="(value2, key2, index2) in value" :key="index2"
                           class="scheduled_info">
                        <div v-if="value2.state =='1' " class="audit already">已预定</div>
                        <div v-if="value2.state =='2' " class="audit already">已审核</div>
                        <div v-if="value2.state =='3' " class="audit already">使用中</div>
                        <div>{{ value2.begintime }} - {{ value2.endtime }}</div>
                        <div>预订人： {{ value2.applyusername }}</div>
                      </div>
                    </template>
                    <!--预定按钮-->
                    <div class="scheduled_btn">
                      <div class="scheduled_meet btn_blue" @click="reservation(item)">
                        <i class="el-icon-plus"></i>预定
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--会议预定-->
    <el-dialog title="会议室预定" :visible.sync="scheduled" append-to-body status-icon :fullscreen="true"
               @close="reset('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm"
               label-position="left">
        <el-row :gutter="20">
          <!--部门-->
          <div class="clearfix">
            <el-col :span="8">
              <el-form-item label="预定部门" prop="name">
                <el-input v-model="ruleForm.fOrgname" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="name">
                <el-input v-model="meeting.meetingPhone" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="管理员联系电话" prop="name">
                <el-input v-model="meeting.adminPhone" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预定时间" prop="name">
                <el-input v-model="weekData.curWeekStr" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="会议室" prop="name">
                <el-input v-model="meeting.meetingName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预定人" prop="name">
                <el-input v-model="meeting.createUsername" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="容纳人数" prop="name">
                <el-input v-model="meeting.meetingSize" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <!--时间-->
          <div class="clearfix">
            <el-col :span="8">
              <el-form-item label="参会人数" prop="fSize">
                <el-input v-model="ruleForm.fSize"></el-input>
              </el-form-item>
              <el-form-item label="预定开始时间" prop="fBegintime">
                <el-time-select
                    v-model="ruleForm.fBegintime"
                    placeholder="选择时间"
                    :picker-options="{
                                                start: '08:30',
                                                step: '00:15',
                                                end: '18:30'
                                                }"
                    style="width: 100%">
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预定开始日期" prop="begindate">
                <el-date-picker
                    v-model="ruleForm.begindate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="预定结束时间" prop="fEndtime">
                <el-time-select
                    v-model="ruleForm.fEndtime"
                    placeholder="选择时间"
                    :picker-options="{
                                            start: '08:30',
                                            step: '00:15',
                                            end: '18:30'
                                          }"
                    style="width: 100%">
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预定结束日期" prop="enddate">
                <el-date-picker v-model="ruleForm.enddate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </div>
          <!--用途-->
          <div class="clearfix">
            <el-col :span="24">
              <el-form-item label="预定用途" prop="name">
                <el-input
                    type="textarea"
                    v-model="ruleForm.fContent"
                    :autosize="{ minRows: 3}"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <!--提交-->
        <div class="text_center">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="reset('ruleForm')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getMeetingScheduledData, MeetingisTimeConflict, MeetingRoomById, MeetingApplySave} from '@/api/meeting'

export default {
  data() {
    return {
      dateList: [],//星期
      roomList: [],//会议相关信息（预定安排、名称等）
      weekData: {
        curWeekStr: '',//本周
        lastWeekStr: '',//上周
        nextWeekStr: '',//下周
        weekStr: '',//改变传递的值
      },
      meetingSize: '',//搜索容纳人数
      meetingName: '',//搜索会议室名称
      scheduled: false,//会议预定弹窗
      //会议预定提交数据
      ruleForm: {
        begindate: "",//预定开始日期
        enddate: '',//预定结束日期
        fMeetingid: '',//会议室id
        fBegintime: '',//预定开始时间
        fEndtime: '',//预定结束时间
        fUsername: '',//预定人姓名
        fUserid: '',//预订人ID
        fUsermobile: '',//预定人电话
        fOrgid: '',//部门Id
        fOrgname: '',//部门名称
        fMeetingname: '',//会议室名称
        fContent: '',//预定用途
        applytime: '',//预定时间
        fSize: '',//参会人数
      },
      meeting: [],//会议预定弹窗数据
      //预定校验
      rules: {
        fSize: [{required: true, validator: this.fSizePass, trigger: 'blur'}],
        begindate: [{required: true, validator: this.begindatePass, trigger: 'blur'}],
        enddate: [{required: true, validator: this.enddatePass, trigger: 'blur'}],
        fBegintime: [{required: true, validator: this.fBegintimePass, trigger: 'blur'}],
        fEndtime: [{required: true, validator: this.fEndtimePass, trigger: 'blur'}],
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //获取表格数据
    getData() {
      let data = {
        "date": this.weekData.weekStr,
        "meetingSize": this.meetingSize,
        "meetingName": this.meetingName
      }
      getMeetingScheduledData(data).then(res => {
        this.dateList = res.data.data.dateList;
        this.roomList = res.data.data.roomList;
        this.weekData.lastWeekStr = res.data.data.lastWeekStr;
        this.weekData.nextWeekStr = res.data.data.nextWeekStr;
        this.weekData.curWeekStr = res.data.data.curWeekStr
      })
    },
    //切换上下周
    weekChoose(date) {
      this.weekData.weekStr = date;
      this.getData();
    },
    //搜索
    searchData() {
      // if (this.meetingSize == '' && this.meetingName == '') {
      //    this.$message.error('请填写要查询的信息！！');
      // } else {
      this.getData();
      // }
    },
    //重置
    resetData() {
      this.meetingSize = "";
      this.meetingName = '';
      this.getData();
    },
    //预定按钮
    reservation(item) {
      this.scheduled = true;
      let data = {id: item.id}
      MeetingRoomById(data).then(res => {
        if (res.status === 200) {
          this.ruleForm.fMeetingid = res.data.data.meeting.id;
          this.ruleForm.fUsername = res.data.data.iUser.fullname;
          this.ruleForm.fUserid = res.data.data.iUser.id;
          this.ruleForm.fUsermobile = res.data.data.iUser.mobile;
          this.ruleForm.fOrgid = res.data.data.iGroup.id;
          this.ruleForm.fOrgname = res.data.data.iGroup.name
          this.ruleForm.fMeetingname = res.data.data.meeting.meetingName;
          this.ruleForm.applytime = this.weekData.curWeekStr
          this.meeting = res.data.data.meeting;
        }
      })
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            "beginDate": this.ruleForm.begindate,
            "endDate": this.ruleForm.enddate,
            "meetingId": this.meeting.id,
            "beginTime": this.ruleForm.fBegintime,
            "endTime": this.ruleForm.fEndtime,
          }
          MeetingisTimeConflict(data).then(res => {
            if (res.status == 200) {
              if (!res.data.data) {
                MeetingApplySave(this.ruleForm).then(res => {
                  if (res.status == 200) {
                    this.$message.success('会议预定成功');
                    this.reset('ruleForm');
                    this.getData();
                  }
                })
              } else {
                this.$message.error('会议室预订时间冲突，请查询会议室预订情况后，选择空闲时间预订');
              }
            }
          })
        } else {
          this.$message.warning('请填写必填的内容');
        }
      })
    },
    //取消
    reset(formName) {
      this.scheduled = false
      this.$refs[formName].resetFields();
    },
    //参会人数验证
    fSizePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请填写参会人数'));
      } else {
        if (value > this.meeting.meetingSize) {
          callback(new Error('参会人数不能大于容纳人数'));
        }
        callback();
      }
    },
    //开始日期验证
    begindatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请填写开始日期'));
      } else {
        if (this.ruleForm.enddate !== '') {
          if (value > this.ruleForm.enddate) {
            callback(new Error('开始日期不能大于结束日期'));
          }
          callback();
        }

      }
    },
    //结束日期验证
    enddatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请填写结束日期'));
      } else {
        if (value < this.ruleForm.begindate) {
          callback(new Error('结束日期不能小于开始日期'));
        }
        callback();
      }
    },
    //开始时间验证
    fBegintimePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请填写开始时间'));
      } else {
        if (this.ruleForm.fEndtime !== '') {
          if (value > this.ruleForm.fEndtime) {
            callback(new Error('开始时间不能大于结束时间'));
          }
          callback();
        }

      }
    },
    //结束时间验证
    fEndtimePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请填写结束时间'));
      } else {
        if (value < this.ruleForm.fBegintime) {
          callback(new Error('结束时间不能小于开始时间'));
        }
        callback();
      }
    },
  }
}
</script>
<style scoped>
.scheduled_week {
  width: 83px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-weight: bold;
  background: #e5edff;
  border-radius: 2px;
  color: #3c74d3;
  font-size: 13px;
  margin-right: 23px;
  cursor: pointer;
}

.scheduled_title {
  padding-bottom: 16px;
  justify-content: center;
  position: relative;
}

.scheduled_time {
  font-size: 15px;
  color: #212844;
  font-weight: bold;
}

.scheduled_icon {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #E4E7EC;
  cursor: pointer;
  position: absolute;
  top: 0;
}

.scheduled_left {
  left: 0;
}

.scheduled_right {
  right: 0;
}

.room_title {
  padding: 15px;
}

.buildName, .meetingName {
  height: 20px;
  line-height: 20px;
  text-align: center;
}

.buildName {
  color: #333333;
  font-weight: bold;
  font-size: 16px;
}

.meetingName {
  color: #999999;
}

.scheduled_info {
  padding: 10px;
  background: #fffcf3;
  box-sizing: border-box;
}

.scheduled_info > div {
  font-size: 12px;
  word-break: keep-all;
  padding: 5px 0;
}

.audit {
  height: 30px;
  line-height: 30px;
  font-size: 13px;
}

.already {
  color: #2491fc;
}

.scheduled_btn {
  padding: 10px 0;
  border-top: 1px solid #efefef;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
}

.scheduled_meet {
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 2px;
  margin: 0 auto;
  font-size: 12px;
  cursor: pointer;
}

.scheduled_group {
  width: 78px;
  height: 30px;
  line-height: 30px;
  color: #2491fc;
  margin: 0 auto;
  font-size: 13px;
}

.schedu_info, .calendar_top {
  display: flex;
}

.calendar_top section {
  width: 12.5%;
  text-align: center;
  background: #f3f4f8;
  box-sizing: border-box;
  padding: 15px 0;
  font-size: 13px;
  font-weight: bold;
}

.calendar_top section.schedu-title {
  min-width: 170px;
  height: 60px;
  line-height: 60px;
  padding: 0;
}

.schedu_info section {
  width: 12.5%;
  border: solid #efefef;
  border-width: 0 1px 1px 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
}

.schedu_info section.schedu-title {
  min-width: 170px;
  border-left: 1px solid #efefef;
}

.room_info {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.scheduled_room {
  width: 100%;
  min-height: 200px;
  position: relative;
  padding-bottom: 51px;
}

.room_main {
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-bottom: 1px solid #efefef;
}

.room_main:first-child {
  border-top: 1px solid #efefef;
}

.room_main > div {
  padding: 8px 5px;
  box-sizing: border-box;
  font-size: 12px;
}

.room_left {
  border-right: 1px solid #efefef;
  text-align: right;
  width: 70px;
}

.room_right {
  width: calc(100% - 70px);
  text-align: left;
}
</style>