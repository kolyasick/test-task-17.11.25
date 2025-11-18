<script setup lang="ts">
import {
  Roles,
  type Role,
  type RoleValue,
} from "@/constants/role/role.constants";
import type { NewUserForm, NewUserErrors } from "@/types/user";

interface Props {
  show: boolean;
  newUser: NewUserForm;
  newUserErrors: NewUserErrors;
  isSaving: boolean;
  isValid: boolean;
}

defineProps<Props>();

const emits = defineEmits<{
  (e: "close"): void;
  (
    e: "update:newUser",
    field: keyof NewUserForm,
    value: string | boolean | RoleValue
  ): void;
  (e: "validateName"): void;
  (e: "validateEmail"): void;
  (e: "submit"): void;
}>();

function handleInput(
  field: keyof NewUserForm,
  value: string | boolean | RoleValue
) {
  emits("update:newUser", field, value);
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emits('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>Добавить нового пользователя</h3>
        <button @click="emits('close')" class="btn-close">✕</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Имя*</label>
          <input
            :value="newUser.name"
            type="text"
            :class="{ error: newUserErrors.name }"
            @input="(e) => {
              handleInput('name', (e.target as HTMLInputElement).value);
              emits('validateName');
            }"
          />
          <span v-if="newUserErrors.name" class="error-text">
            {{ newUserErrors.name }}
          </span>
        </div>

        <div class="form-group">
          <label>Email*</label>
          <input
            :value="newUser.email"
            type="email"
            :class="{ error: newUserErrors.email }"
            @input="(e) => {
              handleInput('email', (e.target as HTMLInputElement).value);
              emits('validateEmail');
            }"
          />
          <span v-if="newUserErrors.email" class="error-text">
            {{ newUserErrors.email }}
          </span>
        </div>

        <div class="form-group">
          <label>Роль*</label>
          <select
            :value="newUser.role"
            @change="(e) => handleInput('role', (e.target as HTMLSelectElement).value as RoleValue)"
          >
            <option
              v-for="option in Roles"
              :key="option.value"
              :value="option.value"
            >
              {{ option.title }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>
            <input
              type="checkbox"
              :checked="newUser.sendWelcomeEmail"
              @change="(e) => handleInput('sendWelcomeEmail', (e.target as HTMLInputElement).checked)"
            />
            Отправить приветственное письмо
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="emits('close')" class="btn btn-secondary">
          Отмена
        </button>
        <button
          @click="emits('submit')"
          class="btn btn-primary"
          :disabled="!isValid || isSaving"
        >
          {{ isSaving ? "Сохранение..." : "Добавить" }}
        </button>
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input.error {
  border-color: #f44336;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: block;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-secondary {
  background: #2196f3;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #0b7dda;
}
</style>
