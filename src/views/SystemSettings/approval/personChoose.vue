<template>
  <div class="personChoose">
    <el-form label-position="right" class="personForm" ref="personForm" :model="personForm">
      <div class="choosePeople">
        <div>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText" size="mini">
          </el-input>
          <el-tree
            class="filter-tree"
            :data="orgData"
            node-key="id"
            default-expand-all
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            ref="tree2">
          </el-tree>
        </div>
        <div>
          <p style="font-size: 14px">已选人员</p>
          <p style="margin-top: 20px">
            <el-tag
              :key="tag.id"
              v-for="tag in dynamicTags1"
              closable
              :filter-node-method="filterNode"
              :disable-transitions="false"
              @close="handleClose(tag.id)">
              {{tag.name}}
            </el-tag>
          </p>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "personChoose",
    data() {
      return {
        personForm: {},
        dynamicTags1: [],
        orgData: [],
        filterText: ''
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    created(){
      this.$bus.$on('personSure',()=>{
        this.dynamicTags1=[]
      })
      this.$bus.$on('personSure1',()=>{

        this.dynamicTags1=[]
      })


    },
    mounted() {
      this.getTreeData()
    },
    methods: {
      closeDialog() {
      },
      personFuc() {
      },
      handleClose(){
        this.dynamicTags1=[]
      },
      /**
       *  过滤树形数据
       * @param value 过滤输入的值
       * @param data 过滤返回的数据
       * @returns {boolean} 返回值有无判断
       */
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      /**
       * 点击当前节点
       * @param data 当前节点数据
       */
      handleNodeClick(data) {
        this.dynamicTags1=[]
        this.dynamicTags1.push({
          name:data.label,
          id:data.id
        })
        this.personForm=this.dynamicTags1[0]

      },
      /**
       * 获取树节点数据
       */
      getTreeData() {
        this.getData('/auditflow/getAuditManList', 'post').then(res => {
          let data=JSON.stringify(res.data.userList)
          data=data.replace(/realName/g, 'label')
          data=JSON.parse(data)
          this.orgData.push({
            label:res.data.orgName,
            children:data
          })
        }).catch(error => {
          console.log(error)
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .personChoose {
    .personForm {
      .choosePeople {
        width: 100%;
        overflow: hidden;
        padding-bottom: 20px;
        .el-tag {
          margin-right: 10px;
        }
        & > div {
          float: left;
        }
        & > div:nth-child(1) {
          width: 250px;
          padding-right: 30px;

          border-right: 1px solid rgb(220, 231, 238);
        }
        & > div:nth-child(2) {
          padding-left: 30px;
          width: 350px;
        }
      }
      .filter-tree {
        max-height: 300px;
        margin-top: 20px;
        max-width: 220px;
        overflow-x: auto;
        overflow-y: auto;
        /*滚动条样式*/
        &::-webkit-scrollbar { /*滚动条整体样式*/
          width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
        }
        &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }
        &::-webkit-scrollbar-track { /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
      }

    }
  }

</style>
