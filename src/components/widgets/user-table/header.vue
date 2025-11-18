<script setup lang="ts">
import { Roles, type RoleValue } from "@/constants/role/role.constants";

type Props = {
  title: string;
  usersLength: number;
  selectedUsers: number;
  isLoading: boolean;
  showAllUsers: boolean;
};
defineProps<Props>();

const emits = defineEmits<{
  (e: "handleSearch", event: InputEvent): void;
  (e: "openAddUserModal"): void;
  (e: "exportToCSV"): void;
  (e: "deleteSelectedUsers"): Promise<void>;
}>();

const searchQuery = defineModel<string>("searchQuery");
const filterRole = defineModel<RoleValue | "">("filterRole");
</script>

<template>
  <div class="table-header">
    <div class="header-left">
      <h2>{{ title }}</h2>
      <span class="total-count">{{ usersLength }} записей</span>
    </div>

    <div class="header-right">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по имени, email..."
        class="search-input"
        @input="(e) => emits('handleSearch', e)"
      />

      <select v-model="filterRole" class="role-filter">
        <option value="">Все роли</option>
        <option v-for="role in Roles" :key="role.value" :value="role.value">{{ role.title }}</option>
      </select>

      <button @click="emits('openAddUserModal')" class="btn btn-primary" :disabled="isLoading">
        + Добавить пользователя
      </button>

      <button
        @click="emits('exportToCSV')"
        class="btn btn-secondary"
        :disabled="isLoading || (selectedUsers === 0 && !showAllUsers)"
      >
        📥 Экспорт
      </button>

      <button v-if="selectedUsers > 0" @click="emits('deleteSelectedUsers')" class="btn btn-danger">
        🗑️ Удалить выбранные ({{ selectedUsers }})
      </button>
    </div>
  </div>
</template>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #4caf50;
}

.role-filter {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
</style>
