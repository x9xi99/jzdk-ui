<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          用户管理系统
        </div>
        <el-menu
          :router="true"
          :default-active="route.path"
          class="menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataLine /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                {{ userStore.username }}
                <el-icon><CaretBottom /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="changePassword">
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="changePasswordVisible"
      title="修改密码"
      width="400px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changePasswordVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="loading">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { DataLine, User, CaretBottom } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { changePassword } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const changePasswordVisible = ref(false)
const loading = ref(false)
const passwordFormRef = ref<FormInstance>()

const passwordForm = reactive({
  currentPassword: '',
  newPassword: ''
})

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'changePassword':
      changePasswordVisible.value = true
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  ElMessage.success('已退出登录')
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await changePassword(passwordForm)
        ElMessage.success('密码修改成功')
        changePasswordVisible.value = false
        handleLogout()
      } catch (error: any) {
        ElMessage.error(error.message || '密码修改失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  
  .el-container {
    height: 100%;
  }
  
  .el-aside {
    background-color: #304156;
    color: white;
    
    .logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      background-color: #2b3a4d;
      border-bottom: 1px solid #1f2d3d;
    }
    
    .menu {
      border-right: none;
      
      :deep(.el-menu-item) {
        height: 50px;
        line-height: 50px;
        
        &.is-active {
          background-color: #263445 !important;
          color: #409EFF !important;
          border-right: 3px solid #409EFF;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background-color: #409EFF;
          }
        }
        
        &:hover {
          background-color: #263445 !important;
          color: #fff !important;
        }
        
        .el-icon {
          font-size: 18px;
          margin-right: 10px;
        }
      }
    }
  }
  
  .el-header {
    background-color: white;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    
    .header-right {
      .user-info {
        cursor: pointer;
        display: flex;
        align-items: center;
        color: #606266;
        
        .el-icon {
          margin-left: 5px;
        }
      }
    }
  }
  
  .el-main {
    background-color: #f0f2f5;
    padding: 20px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 