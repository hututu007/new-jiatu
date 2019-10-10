<template>
  <div class="warning">
    <div class="warning-main">
      <jt-title :titData="warnTitData"></jt-title>
      <div class="userInfo">
        <el-row>
          <el-col :span="24">
            <div style="background-color: white;padding: 20px 0px;">
              <el-alert
                title="提示：您可以在此页面设置本机构或下属机构车辆行驶的报警规则。本机构在没有设置规则的前提下，将自动继承上级机构的设置"
                type="info"
                style="background-color: #fffae7;color: #feb57f"
                :closable="false"
                show-icon>
              </el-alert>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="warn-org">
              <jt-org-select ref="upOrgName" :nodeId="orgId"  @orgCurrent="orgCurrent2"></jt-org-select>
            </div>
          </el-col>
        </el-row>
        <ul class="main">
          <li>
            <div>超速预警</div>
            <div>
              <el-row :gutter="20">
                <el-col :span="20">
                  <div class="grid-content bg-purple">
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2"><span>高速公路</span></div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="超速速度定义">
                              <el-input v-model="overspeedForm.expresswayMph" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">公里/小时</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="超速持续时间选择">
                              <el-input v-model="overspeedForm.expresswayDuration" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">秒</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2"><span>快速公路</span></div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"   >
                            <el-form-item label="超速速度定义">
                              <el-input v-model="overspeedForm.fastroadMph" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">公里/小时</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"   >
                            <el-form-item label="超速持续时间选择">
                              <el-input v-model="overspeedForm.fastroadDuration" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">秒</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2"><span>普通公路</span></div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="超速速度定义">
                              <el-input v-model="overspeedForm.ordinaryhighwayMph" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">公里/小时</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="超速持续时间选择">
                              <el-input v-model="overspeedForm.ordinaryhighwayDuration" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">秒</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2">
                          <el-switch
                            v-model="overspeedForm.isspeech"
                            :active-value="1"
                            :inactive-value="0"
                            inactive-text="语音播报">
                          </el-switch>
                          <el-switch style="margin-left:20px"
                                     v-model="overspeedForm.enable"
                                     :active-value="1"
                                     :inactive-value="0"
                                     inactive-text="开启">
                          </el-switch>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2">
                          <el-button type="primary" size="mini" @click="overspeedSubmit">提交</el-button>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content "></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </li>
          <li>
            <div>疲劳驾驶预警</div>
            <div>
              <el-row :gutter="20">
                <el-col :span="2">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="20">
                  <div class="grid-content bg-purple">
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2"><span>疲劳驾驶时间条件设定</span></div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="白天连续驾驶时长">
                              <el-input v-model="fatiguedForm.dayDuration" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">分钟</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="夜晚连续驾驶时长">
                              <el-input v-model="fatiguedForm.nightDuration" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">分钟</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2"><span>疲劳驾驶里程条件设定</span></div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="疲劳驾驶里程">
                              <el-input v-model="fatiguedForm.fatiguedrivingMileage" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">公里</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2">
                          <el-switch
                            v-model="fatiguedForm.isspeech"
                            :active-value="1"
                            :inactive-value="0"
                            inactive-text="语音播报">
                          </el-switch>
                          <el-switch style="margin-left:20px"
                                     v-model="fatiguedForm.enable"
                                     :active-value="1"
                                     :inactive-value="0"
                                     inactive-text="开启">
                          </el-switch>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2">
                          <el-button type="primary" size="mini" @click="fatiguedSubmit">提交</el-button>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content "></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </li>
          <li>
            <div>怠速超长预警</div>
            <div>
              <el-row :gutter="20">
                <el-col :span="2">
                  <div class="grid-content bg-purple">
                  </div>
                </el-col>
                <el-col :span="20">
                  <div class="grid-content bg-purple">
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2"><span>怠速超长告警条件设定</span></div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                          <el-form :inline="true"  >
                            <el-form-item label="连续点火停留时长">
                              <el-input v-model="idlingForm.idlingDuration" placeholder="输入条件值" type='number'></el-input>
                            </el-form-item>
                            <el-form-item>
                              <span class="demonstration">分钟</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content  el-float-left">
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2">
                          <el-switch
                            v-model="idlingForm.isspeech"
                            :active-value="1"
                            :inactive-value="0"
                            inactive-text="语音播报">
                          </el-switch>
                          <el-switch style="margin-left:20px"
                                     v-model="idlingForm.enable"
                                     :active-value="1"
                                     :inactive-value="0"
                                     inactive-text="开启">
                          </el-switch>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content  el-float-left2">
                          <el-button type="primary" size="mini" @click="idlingSubmit">提交</el-button>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <div class="grid-content "></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtOrgSelect from '@/components/Jtorgselect'

  export default {
    components: {JtTitle, JtOrgSelect},
    data() {
      return {
        warnTitData: {
          typeName: 0,
          name: '预警参数设置',
          img: '',
          fucName: '',
          fuc: 0
        },

        orgId:'',
        //超速预警
        overspeedForm: {
          expresswayMph: '', // 高速公路限速
          expresswayDuration: '',  //高速公路超速限时
          fastroadMph: '', //快速公路限速
          fastroadDuration: '', // 快速公路超速限时
          ordinaryhighwayMph: '', // 普通公路限速
          ordinaryhighwayDuration: '',  // 普通公路超速限时
          isspeech: 1, // 是否语音播报 1是 0否
          enable: 1, // 是否启用 1是 0否
        },
        //疲劳驾驶预警
        fatiguedForm: {
          dayDuration: '', // 疲劳驾驶白天限时
          nightDuration: '', // 疲劳驾驶夜间限时
          fatiguedrivingMileage: '', // 疲劳驾驶里程
          isspeech: 1, // 是否语音播报 1是 0否
          enable: 1, // 是否启用 1是 0否
        },
        //怠速超长预警
        idlingForm: {
          idlingDuration: '', // 怠速时长
          isspeech: 1, // 是否语音播报 1是 0否
          enable: 1, // 是否启用 1是 0否
        },
        value4: true,
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      orgCurrent2(val) {
        this.orgId = val.id;
        this.getWarn();
      },
      //超速预警
      overspeedSubmit() {
        if (this.orgId=="") {
          this.$message({
            showClose: true,
            message: '请先选择机构/部门',
            type: 'warning'
          });
          return;
        }
        
        let overspeedForm = {}
        for(let key in this.overspeedForm){
          if (this.overspeedForm[key]||this.overspeedForm[key]===0) {
          overspeedForm[key] = this.overspeedForm[key];
          }
        }
        overspeedForm.orgId = this.orgId;
        this.getData('/earlywarn/overspeed/submit', 'POST', overspeedForm , true).then(()=>{
          this.getWarn();
        });
      },
      //疲劳驾驶预警
      fatiguedSubmit() {
        if (this.orgId=="") {
          this.$message({
            showClose: true,
            message: '请先选择机构/部门',
            type: 'warning'
          });
          return;
        }
        let fatiguedForm = {}
        for(let key in this.fatiguedForm){
          if (this.fatiguedForm[key]||this.fatiguedForm[key]===0) {
          fatiguedForm[key] = this.fatiguedForm[key];
          }
        }
        fatiguedForm.orgId = this.orgId;
        this.getData('/earlywarn/fatigueddriving/submit', 'POST', fatiguedForm , true).then(()=>{
          this.getWarn();
        });;
      },
      //怠速超长预警
      idlingSubmit() {
        if (this.orgId=="") {
          this.$message({
            showClose: true,
            message: '请先选择机构/部门',
            type: 'warning'
          });
          return;
        }
         let idlingForm = {}
        for(let key in this.idlingForm){
          if (this.idlingForm[key]||this.idlingForm[key]===0) {
          idlingForm[key] = this.idlingForm[key];
          }
        }
        idlingForm.orgId = this.orgId;
        this.getData('/earlywarn/idling/submit', 'POST', idlingForm , true).then(()=>{
          this.getWarn();
        });
      },
      getWarn() {
        this.getData('/earlywarn/getWarn', 'POST', {orgId: this.orgId} ).then(res=>{
          if (res.data[0].overspeedWarn!=null) {
            this.overspeedForm = res.data[0].overspeedWarn;
          }
          if (res.data[1].fatigueddrivingWarn!=null) {
            this.fatiguedForm = res.data[1].fatigueddrivingWarn;
          }
          if (res.data[2].idlingWarn!=null) {
            this.idlingForm = res.data[2].idlingWarn;
          }
        });
      }
    },
    created() {
      this.orgId = parseInt(this.$store.getters.orgId)
      console.log(this.$store.getters.orgId);
      this.getWarn()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .warning {
    .el-input__inner {
      line-height: 1;
    }
    width: 100%;
    padding: 20px;
    .warning-main {
      background-color: white;
      padding-bottom: 75px;
      .userInfo {
        padding: 10px 20px;
        .warn-org {
          width: 100%;
          height: 110px;
          padding-top: 10px;
          border-bottom: 0px dashed rgb(220, 231, 238);
          text-align: center;
          .jt-org-select {
            #treeOption {
              width: 400px;
            }
          }
        }
      }
      .main {
        padding-left: 60px;
        .el-float-left2{
          font-size: 14px;
          color: #333;
        }
        .el-row {
          padding-bottom: 20px;
          .el-form-item__label {
            font-size: 12px;
            color: #666;
            font-weight: normal;
          }
          .el-switch__label{
            color: #333;
          }
          .demonstration{
            font-size: 12px;
            color: #666;
          }
          .el-input__inner{
            height: 28px;
            font-size: 12px;
          }
        }
        &>li{
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: 1px dashed rgb(220, 231, 238);
          &>div:nth-child(1){
            height: 100%;
            float: left;
            width: 50px;
            font-size: 14px;
            padding: 0px 18px;
            display: flex;
            color: #666;
            align-items: center;
            background-color: #f5f7fa;
            /*#f2f7ff*/
          }
          &>div:nth-child(2){
            float: left;
            height: 100%;
            padding-left: 30px;
            width: calc(100% - 50px);
            padding-top: 20px;
          }
        }
        &>li:nth-child(1){
          height: 520px;
        }
        &>li:nth-child(2){
          height: 420px;
        }
        &>li:nth-child(3){
          height: 320px;
          border-bottom: none;
        }
      }
    }
  }
</style>
