<template>
    <div class="tree_main">
        <div class="flex_layout">
            <!--部门选择-->
            <div class="tree_left">
                <div class="tree_title">部门选择</div>
                <div class="tree_info">
                    <el-scrollbar wrapClass="el-scrollbar__change" style="height: 100%">
                        <div class="tree_leftTree">
                            <el-tree :data="treeData" show-checkbox :load="loadNode" node-key="id" lazy accordion
                                     @check-change=checkedData :default-checked-keys="this.selectData" ref="tree"
                                     :check-strictly="true">
                                <template slot-scope="{ node, data }">
                                    <div :title="data.title" class="form_limit">{{data.title}}</div>
                                </template>
                            </el-tree>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <!--选择结果-->
            <div class="tree_right">
                <div class="tree_title">选择结果</div>
                <div class="tree_info">
                    <el-table :data="selectData" stripe style="width: 100%;height: 100%">
                        <el-table-column label="已选" prop="title" min-width="120"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <div class="form_operation">
                                    <div title="删除" @click="delect(scope.$index,scope.row.id)">
                                        <img src="../../assets/images/icon/delete.png" alt="">
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="tree_footer text_right">
            <el-button type="primary" @click="save">确定</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
    </div>
</template>

<script>
    import {getTreeDataByDemid, saveDoShareIssue} from '@/api/components/share'

    export default {
        name: "shareTree",
        data() {
            return {
                treeData: [],//树数据
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                selectData: [],//选中数据
            }
        },
        props:{
            showID:{
                type:Object,
                required: true
            }
        },
        created() {
            this.getData();
        },
        methods: {
            //获取组织树
            getData() {
                let data = {
                    id: 1001,
                    demId: 1
                }
                getTreeDataByDemid(data).then(res => {
                    this.treeData = res.data;
                })
            },
            //子节点懒加载
            loadNode(node, resolve) {
                if (node.level > 0) {
                    let data = {
                        id: node.data.id,
                        demId: 1
                    }
                    getTreeDataByDemid(data).then(res => {
                        const data = res.data
                        resolve(data)
                    })
                }
            },
            //复选框点击事件
            checkedData(data, checked, indeterminate) {
                let nodes = this.$refs.tree.getCheckedNodes().concat(this.$refs.tree.getHalfCheckedNodes())
                this.selectData = nodes;
            },
            //删除事件
            delect(index, id) {
                this.$refs.tree.setChecked(id, false);//取消左侧复选框的选中状态
                this.selectData.splice(index, 1)//从selectData中删除数据
            },
            //保存
            save() {
                let arr = [];
                for (let i = 0; i < this.selectData.length; i++) {
                    arr.push(this.selectData[i].id);
                }
                let data = {
                    shareDeptIds: arr.toString(),
                    issueId: this.showID.id,
                    shareType: '1',
                }
                saveDoShareIssue(data).then(res => {
                    if (res.data.status == 0) {
                        this.$message.success(res.data.msg);
                        this.$emit('SaveData')
                    }else if(res.data.status == 1){
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //取消
            cancel() {
                this.$emit("cancel");
            }
        },
        //监听id的变化
        watch: {
            showID: {
                handler(newValue, oldValue) {
                    if(newValue !== oldValue){
                        this.showID = newValue;
                        this.getData();
                        this.selectData = [];
                    }
                },
            }
        }
    }
</script>

<style scoped lang="scss">
    .tree_main {

        .tree_left, .tree_right {
            width: 50%;
            box-sizing: border-box;

            .tree_title {
                font-size: 15px;
                padding-bottom: 16px;
            }

            .tree_info {
                height: 400px;
                border: 1px solid #efefef;
                padding: 16px;
                overflow: hidden;
                box-sizing: border-box;
            }
        }

        .tree_left {
            padding-right: 8px;
        }

        .tree_right {
            padding-left: 8px;
        }

        .tree_footer {
            padding-top: 16px;
        }
    }
</style>