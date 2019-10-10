<template>
  <el-cascader
    :options="options"
    @active-item-change="handleItemChange"
    :props="props"
    style="width:193px"
    ref="modelBox"
    v-model="modelvalue"
    filterable
  ></el-cascader>
</template>

<script>
  export default {
    props: ['modelIds'],
    data() {
      return {
        modelvalue: [],
        options: [],
        props: {
          value: 'brandId',
          label: 'brandName',
        },
      };
    },
    methods: {
      // 车型车款分级查询
      handleItemChange(val) {
        if (val.length == 1) {
          for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].brandId == val[0]) {
              this.getData('car/model/getCarType', 'post', {brandId: val[0]}).then(res => {
                let list = res.data;
                list = JSON.stringify(list)
                list = list.replace(/typeName/g, 'brandName')
                list = list.replace(/brandId/g, 'brId')
                list = list.replace(/typeId/g, 'brandId')
                list = JSON.parse(list)
                for (let j = 0; j < list.length; j++) {
                  list[j].children = [];
                }
                this.options[i].children = list;
                // 更新视图
                this.options.splice(-1, 1, '0');
              })
              return;
            }
          }
        } else if (val.length == 2) {
          for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].brandId == val[0]) {
              const list = this.options[i].children;
              for (let j = 0; j < list.length; j++) {
                if (list[j].brandId == val[1]) {
                  this.getData('car/model/getCarModel', 'post', {typeId: val[1]}).then(res => {
                    let listChild = res.data;
                    listChild = JSON.stringify(listChild)
                    listChild = listChild.replace(/modelName/g, 'brandName')
                    listChild = listChild.replace(/brandId/g, 'brId')
                    listChild = listChild.replace(/modelId/g, 'brandId')
                    listChild = JSON.parse(listChild)
                    this.options[i].children[j].children = listChild;
                    // 更新视图
                    this.options.splice(-1, 1, '0');
                  })
                  return;
                }
              }
            }
          }
        } else if (val.length == 3) {
          for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].brandId == val[0]) {
              this.getData('car/model/getCarType', 'post', {brandId: val[0]}).then(res => {
                let list = res.data;
                list = JSON.stringify(list)
                list = list.replace(/typeName/g, 'brandName')
                list = list.replace(/brandId/g, 'brId')
                list = list.replace(/typeId/g, 'brandId')
                list = JSON.parse(list)
                for (let j = 0; j < list.length; j++) {
                  list[j].children = [];
                }
                this.options[i].children = list;
                for (let j = 0; j < list.length; j++) {
                  if (list[j].brandId == val[1]) {
                    this.getData('car/model/getCarModel', 'post', {typeId: val[1]}).then(res => {
                      let listChild = res.data;
                      listChild = JSON.stringify(listChild)
                      listChild = listChild.replace(/modelName/g, 'brandName')
                      listChild = listChild.replace(/brandId/g, 'brId')
                      listChild = listChild.replace(/modelId/g, 'brandId')
                      listChild = JSON.parse(listChild)
                      this.options[i].children[j].children = listChild;
                      // 更新视图
                      this.options.splice(-1, 1, '0');
                    })
                  }
                }
                // 更新视图
                this.options.splice(10000, 1, '0');
              })
              return;
            }
          }
        }
        
      },
     
      getOptions(){
        this.getData('car/model/getCarBrand', 'post').then(res => {
          this.options = res.data;
          for (let i = 0; i < res.data.length; i++) {
            this.options[i].children = [];
          }
          if (this.modelvalue) {
            this.handleItemChange(this.modelvalue);
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    watch: {
      modelvalue(val) {
        this.$emit('modeChangeode', val)
      }
    },
    created() {
      this.$bus.$on('carModelGet', (val) => {
        this.modelvalue = val
        if (this.modelvalue) {
          this.handleItemChange(this.modelvalue);
        }
      })
      // this.value = this.modelIds;
     this.getOptions()
    }
  }
</script>

<style>

</style>


