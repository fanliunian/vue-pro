<template>
    <div class="share_main">
        <div class="show_btn">
            <button class="btn btn_blue" @click="newShare">添加</button>
            <button class="btn btn_blue" @click="delect(multipleSelection)">批量取消</button>
        </div>
        <div class="show_table">
            <el-table :data="tableData" stripe style="width: 100%;height: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="共享部门" prop="sharedDept" min-width="150"></el-table-column>
                <el-table-column label="共享时间" prop="shareTime" :formatter="shareTime"></el-table-column>
                <el-table-column label="共享状态" prop="shareStatus">
                    <template slot-scope="scope">
                        <div v-if="scope.row.shareStatus == 'shared'">共享中</div>
                    </template>
                </el-table-column>
                <el-table-column label="共享操作">
                    <template slot-scope="scope">
                        <div class="form_operation">
                            <div title="取消共享" @click="delect(scope.row)">
                                <img src="../../assets/images/icon/delete.png" alt="">
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--共享表格树-->
        <el-dialog title="共享" :visible.sync="shareShow" width="700px" append-to-body @close="cancel" >
            <shareTree :showID="showID" @cancel="cancel($event)" @SaveData="SaveData($event)"></shareTree>
        </el-dialog>
        <!--确定按钮-->
        <div class="show_footerbtn text_right">
            <el-button type="primary" @click="ShowClose">确定</el-button>
            <el-button @click="ShowClose">取消</el-button>
        </div>
    </div>
</template>

<script>
    import {dateFormat} from '@/assets/js/public'
    import {getlistJson, delectshareData} from '@/api/components/share'
    import shareTree from './shareTree'

    export default {
        name: "showindex",
        data() {
            return {
                tableData: [],//共享表单数据
                shareShow: false,//组织树弹窗
                multipleSelection: [],//批量删除
            }
        },
        components: {
            shareTree
        },
        props: {
            showID: {
                type: Object,
                required: true
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                let data = {
                    page: 1,
                    rows: 10
                }
                getlistJson(this.showID, data).then(res => {
                    this.tableData = res.data.rows
                })
            },
            //格式化
            shareTime(row) {
                return dateFormat(row.shareTime);
            },
            //添加新共享
            newShare() {
                this.shareShow = true;
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
                    this.$confirm('此操作将永久取消分享, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let data = {"recordId": arr.toString()}
                        delectshareData(data).then(res => {
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
            //议题库共享
            //保存
            SaveData() {
                this.cancel();
                this.getData();
            },
            //取消
            cancel() {
                this.shareShow = false;
            },
            //关闭共享表格
            ShowClose() {
                this.$emit('ShowClose')
            }
        },
        watch: {
            showID: {
                handler(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        this.showID = newValue;
                        this.getData();
                    }
                },
            }
        }
    }
</script>

<style lang="scss" scoped>
    .show_btn {
        padding-bottom: 16px;

        .btn {
            &:first-child {
                margin-left: 0;
            }
        }
    }

    .show_footerbtn {
        padding-top: 16px;
    }
</style>