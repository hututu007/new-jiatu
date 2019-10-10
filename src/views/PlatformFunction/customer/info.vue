<template>
  <div class="fn-form customerForm">
    <el-form :inline="true" label-width="90px" size="mini">
      <el-row v-if="data.code">
        <el-col :span="8">
          <el-form-item label="企业序码">
            <el-input type="text" v-model="data.code" :disabled="true" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业名称">
            <el-input type="text" v-model="data.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="平台名称">
            <el-input type="text" v-model="data.groupName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业地址">
            <el-input @focus="editPlace" type="text" v-model="data.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="合同有效期">
            <el-date-picker
              :disabled="disabled1"
              v-model="data.expireDate"
              type="date"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="平台状态">
            <el-select v-model="data.status" placeholder="请选择" :disabled="disabled2">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
              <el-option label="冻结" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="企业logo">
            <cropper ref="cropper" :imgUrl="data.logoUrl"></cropper>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人">
            <el-input type="text" v-model="data.linkMan"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="联系电话">
            <el-input type="text" v-model="data.linkPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label=" ">
            <el-button type="primary" size="mini" @click="submit">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <div class="cp-top">
          <span>搜索地址：</span>
          <input placeholder="输入地点或在地图选点" @keyup="keySearch(val.companyPlace)" v-model="val.companyPlace">
          <div v-show="searchListShow" class="searchList" id="myPanel">
            <ul>
              <li @click="liClick(val)"  v-for="(val, index) in searchList" :key="val.id">{{index+'.'+ '&nbsp;'+val.name}}</li>
            </ul>
          </div>
        </div>
        <div class="cp-map">
          <span>地图选点：</span>
          <div id="mapBox" style="width: 620px;height: 500px;"></div>
        </div>
        <div class="cp-bot">
          <el-button type="primary" size="mini" @click="savePlace">保存</el-button>
          <el-button size="mini" @click="dialogShow = false">取消</el-button>
        </div>
      </div>
    </jt-dialog>
  </div>
