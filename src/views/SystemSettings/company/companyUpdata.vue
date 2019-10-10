<template>
  <div class="fn-form companyForm">
    <el-form :inline="true" label-width="90px" size="mini" :model="data" :rules="rules" ref="dataForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业序码" prop="code">
            <el-input type="text" v-model="data.code" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业名称" prop="name">
            <el-input type="text" v-model="data.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="平台名称" prop="groupName">
            <el-input type="text" v-model="data.groupName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="企业地址" prop="address">
            <el-input @focus="editPlace" type="text" v-model="data.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="合同有效期">
            <el-input type="text" v-model="data.expireDate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="平台状态">
            <el-select v-model="data.status" placeholder="请选择" disabled>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
              <el-option label="冻结" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="企业logo">
        <cropper ref="cropper" :imgUrl="data.logoUrl"></cropper>
        <!-- <tooltips content="支持JPG、JPEG、PNG、BMP格式图片小于10M|最大尺寸100*74"></tooltips> -->
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人" prop="linkMan">
            <el-input type="text" v-model="data.linkMan"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="联系电话" prop="linkPhone">
            <el-input type="text" v-model="data.linkPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label=" ">
            <el-button type="primary" size="mini" @click="submit('dataForm')">提交</el-button>
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
  import {status} from '@/utils/index'
  import cropper from '@/components/cropper'
  import JtDialog from '@/components/JtDialog'
  import axios from 'axios'

  export default {
    components: {tooltips, cropper, JtDialog},
    data() {
      return {
        url:'upload/image/org/logo',
        data: {},
        rules: {
          code: [
            { required: true, message: '请输入企业序码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' }
          ],
          groupName: [
            { required: true, message: '请输入平台名称', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入企业地址', trigger: 'blur' }
          ],
          expireDate: [
            { required: true, message: '请输入活动有效期', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择平台状态', trigger: 'change' }
          ],
          linkMan: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          linkPhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ]
        },
        imageUrl: require('@/assets/images/upload_default.png'),
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
        searchList: []
      };
    },
    methods: {
      handlePictureCardPreview(file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      submit(formName) {
         this.$refs[formName].validate((valid) => {
           if(valid){
              // 提交裁剪图片
            this.$refs.cropper.cutting((logoUrl) => {
              this.data.logoUrl = logoUrl;
              this.getData('/org/group/update', 'post', this.data, true);
            });

            /** 提交信息 **/
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
      this.getData('/org/group/get', 'post', {id: this.$store.getters.id}).then(res => {
        //判断是否存在经纬点
        if (res.data.latitude&&res.data.longitude) {
          this.val.point = {
            lng: res.data.longitude,
            lat: res.data.latitude,
            name: res.data.address,
          }
        }
        res.data.expireDate = datetime(res.data.expireDate)
        this.data = res.data
        if (res.data.logoUrl != "") {
          this.imageUrl = res.data.logoUrl
          // console.log('---------',window.localStorage.getItem('logoUrl'));
        }
      }).catch(error => {
        console.log(error)
      })
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .companyForm {
    .el-form-item__label {
      font-size: 12px;
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


