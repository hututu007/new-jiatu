<template>
    <router-link v-if="item.value===131||item.value===190||item.value===191||item.value===192||item.value===193||item.value===194"
                 :to="resolvePath(item.path)">
      <el-menu-item :index="resolvePath(item.path)" >
        <svg-icon :icon-class="menuIndex==item.path?item.meta.icon+'1':item.meta.icon" ></svg-icon>
        <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
      </el-menu-item>
    </router-link>
    <el-submenu v-else :index="item.name||item.path">
      <template slot="title">
        <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
        <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :item="child"
                      :key="child.path" :base-path="resolvePath(child.path)"></sidebar-item>

        <router-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <!-- <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon> -->
            <i class="el-icon-document" ></i>
            <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>

</template>

<script>
  import path from 'path'
  export default {
    name: 'SidebarItem',
    props: {
      // route配置json
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      },
      menuIndex: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        onlyOneChild: null
      }
    },
    methods: {
      /**
       * 判断路由是否没有下级
       */
      hasOneShowingChild(children) {
        /* 判断是否只有一个children */
        const showingChildren = children.filter(item => {
          if (item.hidden) {
            return false
          } else {
            // temp set(will be used if only has one showing child )
            this.onlyOneChild = item
            return true
          }
        })
        /* 判断是否只有一个children */
        if (showingChildren.length < 1 && (showingChildren[0].path==="dashboard")) {
          return true
        }
        return false
      },
      resolvePath(...paths) {
        return path.resolve(this.basePath, ...paths)
      }
    },
    mounted(){
    }
  }
</script>

<style>
.el-menu-item i {
  color: #91abd9;
}
</style>

