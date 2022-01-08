<!--单位会议库-->
<template>
   <div class="main_information">
      <!--单位查询-->
      <div class="form_search mb-16 radius_top_none">
         <div class="flex_layout search_info">
            <div class="search_input flex_layout">
               <div class="search_input_info flex_layout">
                  <div style="width: 100px">会议名称：</div>
                  <el-input placeholder="请输入" v-model="meetName"></el-input>
               </div>
               <div class="search_input_info flex_layout">
                  <div style="width: 80px">会议分类：</div>
                  <el-select v-model="meetType" placeholder="请选择">
                     <el-option v-for="item in classification"
                                :key="item.key" :label="item.text" :value="item.key">
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
      <!--单位表格-->
      <div class="form_main border_radius">
         <div class="form_table_title pb-16 flex_layout flex_between">
            <div class="table_title">单位会议库</div>
            <div class="wtsc_title_btn">
               <button type="button" class="btn btn_blue" @click="addmeeting"><span>新增会议</span></button>
               <button type="button" class="btn btn_wathet" @click="delect(multipleSelection)"><span>批量删除</span>
               </button>
            </div>
         </div>
         <div class="form_table">
            <el-table :data="tableData" stripe style="width: 100%;height: 100%"
                      @selection-change="handleSelectionChange">
               <el-table-column type="selection" width="55" align="center"></el-table-column>
               <el-table-column label="会议编号" prop="meetNo"></el-table-column>
               <el-table-column label="会议名称" prop="meetName" min-width="150">
                  <template slot-scope="scope">
                     <div class="form_title_color form_limit" :title="scope.row.meetName"
                          @click="detail(scope.row)">
                        {{scope.row.meetName}}
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
               <el-table-column label="会议分类">
                  <template slot-scope="scope">
                     <div v-if="scope.row.meetType =='gwhzth' ">管委会专题会议</div>
                     <div v-if="scope.row.meetType =='dgwzthy' ">党工委专题会议</div>
                     <div v-if="scope.row.meetType =='dgwh' ">党工委委员会议</div>
                     <div v-if="scope.row.meetType =='zrbgh' ">主任办公会议</div>
                     <div v-if="scope.row.meetType =='qthy' ">其他会议</div>
                  </template>
               </el-table-column>
               <el-table-column label="联系人及其联系方式" prop="contactorInfo"></el-table-column>
               <el-table-column label="发起部门" prop="createDept"></el-table-column>
               <el-table-column label="发起日期" prop="createTime" :formatter="arrivaltime" sortable>
                  <template slot="header" slot-scope="scope">
                     <el-tooltip class="item" effect="dark" content="点击排序" placement="top">
                        <span>发起日期</span>
                     </el-tooltip>
                  </template>
               </el-table-column>
               <el-table-column label="操作" min-width="50">
                  <template slot-scope="scope">
                     <el-dropdown trigger="click">
                        <div class="el-dropdown-link" style="cursor: pointer">
                           <img src="../../../assets/images/icon/more.png" alt="">
                        </div>
                        <el-dropdown-menu slot="dropdown">
                           <div class="form_operation" @click="notice(scope.row)">
                              <div title="发送会议通知">
                                 <img src="../../../assets/images/icon/notice.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation" @click="management(scope.row)">
                              <div title="通知管理">
                                 <img src="../../../assets/images/icon/notice.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation" @click="distribution(scope.row)">
                              <div title="分发会议纪要">
                                 <img src="../../../assets/images/icon/distribution.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation" @click="situation(scope.row)">
                              <div title="参会情况">
                                 <img src="../../../assets/images/icon/participate.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation" @click="shared(scope.row)">
                              <div title="共享">
                                 <img src="../../../assets/images/icon/send.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation" @click="detail(scope.row)">
                              <div title="明细">
                                 <img src="../../../assets/images/icon/detail.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation" @click="editor(scope.row)">
                              <div title="编辑" @click="editor(scope.row)">
                                 <img src="../../../assets/images/icon/edit.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation">
                              <div title="导出会议">
                                 <img src="../../../assets/images/icon/export.png" alt="">
                              </div>
                           </div>
                           <div class="form_operation" @click="delect(scope.row)">
                              <div title="删除">
                                 <img src="../../../assets/images/personal_form/delete.png" alt="">
                              </div>
                           </div>
                        </el-dropdown-menu>
                     </el-dropdown>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <!--单位分页-->
         <div class="form_page">
            <el-pagination background layout="sizes,prev, pager, next"
                           :page-size="this.rowsSize" :page-sizes="[10, 20, 30, 40]" :total="tablePage"
                           :current-page="pageSize"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
         </div>
      </div>
      <!--发送会议管理-->
      <el-dialog title="通知" :visible.sync="disURL" width="1000px" append-to-body :close-on-click-modal='false'>
         <div class="iframe_info iframe_info_btm">
            <iframe :src=this.distributionURL frameborder="0" id="distributionId"></iframe>
            <div class="text_right iframe_btn">
               <el-button type="primary" @click="distributionBtn">确定</el-button>
               <el-button @click="distributioncl">取消</el-button>
            </div>
         </div>
      </el-dialog>
      <!--发送会议管理-->
      <el-dialog title="通知" :visible.sync="notURL" width="1000px" append-to-body :close-on-click-modal='false'>
         <div class="iframe_info iframe_info_btm">
            <iframe :src=this.noticetURL frameborder="0" id="iframeid"></iframe>
            <div class="text_right iframe_btn">
               <el-button type="primary" @click="iframebtn">确定</el-button>
               <el-button @click="closeiframe">取消</el-button>
            </div>
         </div>
      </el-dialog>
      <!--通知管理-->
      <el-dialog title="会议通知管理" :visible.sync="manaURL" width="1000px" append-to-body :close-on-click-modal='false'>
         <div class="iframe_info">
            <iframe :src=this.managementURL frameborder="0"></iframe>
         </div>
      </el-dialog>
      <!--参会情况-->
      <el-dialog title="参会情况" :visible.sync="sitURL" width="1000px" append-to-body :close-on-click-modal='false'>
         <div class="iframe_info">
            <iframe :src=this.situationtURL frameborder="0"></iframe>
         </div>
      </el-dialog>
      <!--参会情况-->
      <el-dialog title="共享管理" :visible.sync="shaURL" width="1000px" append-to-body :close-on-click-modal='false'>
         <div class="iframe_info">
            <iframe :src=this.sharedURL frameborder="0"></iframe>
         </div>
      </el-dialog>
   </div>
