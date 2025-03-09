<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
            </div>
          </template>
          <div class="card-content">
            <h1>{{ stats.totalUsers }}</h1>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>VIP用户数</span>
            </div>
          </template>
          <div class="card-content">
            <h1>{{ stats.vipUsers }}</h1>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>即将过期用户</span>
            </div>
          </template>
          <div class="card-content">
            <h1>{{ stats.expiringUsers }}</h1>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>最近添加的用户</span>
        </div>
      </template>
      <el-table
        :data="recentUsers"
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="userToken" label="用户Token" />
        <el-table-column prop="vipExpireTime" label="VIP到期时间">
          <template #default="{ row }">
            {{ formatDate(row.vipExpireTime) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUsers } from '@/api/users'
import type { User } from '@/types/user'

const stats = ref({
  totalUsers: 0,
  vipUsers: 0,
  expiringUsers: 0
})

const recentUsers = ref<User[]>([])

const calculateStats = (users: User[]) => {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  stats.value.totalUsers = users.length
  stats.value.vipUsers = users.filter(user => new Date(user.vipExpireTime) > now).length
  stats.value.expiringUsers = users.filter(user => {
    const expireDate = new Date(user.vipExpireTime)
    return expireDate > now && expireDate <= thirtyDaysFromNow
  }).length
}

const fetchData = async () => {
  try {
    const users = await getUsers()
    calculateStats(users)
    recentUsers.value = users
      .sort((a, b) => new Date(b.vipExpireTime).getTime() - new Date(a.vipExpireTime).getTime())
      .slice(0, 5)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
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
  fetchData()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  .stat-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-content {
      text-align: center;
      padding: 20px 0;
      
      h1 {
        margin: 0;
        font-size: 36px;
        color: #409EFF;
      }
    }
  }
  
  .chart-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style> 