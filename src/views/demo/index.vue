<template>
    <div class="app-container" style="height: 200px;width: 500px">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-button plain :disabled="increase>2" @click="increaseAction">加1</el-button>
            </el-col>
            <el-col :span="6">{{increase}}</el-col>
            <el-col :span="6">
                <el-tag   v-if="increase>0 && increase!==0">当前是正数</el-tag>
                <el-tag   v-if="increase===0">当前是0</el-tag>
                <el-tag   v-if="increase<0 && increase!==0">当前是负数</el-tag>
            </el-col>
            <el-col :span="6">
                <el-button round :disabled="increase<-2" @click="decreaseAction">减1</el-button>
            </el-col>
        </el-row>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                increase: 0
            }
        },
        methods: {
            increaseAction() {
                this.increase = this.increase+1
            },
            decreaseAction() {
                this.increase = this.increase-1
            }
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>