<template>
   <div class="notice_info">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" label-position="top">
         <el-row :gutter="20">
            <el-col :span="24">
               <el-form-item>
                  <div class="flex_layout flex_between">
                     <el-checkbox v-model="notice" disabled>短信通知</el-checkbox>
                     <el-button type="primary">通知记录</el-button>
                  </div>
               </el-form-item>
            </el-col>
            <el-col :span="24">
               <el-form-item>
                  <el-radio-group v-model="ruleForm.temp.noticeTemplate" @change="radioChange">
                     <el-radio :label="1">会议通知模版</el-radio>
                     <el-radio :label="2">会议时间变更通知模版</el-radio>
                     <el-radio :label="3">会议信息更正</el-radio>
                     <el-radio :label="4">会议取消通知</el-radio>
                  </el-radio-group>
               </el-form-item>
               <el-form-item>
                  <el-input
                     v-model="ruleForm.temp.textarea"
                     type="textarea"
                     :autosize="{ minRows: 4 }"
                     placeholder="请输入内容"
                     maxlength="150"
                     show-word-limit
                  />
               </el-form-item>
            </el-col>
            <el-col :span="24">
               <el-form-item>
                  <el-checkbox
                     :indeterminate="allattend.indeterminate"
                     v-model="allattend.checkAll"
                     @change="handleCheckAll"
                  >
                     全程参会人员：
                  </el-checkbox>
                  <el-checkbox-group v-model="allattend.checked" @change="handleChecked">
                     <el-checkbox
                        v-for="allattend in ruleForm.isAllattendMan"
                        :key="allattend.isAllattendManId"
                        :label="allattend.isAllattendManId"
                     >
                        {{ allattend.isAllattendMan }}
                     </el-checkbox>
                  </el-checkbox-group>
               </el-form-item>
            </el-col>
            <el-col :span="24">
               <el-form-item>
                  <el-checkbox :indeterminate="attend.indeterminate" v-model="attend.checkAll" @change="attendCheckAll">
                     议题参会人员：
                  </el-checkbox>
                  <div v-for="(isAtten, index) in ruleForm.isAttendMan" :key="isAtten.issueAttendManId">
                     <div>{{ index + 1 }}.{{ isAtten.issueName }}</div>
                     <el-checkbox-group v-model="attend.checked" @change="attendChecked">
                        <el-checkbox
                           v-for="item in isAtten.issueAttendMan"
                           :key="item.attendManId"
                           :label="item.attendManId"
                        >
                           {{ item.attendMan }}
                        </el-checkbox>
                     </el-checkbox-group>
                  </div>
               </el-form-item>
            </el-col>
         </el-row>
         <div class="text_center">
            <el-button type="primary" @click="saveMeet('ruleForm')">发送通知</el-button>
         </div>
      </el-form>
   </div>
</template>