</template>
<script>
  import tooltips from "@/components/Tooltips"
  import {datetime} from '@/utils/filters'
  import cropper from '@/components/cropper'
  import {status} from '@/utils/index'
  import JtDialog from '@/components/JtDialog'
  export default {
    components: {tooltips, cropper, JtDialog},
    data() {
      return {
        data: {
          groupName:'',
          name:'',
          address:'',
          expireDate:'',
          status:'',
          linkMan:'',
          linkPhone:''
        },
        dialogShow: false,
        searchListShow: false,
        dialog: {
          title: '地图选点',
          width: '800px'
        },
        val: {
          companyPlace: '',
          point: {
            lng: null,
            lat: null,
            name: ''
          }
        },
        map: '',
        geoc: '',
        searchList: [],
        disabled1: false,
        disabled2: false,
        imageUrl: require('@/assets/images/upload_default.png')
      };
    },
    methods: {
      /**
       *  企业地图选点打开
       */
      editPlace() {
        this.dialogShow = true
        this.$nextTick(() => {
          this.cellMap()
        })
      },
      /**
       *  图片上传成功回调
       * @param file 图片文件
       */
      handlePictureCardPreview(file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      /**
       *  提交方法
       */
      submit() {
        // 提交裁剪图片
        this.$refs.cropper.cutting((logoUrl) => {
          this.data.logoUrl = logoUrl;
          if (this.data.id) {
            delete this.data.orgIds
            delete this.data.startTime
            delete this.data.endTime
            this.getData('/org/group/update', 'post', this.data, true)
          }else {
            this.getData('/org/group/add', 'post', this.data, true)
          }
        });
      },
      cellMap() {
        /** 初始化地图 **/
        this.map = new BMap.Map("mapBox");
        //有数据读数据
        if (this.val.point.lng&&this.val.point.lat) {
          let point = new BMap.Point(this.val.point.lng, this.val.point.lat)
          this.dorwPoint({point:point,name:this.val.point.name})
        }else {
          this.map.centerAndZoom(new BMap.Point(106.506447, 29.614564), 15); //默认重庆经纬度
        }
        this.map.enableScrollWheelZoom(true);
        this.map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
        this.geoc = new BMap.Geocoder();
        this.editRedPoint()
      },
      /**
       *  企业地图选点打开
       */
      editPlace() {
        this.dialogShow = true
        this.$nextTick(() => {
          this.cellMap()
        })
      },
      /**
       *  搜索地点
       */
      keySearch(val) {
        this.searchFuc(val)
        var sp = document.getElementById("myPanel");
        document.addEventListener('click', (e) => {
          if (!sp.contains(e.target)) {            //点击到了id为myPanel以外的区域
            this.searchListShow = false;
          }
        })
      },
      /**
       * 搜索地点具体方法
       */
      searchFuc(val) {
        this.searchList = []
        let _this = this
        var options = {
          onSearchComplete: function (results) {
            // 判断是否正确
            // _this.map.centerAndZoom(new BMap.Point(res.Br[0].point.lng, res.Br[0].point.lat), 15); // 中心点经纬度
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
              for (var i = 0; i < results.getCurrentNumPois(); i ++){
                _this.searchList.push({
                  name:results.getPoi(i).title + ", " + results.getPoi(i).address,
                  point:results.getPoi(i).point
                });
              }
            }
            if (_this.searchList.length > 0 && _this.searchList.length != null) {
              _this.searchListShow = true
            } else {
              _this.searchListShow = false
            }
          }
        }
        if (options) {
          var local = new BMap.LocalSearch(_this.map, options);
          local.search(val)
        }
      },
      /**
       * 点击搜索的地点列表
       * @param val 单个地点的数据
       */
      liClick(val) {
        this.searchListShow = false;
        this.dorwPoint(val)
        this.editRedPoint()
      },
      /**
       * 地图画点
       */
      dorwPoint(val) {
        this.val.point = {
          lng: val.point.lng,
          lat: val.point.lat,
          name: val.name
        }
        this.val.companyPlace = val.name
        this.map.centerAndZoom(val.point, 15);
        var marker = new BMap.Marker(val.point);  // 创建标注
        var label = new BMap.Label(("详细地址：" + val.name), {offset: new BMap.Size(20, -10)});
        label.setStyle({
          color: "#666",
          fontSize: "12px",
          height: "30px",
          lineHeight: "30px",
          padding: "0px 10px",
          fontFamily: "微软雅黑",
          border: "1px solid #dcdfe6"
        });
        marker.setLabel(label);
        this.map.addOverlay(marker);
      },
      /**
       * 点击地图选点
       */
      editRedPoint() {
        let that = this;
        this.map.addEventListener("click", function (e) {
          that.map.clearOverlays();
          that.geoc.getLocation(e.point, function (rs) {

            var addComp = rs.addressComponents;
            var place = addComp.city + addComp.district + addComp.street + addComp.streetNumber
            that.val.point = {
              lng: rs.point.lng,
              lat: rs.point.lat,
              name: place
            }

            that.dorwPoint({point:rs.point,name:place})
          })

        })
      },
      /**
       * 保存地点
       */
      savePlace() {
        this.data.latitude = this.val.point.lat;
        this.data.longitude = this.val.point.lng;
        this.data.address = this.val.point.name
        this.dialogShow = false
      }
    },
    created() {
      this.$bus.$on('editCustomer', (data) => {
        if (data.latitude&&data.longitude) {
          this.val.point = {
            lng: data.longitude,
            lat: data.latitude,
            name: data.address,
          }
        }
        this.disabled1 = false
        this.disabled2 = false
        data.expireDate = datetime(data.expireDate)
        this.data = data
        if (data.logoUrl != "") {
          this.imageUrl = data.logoUrl
        }
      })
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .customerForm {
    .el-form-item__label {
      font-size: 12px;
    }
    label {
      font-weight: 500;
    }
    .el-row {
      margin-bottom: 10px;
    }
    .el-input {
      width: 250px;
    }
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    .logoImg {
      width: 200px;
      height: 200px;
    }
    .upload {
      display: inline-block;
      .upload_btn {
        padding: 7px 8px;
        background: #fff;
        border: 1px solid #55a8fd;
        color: #55a8fd;
      }
    }
    .cp-top {
      width: 100%;
      margin-bottom: 20px;
      position: relative;
      .searchList {
        position: absolute;
        left: 72px;
        top: 32px;
        width: 217px;
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #dcdfe6;
        background-color: #fff;
        padding-bottom: 10px;
        border-radius: 4px;
        z-index: 10;
        ul {
          width: 100%;
          height: 100%;
        }
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
        li {
          width: 100%;
          overflow: hidden;
          height: 30px;
          font-size: 12px;
          color: #666;
          border-bottom: 1px dashed #dcdfe6;
          padding: 5px 10px;
          cursor: pointer;
        }
        li:hover {
          background-color: #eef7ff;
        }
      }
      input {
        width: 217px;
        height: 28px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 0 10px;
        font-size: 12px;
        outline: none;
      }
    }
    .cp-map {
      width: 100%;
      overflow: hidden;
      & > span {
        float: left;
      }
      #mapBox {
        border: 1px solid #dcdfe6;
        float: left;
      }
    }
    .cp-bot {
      width: 100%;
      height: 30px;
      margin: 30px 0px;
      text-align: center;
    }

  }
</style>


