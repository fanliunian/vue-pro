<template>
  <div class="selector-container">
    <!--    <div class="selector-main">-->
    <!--      <div class="selector-input" id="inputContainer" @click="dialogOpen">-->
    <!--        <template v-if="inputList.length">-->
    <!--          <el-tag-->
    <!--              class="selector-input-tag"-->
    <!--              v-for="(item, index) in inputList"-->
    <!--              :key="index"-->
    <!--          >{{ item.orgname }}-->
    <!--          </el-tag-->
    <!--          >-->
    <!--          <label v-if="inputList.length < selectorList.length">...</label>-->
    <!--        </template>-->
    <!--        <label v-else class="selector-input-placeholder">请选择</label>-->
    <!--        <div-->
    <!--            v-if="selectorList.length"-->
    <!--            class="selector-input-fixed"-->
    <!--            @click.stop="cleanHandle"-->
    <!--        >-->
    <!--          <i class="el-icon-circle-close"/>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="hidden-container">-->
    <!--        <el-tag-->
    <!--            class="selector-hidden-tag"-->
    <!--            v-for="(item, index) in selectorList"-->
    <!--            :key="index"-->
    <!--            :id="`tag${index}`"-->
    <!--        >{{ item.orgname }}-->
    <!--        </el-tag-->
    <!--        >-->
    <!--      </div>-->
    <!--    </div>-->
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :show-close="false"
        width="700px"
        :closed="dialogClose"
    >
      <div class="dialog-container">
        <div class="dialog-left">
          <div class="filter-container">
            <label>组织搜索：</label>
            <el-input
                v-model="keywords"
                size="small"
                placeholder="请输入"
                clearable
            />
            <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="getOrganization(keywords)"
            >查询
            </el-button
            >
          </div>
          <el-tree
              v-loading="uniLoading"
              class="tree-container"
              :data="uniList"
              default-expand-all
              highlight-current
              :props="{
              children: 'children',
              label: 'orgname'
            }"
              :expand-on-click-node="false"
              @node-click="selectTreeNode"
          >
          </el-tree>
        </div>
        <div class="dialog-right">
          <el-table :data="selectList" height="345">
            <el-table-column prop="orgname" label="已选" align="center"/>
            <el-table-column align="center" width="60px">
              <template slot="header" slot-scope="scope">
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    :disabled="!selectList.length"
                    @click="deleteHandle()"
                />
              </template>
              <template slot-scope="scope">
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="deleteHandle(scope)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getOrganizationData} from "@/api/authority";

export default {
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    title: {
      type: String,
      default: "组织选择器"
    },
    current: {
      type: [Array, String],
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectorList: [],
      inputList: [],
      keywords: "",
      uniList: [],
      selectList: [],
      isHandle: true,
      uniLoading: false
    };
  },
  watch: {
    // current: {
    //   deep: true,
    //   handler(newValue) {
    //     this.inputList = [];
    //     if (typeof newValue === "object") {
    //       this.selectorList = [...newValue];
    //       this.$nextTick(() => {
    //         const containerWidth =
    //             document.getElementById("inputContainer").clientWidth - 30;
    //         let widthTotal = 0;
    //         for (const index in newValue) {
    //           widthTotal +=
    //               document.getElementById(`tag${index}`).clientWidth + 4;
    //           if (widthTotal < containerWidth) {
    //             this.inputList.push(newValue[index]);
    //           } else {
    //             break;
    //           }
    //         }
    //       });
    //       this.selectList = [...newValue];
    //     }
    //   }
    // }
  },
  methods: {
    getOrganization(keywords) {
      const data = {
        businesstype: 0,
        scenetype: 0,
        specvalue: {
          orgname: keywords || ""
        }
      };
      this.uniLoading = true;
      getOrganizationData(data)
          .then(res => {
            if (res.data && res.data.status == 0) {
              if (res.data.data.orginfo && res.data.data.orginfo.length) {
                this.uniList = this.getArrayTree(
                    res.data.data.orginfo,
                    "id",
                    "parentid"
                );
              } else {
                this.uniList = [];
              }
              this.uniLoading = false;
            }
          })
          .catch(() => {
            this.uniList = [];
            this.uniLoading = false;
          });
    },
    getArrayTree(arrList, id, pid, children = "children") {
      const map = [];
      arrList.forEach(item => {
        const up = arrList.filter(itemA => itemA[id] === item[pid]);
        const sit = arrList.filter(itemA => itemA[pid] === item[id]);
        if (sit.length) item[children] = sit;
        if (!(up.length && !sit.length)) map.push(item);
      });
      if (arrList.length == map.length) return map;
      else return this.getArrayTree(map, id, pid);
    },
    cleanHandle() {
      this.selectorList = [];
      this.inputList = [];
    },
    dialogOpen() {
      this.dialogVisible = true;
      this.selectList = this.current
      this.getOrganization();
    },
    dialogClose() {
      this.dialogVisible = false;
      this.keywords = "";
      this.selectList = [...this.selectorList];
    },
    selectTreeNode(node) {
      if (this.selectList.filter(item => item.id === node.id).length === 0) {
        this.selectList.push(node);
      }
    },
    deleteHandle(scope) {
      if (scope && scope.row) {
        this.selectList.splice(scope.$index, 1);
      } else {
        this.$confirm("确认清除已选项", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
            .then(() => {
              this.selectList = [];
              this.$refs.dataList.clearSelection();
            })
            .catch(() => {
            });
      }
    },
    confirm() {
      this.selectorList = [...this.selectList];
      // this.$emit("input", this.selectorList)
      this.$emit("confirmHandle", this.selectorList);
      // this.$emit("confirmHandle", this.selectList);
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.selector-container {
  width: 100%;
  max-width: 100%;
  height: 32px;

  .selector-main {
    width: inherit;
    height: inherit;

    .selector-input {
      position: relative;
      display: flex;
      align-items: center;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #606266;
      font-size: inherit;
      width: 100%;
      max-width: 100%;
      height: 32px;
      line-height: 32px;
      outline: 0;
      padding: 0 15px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 0.2s;

      &:hover {
        border-color: #c0c4cc;
      }

      &-placeholder {
        font-size: 13px;
        color: #bbc5d0;
      }

      &-tag {
        margin-right: 4px;

        &:last-child {
          margin-right: 0;
        }
      }

      &-fixed {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(255, 255, 255, 0);

        &:hover {
          color: #c0c4cc;
        }
      }
    }
  }

  .hidden-container {
    visibility: hidden;

    .selector-hidden-tag {
      margin-right: 4px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .dialog-container {
    display: flex;
    box-sizing: border-box;
    padding-top: 10px;

    .dialog-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-right: 10px;
      box-sizing: border-box;

      .filter-container {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        label {
          min-width: 90px;
          max-width: 90px;
          width: 90px;
          text-align: right;
        }

        ::v-deep .el-button {
          margin-left: 10px;
          padding: 9px 15px !important;
        }
      }

      .tree-container {
        height: 379px;
        overflow: auto;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
      }
    }

    .dialog-right {
      flex: 1;
      box-sizing: border-box;
      padding-top: 52px;
    }
  }
}

.tree-container {
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 8px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
    border-radius: 0;
    background: rgba(0, 0, 0, 0);
  }
}
</style>
