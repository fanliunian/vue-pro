<template>
  <div class="selector-container">
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :show-close="false"
        width="1100px"
        :closed="dialogClose"
    >
      <div class="dialog-container">
        <div class="dialog-left">
          <el-tabs type="card" v-model="tabActive">
            <el-tab-pane
                v-for="(item, index) in tabList"
                :key="index"
                :label="item"
                :name="item"
            >
              <div v-loading="tabsLoading" style="width: 100%; height: 100%;">
                <el-tree
                    v-if="tabActive === '本单位'"
                    :data="uniList"
                    default-expand-all
                    highlight-current
                    :props="{
                    children: 'children',
                    label: 'orgname'
                  }"
                    :expand-on-click-node="false"
                    @node-click="selectTreeNode"
                />
                <el-table
                    v-if="tabActive === '职位'"
                    :data="positionList"
                    style="width: 100%"
                    :show-header="false"
                    @row-click="positionRowClick"
                >
                  <el-table-column>
                    <template slot-scope="scope">
                      <span
                          :class="[
                          positionId === scope.row.titleid
                            ? 'table-checked-cell'
                            : ''
                        ]"
                      >{{ scope.row.titlename }}</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                    v-if="tabActive === '群组'"
                    :data="groupList"
                    style="width: 100%"
                    :show-header="false"
                    @row-click="groupRowClick"
                >
                  <el-table-column>
                    <template slot-scope="scope">
                      <span
                          :class="[
                          groupId === scope.row.id ? 'table-checked-cell' : ''
                        ]"
                      >{{ scope.row.groupname }}</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane
            >
          </el-tabs>
        </div>
        <div class="dialog-right">
          <div class="dialog-right-left">
            <div class="filter-container">
              <span>姓名：</span>
              <el-input
                  v-model="keywords"
                  size="small"
                  placeholder="请输入"
                  clearable
                  :disabled="searchDisabled"
              />
              <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  :disabled="searchDisabled"
                  @click="getDataList(keywords)"
              >查询
              </el-button
              >
            </div>
            <el-table
                v-loading="tableLoading"
                :data="dataList"
                ref="dataList"
                class="table-container"
                height="345"
                @row-click="dataListRowClick"
                @selection-change="dataListSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center"/>
              <el-table-column prop="fullname" label="姓名" align="center"/>
              <el-table-column prop="orgname" label="部门" align="center"/>
            </el-table>
            <el-pagination
                small
                @current-change="paginationCurrentChange"
                :current-page="currentPage"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="pageTotal"
            />
          </div>
          <div class="dialog-right-right">
            <el-table :data="selectList" height="345">
              <el-table-column prop="fullname" label="已选" align="center"/>
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getOrganizationData, getUserData} from "@/api/authority";

