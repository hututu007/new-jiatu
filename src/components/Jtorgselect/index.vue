<template>
  <div class="jt-org-select">
    <el-select ref="mySelect" class="treeOption" id="treeOption" :disabled="disabled" :style="{'width':width?width:'193'}" v-model="val.orgValue" :placeholder="val.placeholder">
      <el-option :value="nodeId">
        <slot>
            <span style="float: left;height:100%">
              <!--<el-input class="fileInput" placeholder="输入关键字进行过滤" v-model="filterText">-->
              <!--<el-button slot="append" icon="el-icon-search" class="fileInputIcon"></el-button>-->
              <!--</el-input>-->
              <el-tree
                :data="orgData"
                node-key="id"
                ref="orgTree"
                @node-click="handleNodeClick"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @current-change="current"
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
    props: ['nodeId', 'width', 'disabled'],
    data() {
      return {
        optionShow: false,
        val: {
          placeholder: '请选择上级机构/部门',
          label: '所属机构/部门',
          selectisShow: false,
          id: '',
          orgValue: '',
          disabled: false,
          data: []
        },
        orgData: [],
        filterText: '',
        orgString: [],
        latOrgData: [],
        orgValue: '',
        orgInputId: this.nodeId
      }
    },
    watch: {
      filterText(val) {
        this.$refs.orgTree.filter(val)
      },
      nodeId(val) {
        console.log(val+'----')
        this.orgString = []
        this.orgInputId = val
        this.getTreeData()
      }
    },
    mounted() {
      this.getTreeData()
    },
    methods: {
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
       * 获取树节点数据
       */

      getTreeData() {
        this.getData('/org/tree', 'post').then(res => {
          this.orgData = JSON.stringify(res.data)
          this.orgData = this.orgData.replace(/childList/g, 'children')
          this.orgData = this.orgData.replace(/name/g, 'label')
          this.orgData = JSON.parse(this.orgData)
          this.latOrgData = this.orgData[0]
          this.traverseTree(this.latOrgData)
          this.orgValue = ''
          for (var j = 0; j < this.orgString.length; j++) {
            this.orgValue += this.orgString[j].label + '/'
          }
          this.val.orgValue = this.orgValue.substr(0, this.orgValue.length - 1)
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 点击当前节点
       * @param data 当前节点数据
       */
      handleNodeClick(data) {
        this.$emit('orgNodeClick', data)
      },
      /**
       * 选择节点所有上级
       * @param obj 当前node数据
       * @param obj1 当前节点数据
       */
      getParent(obj, obj1) {
        if (!obj1) {
          obj1 = []
        }
        if (obj.parent) {
          obj1[obj.level] = obj
          this.getParent(obj.parent, obj1)
        }
        return obj1
      },
      /**
       * 选择节点 构建下拉框显示字符串
       * @param old 当前节点数据
       * @param news 当前节点node对象
       */
      current(old, news) {
        this.$refs.mySelect.handleClose()
        let temp = this.getParent(news)
        let str = ''
        for (var k in temp) {
          if (typeof temp[k]=='object') {
            str += temp[k].data.label + '/'
          }
        }
        this.val.orgValue = str.replace(/\/$/, '')
        this.val.id = old.id
        // this.nodeID = old.id
        this.val.selectisShow = false
        this.$emit('orgCurrent', this.val)
      },
      /**
       * 根据id得到树节点详细信息绑定到input框
       */
      traverseTree(node) {
        // 递归遍历机构id串
        if (!node) {
          return
        }
        if (node.id === this.orgInputId) {
          this.orgString.unshift(node)
          this.orgInputId = node.parentId
          this.traverseTree(this.latOrgData)
        }
        if (node.children && node.children.length > 0) {
          var i = 0
          for (i = 0; i < node.children.length; i++) {
            this.traverseTree(node.children[i])
          }
        }
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
