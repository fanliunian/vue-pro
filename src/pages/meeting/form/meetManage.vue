<!--会议室管理-->
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
        <div class="table_title">会议室管理</div>
        <div class="table_titleBtn">
          <button type="button" class="btn btn_blue" @click="addmeeting()"><span>新增</span></button>
          <button type="button" class="btn btn_wathet" @click="delect(multipleSelection)">
            <span>批量删除</span>
          </button>
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
          <el-table-column label="会议室名称" prop="meetingName"></el-table-column>
          <el-table-column label="所属楼栋" prop="tower"></el-table-column>
          <el-table-column label="所属楼层" prop="floorNo"></el-table-column>
          <el-table-column label="容纳人数" prop="meetingSize"></el-table-column>
          <el-table-column label="会议室电话" prop="meetingPhone"></el-table-column>
          <el-table-column label="会议室管理员" prop="createUsername"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <div class="form_operation">
                <div title="编辑" @click="editor(scope.row)">
                  <img src="../../../assets/images/personal_form/edit.png" alt=""/>
                </div>
              </div>
              <div class="form_operation">
                <div title="删除" @click="delect(scope.row)">
                  <img src="../../../assets/images/personal_form/delete.png" alt=""/>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--会议室分页-->
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
    <!--会议室管理添加弹窗-->
    <el-dialog
        :title="formTitle"
        :visible.sync="dialogFormVisible"
        width="700px"
        append-to-body
        @close="reset('ruleForm')"
        :close-on-click-modal="false"
    >
      <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会议室名称" prop="meetingName">
              <el-input v-model="ruleForm.meetingName"></el-input>
            </el-form-item>
            <el-form-item label="容纳人数" prop="meetingSize">
              <el-input v-model="ruleForm.meetingSize"></el-input>
            </el-form-item>
            <el-form-item label="所属楼栋及楼层" prop="floorNo">
              <div class="flex_layout">
                <el-select
                    v-model="ruleForm.tower"
                    placeholder="请选择"
                    style="width: 70%"
                    value-key="id"
                    @change="selectbuild($event)"
                >
                  <el-option
                      v-for="item in DormBuildingList"
                      :key="item.buildingid"
                      :label="item.buildingname"
                      :value="{ id: item.buildingid, name: item.buildingname }"
                  >
                  </el-option>
                </el-select>
                &nbsp;&nbsp;&nbsp;
                <el-input v-model="ruleForm.floorNo" style="width: 30%"></el-input>&nbsp;&nbsp;层
              </div>
            </el-form-item>
            <el-form-item label="支持投影或电视" prop="isSupport">
              <el-select v-model="ruleForm.isSupport" placeholder="请选择">
                <el-option v-for="item in Support" :label="item.lable" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会议室电话" prop="meetingPhone">
              <el-input v-model="ruleForm.meetingPhone"></el-input>
            </el-form-item>
            <el-form-item label="管理员" prop="adminName">
              <el-input v-model="ruleForm.adminName"></el-input>
            </el-form-item>
            <el-form-item label="管理员电话" prop="adminPhone">
              <el-input v-model="ruleForm.adminPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议室设备" prop="device">
              <el-checkbox-group v-model="alldevice">
                <el-checkbox v-for="box in deviceList" :key="box.id" :label="box.id"
                >{{ box.chooseName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="adminName">
              <el-input
                  v-model="ruleForm.note"
                  type="textarea"
                  :autosize="{ minRows: 3 }"
                  placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="text_center">
          <el-button type="primary" @click="saveMeet('ruleForm')">保存</el-button>
          <el-button @click="reset('ruleForm')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {dateFormat} from "@/assets/js/public";
import {delectManageData, getMeetManageData, BuildingDialog, SaveMeetingRoom, MeetingRoomById} from "@/api/meeting";

export default {
  name: "issueUnit",
  data() {
    return {
      tableData: [], //表单数据
      tablePage: 0, //总页数
      pageSize: 1, //当前页
      rowsSize: 10, //条数
      meetingName: "", //搜索会议室名称
      multipleSelection: [], //批量删除
      dialogFormVisible: false, //弹窗
      formTitle: "", //弹窗标题
      DormBuildingList: "", //楼栋获取
      deviceList: [], //设备获取
      alldevice: "",
      Support: [
        //是否投影
        {
          lable: "是",
          value: "是"
        },
        {
          lable: "否",
          value: "否"
        }
      ],
      //提交数据
      ruleForm: {
        meetingName: "", //会议室名称
        adminName: "", //管理员
        meetingSize: "", //容纳人数
        adminPhone: "", //管理员电话
        floorNo: "", //所属层
        tower: "", //所属楼
        towerId: "", //所属楼的id
        meetingPhone: "", //会议室电话
        isSupport: "", //是否投影
        device: "", //设备
        note: "" //备注
      },
      rules: {
        meetingName: [{required: true, message: "请填写会议室名称", trigger: "blur"}],
        meetingSize: [{required: true, message: "请填写容纳人数", trigger: "blur"}],
        floorNo: [{required: true, message: "请填写楼栋及楼层", trigger: "blur"}],
        isSupport: [{required: true, message: "是否需要投影", trigger: "blur"}]
        // device: [{required: true, message: '请勾选会议设备', trigger: 'blur'}],
      }
    };
  },
  created() {
    this.getData();
    //楼栋获取
    BuildingDialog().then(res => {
      this.DormBuildingList = res.data.data.DormBuildingList;
      this.deviceList = res.data.data.deviceList;
    });
  },
  methods: {
    //获取列表数据
    getData() {
      let data = {
        page: this.pageSize,
        rows: this.rowsSize,
        meetingName: this.meetingName
      };
      getMeetManageData(data).then(res => {
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
      // if (this.meetingName == "") {
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
      this.meetingName = "";
      this.getData();
    },
    //时间格式化
    meetingtime(val) {
      return dateFormat(val.createTime);
    },
    arrivaltime(val) {
      return dateFormat(val.updateTime);
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
              delectManageData(data).then(res => {
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
    //添加
    addmeeting() {
      this.formTitle = "添加会议室";
      this.dialogFormVisible = true;
      this.alldevice = [];
    },
    //编辑
    editor(row) {
      this.formTitle = "编辑会议室";
      this.dialogFormVisible = true;
      let data = {id: row.id};
      MeetingRoomById(data).then(res => {
        this.ruleForm = res.data.data.meeting;
        let devices = res.data.data.devices;
        let arr = [];
        for (let i = 0; i < devices.length; i++) {
          arr.push(devices[i].deviceId);
        }
        this.alldevice = arr;
      });
    },
    //楼栋选择
    selectbuild(val) {
      this.ruleForm.tower = val.name;
      this.ruleForm.towerId = val.id;
    },
    //取消
    reset(formName) {
      this.dialogFormVisible = false;
      this[formName] = {};
      this.$refs[formName].resetFields();
    },
    //保存
    saveMeet(formName) {
      let {createTime, ...data} = this.ruleForm;
      data.device = this.alldevice.toString();
      this.$refs[formName].validate(valid => {
        if (valid) {
          SaveMeetingRoom(data).then(res => {
            if (res.data.status == 1) {
              this.$message.warning(res.data.msg);
            } else if (res.data.status == 0) {
              this.$message.success(res.data.msg);
              this.reset("ruleForm");
              this.getData();
            }
          });
        } else {
          this.$message.warning("请填写必填的内容");
        }
      });
    }
  }
};
</script>
<style scoped></style>