</template>

<script>
   import {dateFormat} from '@/assets/js/public'
   import {
      getConferenceUnitData,
      getClassificationData,
      meetinDoNotice,
      sendMinutes,
      removeMeeting
   } from '@/api/meeting'

   export default {
      name: "conferenceUnit",
      data() {
         return {
            tableData: [],//表单数据
            tablePage: 0, //总页数
            pageSize: 1, //当前页
            rowsSize: 10, //条数
            meetName: "", //搜索会议名称
            meetType: '',//搜索会议分类
            classification: [],//分类
            multipleSelection: [],//批量删除
            disURL: false,
            distributionURL: '',
            notURL: false,
            noticetURL: '',
            manaURL: false,
            managementURL: '',
            sitURL: false,
            situationtURL: '',
            shaURL: false,
            sharedURL: ''
         }
      },
      created() {
         this.getData();
         //获取分类
         getClassificationData().then(res => {
            this.classification = res.data.data
         });
      },
      methods: {
         //获取列表数据
         getData() {
            let data = {
               "page": this.pageSize,
               "rows": this.rowsSize,
               "meetName": this.meetName,
               "meetType": this.meetType
            }
            getConferenceUnitData(data).then(res => {
               this.tableData = res.data.data.rows;
               this.tablePage = res.data.data.total
            });
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
            if (this.meetName == '' && this.meetType == '') {
               this.$message.error('请填写要查询的信息！！');
            } else {
               this.pageSize = 1
               this.getData();
            }
         },
         //重置
         resetData() {
            this.pageSize = 1;
            this.rowsSize = 10;
            this.meetName = "";
            this.meetType = '';
            this.getData();
         },
         //时间格式化
         meetingtime(val) {
            return dateFormat(val.meetTime);
         },
         arrivaltime(val) {
            return dateFormat(val.createTime);
         },
         //链接跳转
         addmeeting() {
            let url = process.env.VUE_APP_MEET + '/form/formBus/hyfa/edit?canExport=true&type=MANAGER&parentGridId=grid';
            window.open(url, '_black');
         },
         notice(row) {
            let url = process.env.VUE_APP_MEET + '/meeting/meet/meetingInfo/sendSelectorByMeetingModule?id=' + row.id + '&type=NOTICE';
            this.noticetURL = url;
            this.notURL = true;
         },
         management(row) {
            let url = process.env.VUE_APP_MEET + '/meeting/meet/meetToDo/meetToDoManageList?meetId=' + row.id + '&parentGridId=grid&keyId=' + row.id;
            this.managementURL = url;
            this.manaURL = true;
         },
         situation(row) {
            let url = process.env.VUE_APP_MEET + '/meeting/meet/meetAttendance/meetAttendanceList?meetId=' + row.id + '&parentGridId=grid&keyId=' + row.id;
            this.situationtURL = url;
            this.sitURL = true;
         },
         shared(row) {
            let url = process.env.VUE_APP_MEET + '/meeting/issue/issueShareRecord/issueShareRecordList?issueId=' + row.id + '&shareType=2';
            this.sharedURL = url;
            this.shaURL = true;
         },
         detail(row) {
            let url = process.env.VUE_APP_MEET + '/form/formBus/hyfa/get?id=' + row.id + '&parentGridId=grid&keyId=' + row.id;
            window.open(url, '_black');
         },
         editor(row) {
            let url = process.env.VUE_APP_MEET + '/form/formBus/hyfa/edit?id=' + row.id + '&parentGridId=grid&keyId=' + row.id;
            window.open(url, "_blank");
         },
         distribution(row) {
            if (row.meetMinutesFileId) {
               let url = process.env.VUE_APP_MEET + '/meeting/meet/meetingInfo/sendSelectorByMeetingModule?id=' + row.id + '&type=MINUTES';
               this.distributionURL = url;
               this.disURL = true;
            } else {
               this.$message({
                  type: 'error',
                  message: '未上传会议纪要不能分发'
               });
            }
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
                  removeMeeting(data).then(res => {
                     console.log(res);
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

         //iframe
         iframebtn() {
            let data = document.getElementById("iframeid").contentWindow.getResult();
            meetinDoNotice(data.data).then(res => {
               if (res.status == 200) {
                  if (res.data.status == 0) {
                     this.$message({
                        type: 'success',
                        message: res.data.data.message
                     });
                     this.closeiframe();
                  } else if (res.data.status == 1) {
                     this.$message({
                        type: 'error',
                        message: res.data.data.message
                     });
                  }
               }
            })
         },
         closeiframe() {
            this.notURL = false
         },
         //发送会议纪要
         distributionBtn() {
            let data = document.getElementById("distributionId").contentWindow.getResult();
            sendMinutes(data.data).then(res => {
               if (res.status == 200) {
                  if (res.data.result == 1) {
                     this.$message({
                        type: 'success',
                        message: res.data.message
                     });
                     this.distributioncl();
                  } else if (res.data.result == 0) {
                     this.$message({
                        type: 'error',
                        message: res.data.message
                     });
                  }
               }
            })
         },
         distributioncl() {
            this.disURL = false
         }
      }
   }
</script>
<style scoped lang='scss'>
   .form_operation {
      margin: 0 10px;
      font-size: 13px;
   }

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

      .iframe_btn {
         position: absolute;
         bottom: 0;
         right: 0;
      }
   }

   .iframe_info_btm iframe {
      height: 90%;
   }

</style>