<script>
import { saveMeetSendMsg } from "@/api/meeting";
import { getisAttendMan } from "@/api/meeting";
import { meetDate } from "@/assets/js/public";
export default {
   name: "notices",
   data() {
      return {
         notice: true,
         noticesList: "",
         //表格数据
         ruleForm: {
            temp: {
               noticeTemplate: "",
               textarea: ""
            },
            isAllattendMan: [],
            isAttendMan: [],
            meetId: ""
         },
         allattend: {
            //全程参会已选了人员
            checked: [],
            //全程参会人员全选
            checkAll: false,
            indeterminate: false
         },
         attend: {
            //议题已选了人员
            checked: [],
            //议题参会人员全选
            checkAll: false,
            indeterminate: false
         }
      };
   },
   created() {},
   props: {
      noticesData: Object
   },
   methods: {
      getData() {
         let data = {
            id: this.noticesList.id
         };
         getisAttendMan(data)
            .then(res => {
               console.log(res);
               if (res.status === 200) {
                  this.ruleForm.isAllattendMan = res.data.data.isAllattendMan;
                  this.ruleForm.isAttendMan = res.data.data.isAttendMan;
                  this.ruleForm.meetId = this.noticesList.id;
                  this.tempCheck(res.data.data.meetingInfo.state);
                  this.allattendcheck();
                  this.attendCheck();
               }
            })
            .catch(err => {
               console.log(err);
            });
      },
      //模版初始化
      tempCheck(val) {
         switch (val) {
            case "0":
               this.ruleForm.temp.noticeTemplate = 2;
               this.radioChange(2);
               break;
            case "1":
               this.ruleForm.temp.noticeTemplate = 4;
               this.radioChange(4);
               break;
            case "2":
               this.ruleForm.temp.noticeTemplate = 1;
               this.radioChange(1);
               break;
         }
      },
      //改变模版选项触发
      radioChange(val) {
         switch (val) {
            case 1:
               this.ruleForm.temp.textarea =
                  "会议通知：【" +
                  this.noticesList.meetName +
                  "】将于【" +
                  meetDate(this.noticesList.meetTime) +
                  "】在【" +
                  this.noticesList.meetLocate +
                  "】进行, 望您准时参加。联系人：【" +
                  this.noticesList.contactorInfo +
                  "】";
               break;
            case 2:
               this.ruleForm.temp.textarea =
                  "会议通知：很抱歉地通知您，原定于【" +
                  meetDate(this.noticesList.meetTime) +
                  "】举行的【" +
                  this.noticesList.meetName +
                  "】，改为于【" +
                  meetDate(this.noticesList.meetTime) +
                  "】在【" +
                  this.noticesList.meetLocate +
                  "】举行，望您准时参加";
               break;
            case 3:
               this.ruleForm.temp.textarea =
                  "会议通知：【" +
                  this.noticesList.meetName +
                  "】将于【" +
                  meetDate(this.noticesList.meetTime) +
                  "】在【" +
                  this.noticesList.meetLocate +
                  "】进行, 望您准时参加。联系人：【" +
                  this.noticesList.contactorInfo +
                  "】";
               break;
            case 4:
               this.ruleForm.temp.textarea =
                  "会议通知取消：原定于【" +
                  meetDate(this.noticesList.meetTime) +
                  "】在【" +
                  this.noticesList.meetLocate +
                  "】进行的【" +
                  this.noticesList.meetName +
                  "】暂时取消。联系人：【" +
                  this.noticesList.contactorInfo +
                  "】";
               break;
         }
      },
      //全程参会人员初始化
      allattendcheck() {
         this.ruleForm.isAllattendMan.map(item => {
            if (item.checked) {
               this.allattend.checked.push(item.isAllattendManId);
            }
            this.handleChecked(this.allattend.checked);
         });
      },
      //全程参会人员全选
      handleCheckAll(val) {
         this.allattend.checked = [];
         this.ruleForm.isAllattendMan.map(item => {
            this.allattend.checked.push(item.isAllattendManId);
         });
         this.allattend.checked = val ? this.allattend.checked : [];
         this.allattend.indeterminate = false;
      },
      //全程参会人员点击事件
      handleChecked(value) {
         let checkedCount = value.length;
         this.allattend.checkAll = checkedCount === this.ruleForm.isAllattendMan.length;
         this.allattend.indeterminate = checkedCount > 0 && checkedCount < this.ruleForm.isAllattendMan.length;
      },
      //议题参会人员初始化
      attendCheck() {
         this.ruleForm.isAttendMan.map(attend => {
            attend.issueAttendMan.map(item => {
               if (item.checked) {
                  this.attend.checked.push(item.attendManId);
               }
            });
            this.attendChecked(this.attend.checked);
         });
      },
      //议题参会人员全选
      attendCheckAll(val) {
         this.attend.checked = [];
         this.ruleForm.isAttendMan.map(attend => {
            attend.issueAttendMan.map(item => {
               this.attend.checked.push(item.attendManId);
            });
         });
         this.attend.checked = val ? this.attend.checked : [];
         this.attend.indeterminate = false;
      },
      //议题参会人员点击事件
      attendChecked(value) {
         let checkedCount = value.length;
         let arr = [];
         this.ruleForm.isAttendMan.map(item => {
            arr.push(item.issueAttendMan.length);
         });
         let attendAll = this.sum(arr);
         this.attend.checkAll = checkedCount === attendAll;
         this.attend.indeterminate = checkedCount > 0 && checkedCount < attendAll;
      },
      sum(arr) {
         let s = 0;
         for (let i = arr.length - 1; i >= 0; i--) {
            s += arr[i];
         }
         return s;
      },
      //保存改变check的值
      saveMeet() {
         let allattendData = this.allattend.checked;
         this.ruleForm.isAllattendMan.map(item => {
            item.checked = false;
            allattendData.map(val => {
               if (val === item.isAllattendManId) {
                  item.checked = true;
               }
            });
         });
         let attendData = this.attend.checked;
         this.ruleForm.isAttendMan.map(attend => {
            attend.issueAttendMan.map(item => {
               item.checked = false;
               attendData.map(val => {
                  if (val === item.attendManId) {
                     item.checked = true;
                  }
               });
            });
         });
         let data = {
            key: JSON.stringify(this.ruleForm)
         };
         saveMeetSendMsg(data).then(res => {
            if (res.status === 200) {
               this.$message.success("发送成功");
            }
         });
      }
   },
   watch: {
      noticesData: {
         immediate: true,
         handler: function(newVal) {
            this.noticesList = newVal;
            this.$forceUpdate();
            this.getData();
         }
      }
   }
};
</script>

<style scoped></style>
