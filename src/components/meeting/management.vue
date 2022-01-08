<template>
    <div class="management_info">
        <div class="management_btn pb-16">
            <button type="button" class="btn btn_blue"><span>批量撤回</span></button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%;height: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="会议名称" prop="datas.meetInfo.meetName" min-width="150"></el-table-column>
            <el-table-column label="会议时间" prop="datas.meetInfo.meetTime" :formatter="meetTime"></el-table-column>
            <el-table-column label="会议地点" prop="datas.meetInfo.meetLocate"></el-table-column>
            <el-table-column label="发起部门" prop="datas.meetInfo.createDept"></el-table-column>
            <el-table-column label="送达时间" prop="datas.meetInfo.createTime" :formatter="createTime"></el-table-column>
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

</template>

<script>
    import {managenmentData} from "@/api/components/share";
    import {dateFormat} from '@/assets/js/public'

    export default {
        name: "management",
        data() {
            return {
                tableData:'',
            }
        },
        props: {
            obtainId: {
                type: Object,
                required: true
            }
        },
        created() {
            this.getData()
        },
        methods: {
            getData(){
                let data ={
                    page: 1,
                    rows: 10
                }
                managenmentData(this.obtainId,data).then(res=>{
                    this.tableData = res.data.rows
                })
            },
            //格式化
            meetTime(row){
                return dateFormat(row.datas.meetInfo.meetTime);
            },
            createTime(row){
                return dateFormat(row.datas.meetInfo.createTime);
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
        },
        watch: {
            obtainId: {
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

<style scoped lang="scss">

</style>