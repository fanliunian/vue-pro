<template>
  <el-dialog
      title="新增议题"
      :visible.sync="dialogVisible"
      width="1100px"
      :before-close="handleClose">
    <div class="addMeetingDialog">
      <div class="table">
        <div class="table-row">
          <div class="title">
            <div class="name">议题名称</div>
          </div>
          <div class="input">
            <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入"
            >
            </el-input>
          </div>
        </div>
        <div class="table-row">
          <div class="half">
            <div class="title">
              <div class="name">汇报人</div>
            </div>
          </div>
          <div class="half">
            <div class="title">
              <div class="name">列席领导或部门
              </div>
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="half">
            <div class="title">
              <div class="name">议题分类</div>
            </div>
            <div class="input">
              <el-select placeholder="请选择">
                <el-option v-for="(item,index) in meetTypeList" :key="index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="half">
            <div class="title">
              <div class="name">议题时长</div>
            </div>
            <div class="input">
              <el-select placeholder="请选择">
                <el-option v-for="(item,index) in selectTimeList" :key="index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="half">
            <div class="title">
              <div class="name">使用投影</div>
            </div>
            <div class="input">
              <el-radio-group>
                <el-radio :label="3">是</el-radio>
                <el-radio :label="6">否</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="half">
            <div class="title">
              <div class="name">新闻报道</div>
            </div>
            <div class="input">
              <el-radio-group>
                <el-radio :label="3">是</el-radio>
                <el-radio :label="6">否</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="title">
            <div class="name">相关领导意见
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="title">
            <div class="name">议题内容
            </div>
          </div>
          <div class="input">
            <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入"
            >
            </el-input>
          </div>
        </div>
        <div class="table-row">
          <div class="title">
            <div class="name">参会人员
            </div>
          </div>
        </div>
        <div class="table-row">
          <div class="title">
            <div class="name">有关事项
            </div>
          </div>
          <div class="input">
            <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入"
            >
            </el-input>
          </div>
        </div>
        <div class="table-row" style="border-bottom: none">
          <div class="title">
            <div class="name">添加时间
            </div>
          </div>
          <div class="input">
            <el-date-picker
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="file-box">
        <div class="title"><i class="el-icon-document" style="margin-right: 5px;font-size: 16px"></i>附件（相关材料）</div>
        <div class="uploadBox">
          <div class="uploadButton">
            <el-upload>
              <el-button size="small" type="primary">上传</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="footer-button">
        <div class="button-box">
          <el-button size="mini" type="primary">确定</el-button>
          <el-button size="mini" @click="handleClose">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "addMetting",
  data() {
    return {
      dialogVisible: false,
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
      selectTimeList: [
        {
          value: '15分钟',
          label: '15分钟'
        }, {
          value: '30分钟',
          label: '30分钟'
        }, {
          value: '45分钟',
          label: '45分钟'
        }, {
          value: '60分钟',
          label: '60分钟'
        }
        , {
          value: '90分钟',
          label: '90分钟'
        }
        , {
          value: '120分钟',
          label: '120分钟'
        }
      ],//会议类型下拉框
    }
  },
  methods: {
    onLoad() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
  }

}
</script>

<style scoped>
.addMeetingDialog {
  height: 500px;
  display: block;
  overflow: auto;
  width: 1080px;
}

.addMeetingDialog .table {
  border: 1px solid #E5E5E5;
  min-height: 200px;
}

.addMeetingDialog .table .table-row {
  border-bottom: 1px solid #E5E5E5;
  min-height: 50px;
  display: flex;
  flex-direction: row;
}

.addMeetingDialog .table .table-row .half {
  width: 540px;
  border-right: 1px solid #E5E5E5;
  display: flex;
  flex-direction: row;
}

.addMeetingDialog .table .table-row .half .title {
  border-right: 1px solid #E5E5E5;
  width: 110px;
  text-align: center;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.addMeetingDialog .table .table-row .half .input {
  display: flex;
  align-items: center;
  width: 400px;
}

.addMeetingDialog .table .table-row .input {
  display: flex;
  align-items: center;
  width: 940px;
}

.addMeetingDialog .table .table-row .title {
  border-right: 1px solid #E5E5E5;
  width: 110px;
  text-align: center;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addMeetingDialog .footer-button {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  background: #fafafa;
}

.addMeetingDialog .footer-button .button-box {
  padding: 5px 20px 5px 5px;
  text-align: right;
}

.addMeetingDialog .file-box {
  margin-top: 20px;
  margin-bottom: 50px;
  /*border: 1px solid #E5E5E5;*/
  font-size: 13px;
}

.addMeetingDialog .file-box .title {
  padding: 10px;
  border-bottom: 1px solid #E5E5E5;
}

.addMeetingDialog .file-box .uploadBox {
  margin: 10px;
  border: 1px solid #E5E5E5;
}

.addMeetingDialog .file-box .uploadBox .uploadButton {
  padding: 10px;
}
</style>