export default {
  props: {
    title: {
      type: String,
      default: "人员选择器"
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
      tabList: ["本单位", "职位", "群组"],
      tabActive: "",
      uniId: "",
      positionId: "",
      groupId: "",
      uniList: [],
      positionList: [],
      groupList: [],
      tabsLoading: false,
      keywords: "",
      currentPage: 1,
      pageTotal: 0,
      dataList: [],
      tableLoading: false,
      selectList: [],
      isHandle: true,
      appalyId: '',
      appalyName: ''
    };
  },
  watch: {
    tabActive() {
      this.dataList = [];
      this.uniId = "";
      this.positionId = "";
      this.groupId = "";
    },
    dataList: {
      deep: true,
      handler(newValue) {
        const _this = this;
        this.isHandle = false;
        newValue.forEach(itemA => {
          for (const itemB of _this.selectList) {
            if (itemA.id === itemB.id) {
              this.$nextTick(() => {
                _this.$refs.dataList.toggleRowSelection(itemA, true);
              });
            }
          }
        });
        this.$nextTick(() => (this.isHandle = true));
      }
    },
    current: {
      deep: true,
      handler(newValue) {
        this.inputList = [];
        if (typeof newValue === "object") {
          this.selectorList = [...newValue];
          // this.$nextTick(() => {
          //   const containerWidth =
          //       document.getElementById("inputContainer").clientWidth - 30;
          //   let widthTotal = 0;
          //   for (const index in newValue) {
          //     widthTotal +=
          //         document.getElementById(`tag${index}`).clientWidth + 4;
          //     if (widthTotal < containerWidth) {
          //       this.inputList.push(newValue[index]);
          //     } else {
          //       break;
          //     }
          //   }
          // });
          this.selectList = [...newValue];
        }
      }
    }
  },
  computed: {
    searchDisabled() {
      switch (this.tabActive) {
        case "本单位":
          return !(this.uniId && !!this.uniId);
        case "职位":
          return !(this.positionId && !!this.positionId);
        case "群组":
          return !(this.groupId && !!this.groupId);
        default:
          return true;
      }
    }
  },
  // created() {
  //   console.log(this.current)
  //   this.selectList = this.current
  // },
  methods: {
    cleanHandle() {
      this.selectorList = [];
      this.inputList = [];
      this.$emit("confirmHandle", this.selectorList);
    },
    dialogOpen() {
      this.tabActive = "本单位";
      this.selectList = this.current
      this.getOrganization();
      this.dialogVisible = true;
    },
    dialogClose() {
      this.dialogVisible = false;
      this.keywords = "";
      this.tabActive = "";
      this.dataList = [];
      this.selectList = [...this.selectorList];
    },
    getOrganization() {
      const data = {
        businesstype: 0,
        scenetype: 0,
        specvalue: {}
      };
      this.tabsLoading = true;
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
              if (res.data.data.titleinfo && res.data.data.titleinfo.length) {
                this.positionList = res.data.data.titleinfo;
              } else {
                this.positionList = [];
              }
              if (res.data.data.groupinfo && res.data.data.groupinfo.length) {
                this.groupList = res.data.data.groupinfo;
              } else {
                this.groupList = [];
              }
              this.dataList = [];
              this.tabsLoading = false;
            }
          })
          .catch(() => {
            this.uniList = [];
            this.dataList = [];
            this.positionList = [];
            this.groupList = [];
            this.tabsLoading = false;
          });
    },
    getArrayTree(arrList, id, pid, children = "children") {
      const map = [];
      arrList.forEach(item => {
        let up = arrList.filter(x => x[id] == item[pid]);
        let sit = arrList.filter(x => x[pid] == item[id]);
        if (sit.length) item[children] = sit;
        if (!(up.length && !sit.length)) map.push(item);
      });
      if (arrList.length == map.length) return map;
      else return this.getArrayTree(map, id, pid);
    },
    selectTreeNode(node) {
      this.uniId = node.id;
      this.getDataList("", 0, node.id);
    },
    getDataList(keywords, type, id) {
      const data = {
        businesstype: 0,
        scenetype: 0,
        specvalue: {
          username: keywords || ""
        },
        type: type || 0,
        id: id || "",
        current: 1,
        size: 10
      };
      this.tableLoading = true;
      getUserData(data)
          .then(res => {
            if (res.data && res.data.status == 0) {
              this.dataList = res.data.data.records;
            } else {
              this.dataList = [];
            }
            this.tableLoading = false;
          })
          .catch(() => {
            this.dataList = [];
            this.tableLoading = false;
          });
    },
    paginationCurrentChange(size) {
      this.currentPage = size;
      this.getDataList();
    },
    dataListRowClick(row) {
      this.$refs.dataList.toggleRowSelection(row);
    },
    positionRowClick(row) {
      this.positionId = row.titleid;
      this.getDataList("", 1, row.titleid);
    },
    groupRowClick(row) {
      this.groupId = row.id;
      this.getDataList("", 2, row.id);
    },
    dataListSelectionChange(val) {
      if (this.isHandle) {
        const list = [];
        // 取消勾选与删除
        this.dataList.forEach(itemA => {
          let count = 0;
          for (const itemB of val) {
            if (itemA.id === itemB.id) {
              count += 1;
              break;
            }
          }
          if (!count) {
            list.push(itemA);
          }
        });
        list.forEach(itemA => {
          for (const indexB in this.selectList) {
            if (itemA.id === this.selectList[indexB].id) {
              this.selectList.splice(indexB, 1);
            }
          }
        });
        // 勾选与添加
        val.forEach(itemA => {
          if (
              this.selectList.filter(itemB => itemB.id === itemA.id).length === 0
          ) {
            this.selectList.push(itemA);
          }
        });
      }
    },
    deleteHandle(scope) {
      if (scope && scope.row) {
        this.selectList.splice(scope.$index, 1);
        for (const item of this.dataList) {
          if (item.id === scope.row.id) {
            this.$refs.dataList.toggleRowSelection(item, false);
            break;
          }
        }
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
      if (this.appalyId !== '') {
        this.selectorList = this.selectorList.map(item => {
          item.issueName = this.appalyName
          item.name = item.fullname
          return item
        })
      }
      const data = {
        selectList: this.selectList,
        appalyId: this.appalyId
      }
      this.$emit("confirmHandle", data);
      this.keywords = "";
      this.tabActive = "";
      this.dataList = [];
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.selector-container {
  width: 100%;
  max-width: 100%;
  height: 40px;

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
    /*height: 400px;*/
    ::v-deep .el-tabs__item {
      user-select: none;
    }

    .dialog-left {
      min-width: 300px;
      max-width: 300px;
      width: 300px;

      ::v-deep .el-tabs {
        display: flex;
        flex-direction: column;
        height: 100%;

        ::v-deep .el-tabs__content {
          flex: 1;
          overflow-y: auto;

          .el-tab-pane {
            height: 100%;
          }
        }
      }
    }

    .dialog-right {
      display: flex;
      flex: 1;
      box-sizing: border-box;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 10px;
      margin-left: 10px;
      width: calc(100% - 310px);

      &-left {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        margin-right: 10px;
        /*flex: 1;*/
        width: calc(100% - 310px);

        .filter-container {
          display: flex;
          align-items: center;

          span {
            width: 70px;
            text-align: right;
          }

          ::v-deep .el-input {
            margin-right: 6px;
          }

          ::v-deep .el-button--small {
            padding: 9px 15px !important;
          }
        }

        .table-container {
          margin-top: 10px;
          width: 100%;
        }

        ::v-deep .el-pagination {
          text-align: right;
        }
      }

      &-right {
        min-width: 300px;
        max-width: 300px;
        width: 300px;
        margin-top: 42px;
      }
    }
  }
}

::v-deep .el-table {
  max-height: 345px;
}

::v-deep .el-table__body-wrapper,
::v-deep .el-tabs__content {
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

::v-deep .table-checked-cell {
  display: block;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #f5f7fa;
}
</style>
