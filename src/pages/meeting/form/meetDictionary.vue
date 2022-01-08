<!--会议室字典-->
<template>
  <div class="main_information">
    <!--会议室查询-->
    <div class="form_search mb-16 radius_top_none">
      <div class="flex_layout search_info">
        <div class="search_input flex_layout">
          <div class="search_input_info flex_layout">
            <div style="width: 100px">所属方案：</div>
            <el-input placeholder="请输入" v-model="type"></el-input>
          </div>
          <div class="search_input_info flex_layout">
            <div style="width: 100px">方案名称：</div>
            <el-input placeholder="请输入" v-model="chooseName"></el-input>
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
        <div class="table_title">会议室字典</div>
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
          <el-table-column label="设施名称" prop="chooseName"></el-table-column>
          <el-table-column label="选择类型" prop="chooseType"></el-table-column>
          <el-table-column label="所属方案" prop="type"></el-table-column>
          <el-table-column label="方案名称" prop="typeName"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <div v-if="scope.row.status =='00'">启动</div>
              <div v-if="scope.row.status =='01'">关闭</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="200" :formatter="meetingtime" sortable>
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
                  <img src="../../../assets/images/personal_form/edit.png" alt="">
                </div>
              </div>
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
    <!--会议室字典添加弹窗-->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="700px" append-to-body
               @close="reset('ruleForm')" :close-on-click-modal="false">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" :rules="rules" class="demo-ruleForm"
               label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设施名称" prop="chooseName">
              <el-input v-model="ruleForm.chooseName"></el-input>
            </el-form-item>
            <el-form-item label="设施类型" prop="chooseType">
              <el-input v-model="ruleForm.chooseType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="方案名称" prop="typeName">
              <el-select v-model="ruleForm.typeName" placeholder="请选择" @change="select($event)">
                <el-option
                    v-for="item in Support"
                    :label="item.lable"
                    :value="item.value"
                    :key="item.lable">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="ruleForm.status" placeholder="请选择">
                <el-option
                    v-for="item in allStatus"
                    :label="item.lable"
                    :value="item.value">
                </el-option>
              </el-select>
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
import {dateFormat} from '@/assets/js/public'
import {delectMeetDictionaryData, getMeetDictionaryData, getSysDictionary, SaveSysDictionary} from '@/api/meeting'

export default {
  name: "issueUnit",
  data() {
    return {
      tableData: [],//表单数据
      tablePage: 0, //总页数
      pageSize: 1, //当前页
      rowsSize: 10, //条数
      type: "", //搜索所属方案
      chooseName: '',//搜索方案名称
      multipleSelection: [],//批量删除
      dialogFormVisible: false,
      formTitle: "",//弹窗标题
      //提交数据
      ruleForm: {
        chooseName: '',//设施名称
        typeName: '',//方案名称
        type: '',//所属方案
        chooseType: '',//设施类型
        status: '00',//状态
      },
      //方案选择
      Support: [
        {
          lable: '会议室设备',
          value: '会议室设备'
        },
        {
          lable: '建筑作用',
          value: '建筑作用'
        },
        {
          lable: '校区选择',
          value: '校区选择'
        }
      ],
      //状态
      allStatus: [
        {
          lable: '启动',
          value: '00'
        },
        {
          lable: '禁用',
          value: '01'
        }
      ],
      //预定校验
      rules: {
        chooseName: [{required: true, message: '请填写设施名称', trigger: 'blur'}],
        typeName: [{required: true, message: '请填写方案名称', trigger: 'blur'}],
        chooseType: [{required: true, validator: this.chooseTypePass, trigger: 'blur'}],
      },
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
        "type": this.type,
        "chooseName": this.chooseName
      }
      getMeetDictionaryData(data).then(res => {
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
      // if (this.type == '' && this.chooseName == '') {
      //    this.$message.error('请填写要查询的信息！！');
      // } else {
      this.pageSize = 1
      this.getData();
      // }
    },
    //重置
    resetData() {
      this.pageSize = 1;
      this.rowsSize = 10;
      this.type = "";
      this.chooseName = '';
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
            type: 'error',
            message: '请勾选要删除的信息'
          });
        }
      } else {
        //是单行删除
        arr.push(row.id)
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {"id": arr.toString()}
        delectMeetDictionaryData(data).then(res => {
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
    },
    //建筑类型选择匹配
    select(val) {
      switch (val) {
        case '会议室设备':
          this.ruleForm.type = "hyssb";
          break
        case '建筑作用':
          this.ruleForm.type = "jzzy";
          break
        case '校区选择':
          this.ruleForm.type = "xqxz";
          break
      }

    },
    //添加
    addmeeting() {
      this.formTitle = "添加字典";
      this.dialogFormVisible = true;
    },
    //编辑
    editor(row) {
      this.formTitle = "编辑字典";
      this.dialogFormVisible = true;
      let data = {id: row.id}
      getSysDictionary(data).then(res => {
        this.ruleForm = res.data.data;
      })
    },
    //取消
    reset(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    //保存
    saveMeet(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let {createTime, ...data} = this.ruleForm
          SaveSysDictionary(data).then(res => {
            if (res.data.status == 1) {
              this.$message.warning(res.data.msg);
            } else if (res.data.status == 0) {
              this.$message.success(res.data.msg);
              this.reset('ruleForm');
              this.getData();
            }
          })
        } else {
          this.$message.warning('请填写必填的内容');
        }
      });

    },
    //验证
    chooseTypePass(rule, value, callback) {
      if (value == '') {
        callback(new Error('请填写设施类型'));
      } else if (/[a-zA-z]$/.test(value) == false) {
        //  校验英文的正则
        callback(new Error("请输入英文"));
      } else {
        //校验通过
        callback();
      }
    },
  }
}
</script>
<style scoped>
</style>