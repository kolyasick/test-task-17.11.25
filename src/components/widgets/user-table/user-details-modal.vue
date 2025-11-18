<script setup lang="ts">
import type { User } from "@/types/user";
import { useUtils } from "@/composables/utils/use-utils";

interface Props {
  show: boolean;
  user: User | null;
}

defineProps<Props>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const { formatDate, formatRelativeTime, getDefaultAvatar, getRoleLabel } = useUtils();
</script>

<template>
  <div v-if="show && user" class="modal-overlay" @click.self="emits('close')">
    <div class="modal modal-large">
      <div class="modal-header">
        <h3>Информация о пользователе</h3>
        <button @click="emits('close')" class="btn-close">✕</button>
      </div>

      <div class="modal-body">
        <div class="user-details">
          <div class="detail-section">
            <img :src="user.avatar || getDefaultAvatar(user.name)" :alt="user.name" class="avatar-large" />
            <h2>{{ user.name }}</h2>
            <p class="user-email">{{ user.email }}</p>
          </div>

          <div class="detail-section">
            <h4>Основная информация</h4>
            <div class="detail-row">
              <span class="label">ID:</span>
              <span>{{ user.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Роль:</span>
              <span :class="['role-badge', 'role-' + user.role]">
                {{ getRoleLabel(user.role) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Статус:</span>
              <span
                :class="[
                  'status-badge',
                  user.status === 'active' ? 'status-active' : 'status-inactive',
                ]"
              >
                {{ user.status === "active" ? "Активен" : "Неактивен" }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Дата регистрации:</span>
              <span>{{ formatDate(user.registrationDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Последняя активность:</span>
              <span>{{ formatRelativeTime(user.lastActivity) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>Статистика</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ user.loginCount || 0 }}</div>
                <div class="stat-label">Входов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ user.postsCount || 0 }}</div>
                <div class="stat-label">Постов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ user.commentsCount || 0 }}</div>
                <div class="stat-label">Комментариев</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emits('close')" class="btn btn-secondary">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal.modal-large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 15px;
  display: block;
}

.user-email {
  color: #666;
  text-align: center;
  margin: 5px 0 0 0;
}

.detail-section h2 {
  text-align: center;
  margin: 0 0 5px 0;
  font-size: 22px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-secondary {
  background: #2196f3;
  color: white;
}

.btn-secondary:hover {
  background: #0b7dda;
}
</style>

