<script setup lang="ts">
import { computed } from "vue";
import type { User, EditUserForm } from "@/types/user";
import type { UserRole } from "@/types/user";
import { useUtils } from "@/composables/utils/use-utils";

interface Props {
  user: User;
  isSelected: boolean;
  isEditing: boolean;
  editForm: EditUserForm;
}

const emits = defineEmits<{
  (e: "toggleSelect", userId: number): void;
  (e: "startEdit", user: User): void;
  (e: "saveEdit", userId: number): void;
  (e: "cancelEdit"): void;
  (e: "openDetails", user: User): void;
  (e: "deleteUser", userId: number): void;
  (e: "toggleStatus", userId: number): void;
  (e: "updateEditForm", field: keyof EditUserForm, value: string | UserRole): void;
}>();

const { formatDate, formatRelativeTime, getActivityClass, getDefaultAvatar, getRoleLabel } = useUtils();

const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: "admin", label: "Администратор" },
  { value: "user", label: "Пользователь" },
  { value: "moderator", label: "Модератор" },
];

const props = defineProps<Props>();

const roleLabel = computed(() => getRoleLabel(props.user.role));

function handleEditFormUpdate(field: keyof EditUserForm, value: string | UserRole) {
  emits("updateEditForm", field, value);
}
</script>

<template>
  <tr
    :class="{
      selected: isSelected,
      editing: isEditing,
      inactive: user.status === 'inactive',
    }"
  >
    <td>
      <input type="checkbox" :checked="isSelected" @change="emits('toggleSelect', user.id)" />
    </td>
    <td>{{ user.id }}</td>
    <td>
      <div v-if="isEditing">
        <input
          :value="editForm.name"
          type="text"
          class="edit-input"
          @input="(e) => handleEditFormUpdate('name', (e.target as HTMLInputElement).value)"
        />
      </div>
      <div v-else class="user-name-cell">
        <img :src="user.avatar || getDefaultAvatar(user.name)" :alt="user.name" class="avatar" />
        <span>{{ user.name }}</span>
      </div>
    </td>
    <td>
      <div v-if="isEditing">
        <input
          :value="editForm.email"
          type="email"
          class="edit-input"
          @input="(e) => handleEditFormUpdate('email', (e.target as HTMLInputElement).value)"
        />
      </div>
      <div v-else>{{ user.email }}</div>
    </td>
    <td>
      <div v-if="isEditing">
        <select
          :value="editForm.role"
          class="edit-select"
          @change="(e) => handleEditFormUpdate('role', (e.target as HTMLSelectElement).value as UserRole)"
        >
          <option v-for="option in roleOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div v-else>
        <span :class="['role-badge', 'role-' + user.role]">
          {{ roleLabel }}
        </span>
      </div>
    </td>
    <td>
      <span
        :class="['status-badge', user.status === 'active' ? 'status-active' : 'status-inactive']"
        @click="emits('toggleStatus', user.id)"
        :style="{ cursor: 'pointer' }"
      >
        {{ user.status === "active" ? "✓ Активен" : "✗ Неактивен" }}
      </span>
    </td>
    <td>{{ formatDate(user.registrationDate) }}</td>
    <td>
      <span :class="getActivityClass(user.lastActivity)">
        {{ formatRelativeTime(user.lastActivity) }}
      </span>
    </td>
    <td>
      <div class="action-buttons">
        <button v-if="!isEditing" @click="emits('startEdit', user)" class="btn-icon" title="Редактировать">✏️</button>
        <button v-if="isEditing" @click="emits('saveEdit', user.id)" class="btn-icon btn-success" title="Сохранить">
          ✓
        </button>
        <button v-if="isEditing" @click="emits('cancelEdit')" class="btn-icon btn-cancel" title="Отмена">✗</button>
        <button v-if="!isEditing" @click="emits('openDetails', user)" class="btn-icon" title="Подробнее">👁️</button>
        <button v-if="!isEditing" @click="emits('deleteUser', user.id)" class="btn-icon btn-danger" title="Удалить">
          🗑️
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.user-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background: #ffebee;
  color: #c62828;
}

.role-user {
  background: #e3f2fd;
  color: #1565c0;
}

.role-moderator {
  background: #fff3e0;
  color: #e65100;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-inactive {
  background: #ffebee;
  color: #c62828;
}

.activity-recent {
  color: #2e7d32;
  font-weight: 500;
}

.activity-week {
  color: #1565c0;
}

.activity-month {
  color: #e65100;
}

.activity-old {
  color: #757575;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-icon {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.btn-icon.btn-success {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.btn-icon.btn-cancel {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.btn-icon.btn-danger {
  border-color: #f44336;
}

.btn-icon.btn-danger:hover {
  background: #f44336;
  color: white;
}

.edit-input,
.edit-select {
  padding: 6px 10px;
  border: 1px solid #4caf50;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
}
</style>
