<template>
  <div class="jt-org-select">
    <el-select class="treeOption" id="treeOption" :style="{'width':width?width:'193'}" v-model="val.orgValue"
               :placeholder="val.placeholder">
      <el-option :value="nodeIds">
        <slot>
            <span style="float: left;height:100%">
              <el-tree
                :data="orgData"
                node-key="id"
                ref="orgMoreTree"
                show-checkbox
                check-strictly
                :default-checked-keys="nodeIds"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @check="moreCheck"
              >
              </el-tree>
            </span>
        </slot>
      </el-option>
    </el-select>

  </div>
</template>

<script>
  export default {
    name: 'JtOrgSelect',
    props: ['width'],
    // 'nodeIds',
    data() {
      return {
        nodeIds:[],
        val: {
          placeholder: '请选择上级机构/部门',
          label: '所属机构/部门',
          selectisShow: false,
          ids: [],
          orgValue: '',
          disabled: false,
          data: []
        },
        latOrgData: [],
        orgData: [],
        moreData: []
      }
    },
    watch: {
      filterText(val) {
        this.$refs.orgTree.filter(val)
      }
    },
    created(){
      this.$bus.$on('nodeIdsFuc',(val,orgNames)=>{
        if(val){
          this.$refs.orgMoreTree.setCheckedKeys([])
          this.nodeIds=val
          this.moreData=[]
          this.val.ids = val
          this.val.orgValue = ''
          this.$refs.orgMoreTree.setCheckedKeys(val)
          this.val.orgValue=orgNames
        }else {
          this.val.orgValue = ''
          this.$refs.orgMoreTree.setCheckedKeys([])
        }
      })
    },
    mounted() {
      this.getTreeData()
    },
    methods: {
      /**
       * 获取树节点数据
       */
      getTreeData() {
        this.getData('/org/tree', 'post').then(res => {
          this.orgData = JSON.stringify(res.data)
          this.orgData = this.orgData.replace(/childList/g, 'children')
          this.orgData = this.orgData.replace(/name/g, 'label')
          this.orgData = JSON.parse(this.orgData)
        }).catch(error => {
          console.log(error)
        })
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
       * @param arr 需要去重的数组
       */
      removeDuplicatedItem(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
              arr.splice(j, 1);//console.log(arr[j]);
              arr.splice(i, 1);
              j--;
            }
          }
        }
        return arr;
      },
      /**
       * 节复选框被点击的时候触发
       * @param val 该节点所对应的对象
       * @param allData 树目前的选中状态对象
       */
      moreCheck(val, allData) {
        this.val.ids = []
        this.val.orgValue = ''
        this.$refs.orgMoreTree.setCheckedKeys([])
        this.moreData.push(val)
        this.moreData = this.removeDuplicatedItem(this.moreData)
        var arr = []
        for (var i = 0; i < this.moreData.length; i++) {
          arr.push(this.moreData[i].id)
          this.$refs.orgMoreTree.setCheckedKeys(arr)
        }
        this.$nextTick(() => {
          for (var j = 0; j < this.moreData.length; j++) {
            this.val.ids.push(this.moreData[j].id)
            if (j === (this.moreData.length - 1)) {
              this.val.orgValue += this.moreData[j].label
            } else {
              this.val.orgValue += this.moreData[j].label + '，'
            }
          }
          this.$emit('moreCheck', this.val.ids)
        })
      }
    }
  }
</script>
<style scoped>
  .el-select-dropdown__item {
    padding: 10px;
    height: 100%;
  }

  .el-select-dropdown__item.hover {
    background-color: #fff;
  }

  .fileInput {
    width: 193px;
  }

  .fileInput > input {
    width: 150px;
  }

  .el-input-group__append {
    padding: 0px 18px 0px 5px;
    width: 40px;
    background-color: #409EFF;
  }

  .el-button {
    width: 40px;
  }

  .el-icon-search {
    color: white;
  }
</style>
<style rel="stylesheet/scss" lang="scss">

</style>
