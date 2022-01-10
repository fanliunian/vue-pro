<template>
  <div>
    <el-dialog
        title="文件上传"
        :visible.sync="dialogVisible"
        width="1000px"
        :before-close="handleClose"
    >
      <div class="uploadDialog">
        <div class="upload">
          <el-upload
              :action="upLoadUrl"
              :on-success="fileUploadSuccess"
              :headers="{ access_token: token }"
              :show-file-list="false"
              :on-error="fileUploadError"
              :before-upload="fileBeforeUpload"
          >
            <div class="upload-content">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
        </div>
        <div class="upload-table">
          <div class="table-title">上传队列</div>
          <div class="table">
            <div class="header">
              <div style="width: 10%">序号</div>
              <div style="width: 30%">文件</div>
              <div style="width: 10%">大小</div>
              <div style="width: 15%">进度</div>
              <div style="width: 15%">状态</div>
              <div style="width: 20%">操作</div>
            </div>
            <div class="content" v-for="(file,index) in filesList" :key="index">
              <div style="width: 10%">{{ index + 1 }}</div>
              <div style="width: 30%" class="ellipsis" :title="file.name">{{ file.name }}</div>
              <div style="width: 10%"> {{ file.size }}</div>
              <div class="percentage">
                <el-progress :percentage="file.percentage"></el-progress>
              </div>
              <div style="width: 15%">
                <i class="el-icon-check" v-if="file.status===0"></i>
                <i class="el-icon-close" v-else-if="file.status===1"></i>
                <i class="el-icon-loading" v-else></i>
              </div>
              <div style="width: 20%">
                <!--                <el-button size="mini" type="primary">上传</el-button>-->
                <!--                <el-button size="mini">取消</el-button>-->
                <el-button size="mini" type="danger" @click="deleteFile(file.uid)">删除</el-button>
              </div>
            </div>
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
import store from "@/store";
import config from "@/request/config";


export default {
  name: "uploadDiolog",
  props: {
    uploadDiologType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      token: "",
      filesList: [],
      type: '',
      importUrl: '/meetingService/file/fileUpload',
      upLoadUrl: ''
    }
  },
  created() {
    // 导入地址
    this.upLoadUrl = config.baseBase + this.importUrl;
    this.token = store.state.admin.access_token;
  },
  methods: {
    onLoad() {
      this.filesList = []
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    fileUploadSuccess(response, file, fileList) {
      if (response.status === '0') {
        this.$message.success(response.msg)
        this.filesList = this.filesList.map(item => {
          if (item.uid === file.uid) {
            item.percentage = 100
            item.status = 0
            item.id = response.data[0].id
            return item
          }
          return item
        })
      } else {
        this.$message.error(response.msg)
        this.filesList = this.filesList.map(item => {
          if (item.uid === file.uid) {
            item.percentage = 50
            item.status = 1
            return item
          }
          return item
        })
      }
    },
    fileUploadError(response, file, fileList) {
      console.log(response)
    },
    fileBeforeUpload(file) {
      const fileItem = {
        name: file.name,
        size: this.transferMb(file.size),
        status: '',
        percentage: 0,
        uid: file.uid
      }
      if (this.type === 'metail') {
        this.filesList.push(fileItem)
        return true
      } else {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
          this.$message.error('请上传pdf格式文件');
          return false
        } else {
          this.filesList.push(fileItem)
          return true
        }
      }

    },
    transferMb(size) {
      let num = (size / 1024) / 1024
      let s = num.toFixed(2) + 'MB'
      return s
    },
    deleteFile(id) {
      this.filesList = this.filesList.filter(item => {
        if (id === item.uid) {
          return false
        }
        return true
      })
    },
    handleOk() {
      const data = {
        fileType: this.type,
        filesList: this.filesList
      }
      this.$emit('uploadHandle', data)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.uploadDialog {
  display: block;
  height: 400px;
  overflow: auto;
}

.uploadDialog .upload {

}

.uploadDialog .upload .upload-content {
  width: 100px;
  height: 100px;
  border: 1px dashed #c0ccda;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uploadDialog .upload .upload-content:hover {
  border-color: #409eff
}

.uploadDialog .upload-table {
  border: 1px solid #c0ccda;
  margin-top: 20px;
  padding-bottom: 30px;
}

.uploadDialog .upload-table .table-title {
  background: #c0ccda;
  padding: 10px 20px;
  color: #FFFFFF;
}

.uploadDialog .upload-table .table {
  padding: 10px 30px 10px 30px;
  width: 90%;
  margin: auto;
  color: #000000;
  font-size: 13px;
}

.uploadDialog .upload-table .table .header {
  display: flex;
  flex-direction: row;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #c0ccda;
}

.uploadDialog .upload-table .table .content {
  display: flex;
  flex-direction: row;
  text-align: center;
  padding: 10px 0;
  border-bottom: 1px solid #c0ccda;
  line-height: 28px;

}

.uploadDialog .upload-table .table .content .percentage {
  margin: auto;
  width: 15%;
}

.uploadDialog .footer-button {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  background: #fafafa;
}

.uploadDialog .footer-button .button-box {
  padding: 5px;
  text-align: right;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>