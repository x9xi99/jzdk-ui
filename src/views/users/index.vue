<template>
  <div class="users-container">
    <div class="header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handleAdd">
        新增用户
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="users"
      border
      style="width: 100%"
    >
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="userToken" label="用户Token" />
      <el-table-column prop="longitude" label="经度" />
      <el-table-column prop="latitude" label="纬度" />
      <el-table-column prop="vipExpireTime" label="VIP到期时间">
        <template #default="{ row }">
          {{ formatDate(row.vipExpireTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="isEdit ? [] : rules.password"
        >
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="isEdit ? '不修改请留空' : '请输入密码'"
          />
        </el-form-item>
        <el-form-item label="用户Token" prop="userToken">
          <el-input v-model="form.userToken" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" />
        </el-form-item>
        <el-form-item label="VIP到期时间" prop="vipExpireTime">
          <el-date-picker
            v-model="form.vipExpireTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitLoading"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/users'
import type { User, CreateUserForm, UpdateUserForm } from '@/types/user'

const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const users = ref<User[]>([])
const formRef = ref<FormInstance>()

const form = reactive<CreateUserForm>({
  username: '',
  password: '',
  userToken: '',
  longitude: '',
  latitude: '',
  vipExpireTime: ''
})

const rules = computed(() => ({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: !isEdit.value, message: '请输入密码', trigger: 'blur' }
  ],
  userToken: [
    { required: true, message: '请输入用户Token', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '请输入经度', trigger: 'blur' }
  ],
  latitude: [
    { required: true, message: '请输入纬度', trigger: 'blur' }
  ],
  vipExpireTime: [
    { required: true, message: '请选择VIP到期时间', trigger: 'blur' }
  ]
}))

const fetchUsers = async () => {
  loading.value = true
  try {
    users.value = await getUsers()
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.username = ''
  form.password = ''
  form.userToken = ''
  form.longitude = ''
  form.latitude = ''
  form.vipExpireTime = ''
}

const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  isEdit.value = true
  Object.assign(form, {
    ...row,
    password: ''
  })
  dialogVisible.value = true
}

const handleDelete = (row: User) => {
  ElMessageBox.confirm(
    `确认删除用户 "${row.username}" 吗？`,
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteUser(row.username)
      ElMessage.success('删除成功')
      fetchUsers()
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value) {
          const updateData: UpdateUserForm = { ...form }
          if (!updateData.password) {
            delete updateData.password
          }
          await updateUser(form.username, updateData)
          ElMessage.success('更新成功')
        } else {
          await createUser(form)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchUsers()
      } catch (error: any) {
        ElMessage.error(error.message || (isEdit.value ? '更新失败' : '创建失败'))
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

<style lang="scss" scoped>
.users-container {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      font-weight: 500;
      color: #1f2f3d;
    }
  }
}
</style> 