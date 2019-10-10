<template>
  <div class="feed-view">
    <div class="feed-progress">
        <el-steps :active="details.handleState" align-center>
          <el-step title="已提交" description=""></el-step>
          <el-step title="预审通过" description=""></el-step>
          <el-step title="已采纳" description=""></el-step>
          <el-step title="已实现" description=""></el-step>
        </el-steps>
    </div>
    <div class="feed-describe">
      <ul>
        <li>
          <span>{{details.handleStateName}}</span>
          <span>【{{details.returnTypeName}}】标题：{{details.title}}</span>
        </li>
        <li>
          <span>{{details.opinionLabelName}}</span>
        </li>
        <li>
          <span>{{details.creater}}(归属：{{details.orgName}}) 发布于：{{details.createTime | datetime('yy:MM:dd hh:mm:ss')}}</span>
        </li>
      </ul>
    </div>
    <div class="question">
      <div class="question-main">
        <p>问题描述：</p>
        <div v-html="details.content"></div>
      </div>
    </div>
  <br>
    <el-form label-position="left" ref="ruleForm" :model="details"
                   class="carArchivesStopForm">
      <el-form-item label="处理类型" class="orgBox">
        <el-select placeholder="请选择类型" v-model="replyHandleState" size="mini">
          <el-option label="预审通过" :value="1"></el-option>
          <el-option label="采纳" :value="2"></el-option>
          <el-option label="已实现" :value="3"></el-option>
          <el-option label="拒绝" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回复内容" class="orgBox">
        <el-input type="textarea" v-model="handleContent" style="width:400px;"  rows="3"></el-input>
      </el-form-item>
      <div class="feed-progress1">
        <el-steps direction="vertical" :active="Journal.length">
          <el-step title="管理员" description="非常感谢您的反馈，您的建议我们已经收到，
          并已提交至关联产品团队进行核查评估，产品经理会在10个工作日内完成对建议是否采纳的评估并给您答复，
          请您持续关注聆听平台，了解建议进一步处理结果，感谢您的建议！" ></el-step>
          <el-step v-for="item in Journal" :key="item.id" :title="item.creater" style="color:red;">
            <div slot="description" style="margin-bottom:10px; ">
              <p >{{'将状态修改为' + item.handleStateName}} {{item.createTime | datetime('yy:MM:dd hh:mm:ss')}}</p>
              <p>{{item.handleContent}}</p>
            </div>
            
          </el-step>
        </el-steps>
      </div>
      <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
          <el-button size="mini" @click="close">取 消</el-button>
          <el-button size="mini" type="primary" @click.native="formSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "seeDialog",
  props: ["details"],
  data() {
    return {
      replyHandleState: "",
      handleContent:"",
      Journal:"",// 日志
      fileList2: [
        { name: "food.jpeg", url: require("@/assets/images/icon-lou0.png") },
        { name: "food2.jpeg", url: require("@/assets/images/icon-lou1.png") }
      ]
    };
  },
  methods: {
    close() {
      this.$emit("closeDialog");
      this.$refs.ruleForm.resetFields(); //重置表单
    },
    formSubmit() {
      const obj =  {
        id: this.details.id,
        handleState: this.replyHandleState==""?this.details.handleState:this.replyHandleState,
        handleContent: this.handleContent
      }
      this.getData('/opinion/platform/update','post', obj, true).then(res => {
        if (res.code==0) {
          this.close();
        }
      })
    }
  },
  created() {
    this.getData('/opinion/getLogs','post', {id: this.details.id}).then(res => {
        this.Journal = res.data
    })
  },
  watch: {
    details() {
      this.replyHandleState = "";
      this.handleContent = "";
      this.getData('/opinion/getLogs','post', {id: this.details.id}).then(res => {
        this.Journal = res.data
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.feed-view {
  padding: 36px;
  .feed-progress {
    width: 100%;
    height: 80px;
    border-bottom: 1px dashed #d8e6ee;
  }
  .feed-describe {
    padding: 20px 0px;
    border-bottom: 1px dashed #d8e6ee;
    ul > li {
      line-height: 30px;
      font-size: 12px;
      &:nth-child(1) {
        span:nth-child(1) {
          float: right;
          height: 20px;
          padding: 0 5px;
          line-height: 19px;
          border-radius: 4px;
          background-color: rgba(230, 162, 60, 0.1);
          border: 1px solid rgba(230, 162, 60, 0.3);
          color: #e6a23c;
        }
        span:nth-child(2) {
          font-size: 18px;
        }
      }
      &:nth-child(2) {
        span {
          height: 20px;
          line-height: 19px;
          padding: 2px 5px;
          border-radius: 4px;
          margin-right: 10px;
          background-color: hsla(220, 4%, 58%, 0.1);
          border: 1px solid hsla(220, 4%, 58%, 0.3);
          color: #909399;
        }
      }
    }
  }
  .question {
    padding: 30px 0px;
    border-bottom: 1px dashed #d8e6ee;
    .question-main {
      padding: 10px;
      background-color: rgba(206, 217, 219, 0.15);
      p {
        margin-bottom: 20px;
        line-height: 22px;
      }
    }
    .question-img {
      .el-upload-list > li {
        width: 50%;
      }
    }
  }
  .feed-progress1 {
    margin-top: 30px;
    .el-step__description.is-finish {
      color: #409eff;
    }
  }
}
</style>
