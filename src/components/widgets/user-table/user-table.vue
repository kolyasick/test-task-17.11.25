<script setup lang="ts">
import { watch, onMounted } from "vue";
import type { UserTableProps, EditUserForm, UserRole } from "@/types/user.ts";
import Header from "./header.vue";
import Filters from "./filters.vue";
import Loader from "@/components/shared/loader.vue";
import Error from "@/components/shared/error.vue";
import Pagination from "@/components/shared/pagination.vue";
import UserTableRow from "./user-table-row.vue";
import AddUserModal from "./add-user-modal.vue";
import UserDetailsModal from "./user-details-modal.vue";
import { useUsers } from "@/composables/users/use-users";
import { useFilters, useFilteredUsers } from "@/composables/filters/use-filters";
import { useSorting } from "@/composables/sorting/use-sorting";
import { usePagination } from "@/composables/pagination/use-pagination";
import { useSelection } from "@/composables/selection/use-selection";
import { useModals } from "@/composables/modals/use-modals";
import { useValidation } from "@/composables/validation/use-validation";
import { useUtils } from "@/composables/utils/use-utils";
import UserTableLayout from "./user-table-layout.vue";

interface Props extends UserTableProps {
  title?: string;
  initialPageSize?: number;
  apiEndpoint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Управление пользователями",
  initialPageSize: 25,
  apiEndpoint: "/api/users",
});

const { users, isLoading, isSaving, error, loadUsers, updateUser, deleteUser, deleteUsers, addUser, toggleUserStatus } =
  useUsers();
const { searchQuery, filterRole, filterStatus, dateFrom, dateTo, clearAllFilters, clearDateFilter } = useFilters();
const { filteredAndSearchedUsers } = useFilteredUsers(users, searchQuery, filterRole, filterStatus, dateFrom, dateTo);
const { sortColumn, sortDirection, sortedUsers, sortBy } = useSorting(filteredAndSearchedUsers);
const {
  currentPage,
  pageSize,
  totalPages,
  paginationStart,
  paginationEnd,
  paginatedItems,
  visiblePages,
  goToPage,
  handlePageSizeChange,
  resetToFirstPage,
} = usePagination(sortedUsers, props.initialPageSize ?? 25);
const paginatedUsers = paginatedItems as typeof users;
const { selectedUsers, isAllSelected, toggleSelectUser, toggleSelectAll, clearSelection, removeFromSelection } =
  useSelection(paginatedUsers);
const {
  showAddUserModal,
  showDetailsModal,
  selectedUser,
  editingUserId,
  newUser,
  newUserErrors,
  editForm,
  openAddUserModal,
  closeAddUserModal,
  openUserDetails,
  closeDetailsModal,
  startEdit,
  cancelEdit,
} = useModals();
const { validateNewUserName, validateNewUserEmail, isNewUserValid } = useValidation(newUser, newUserErrors, users);
const { getRoleLabel, formatDate, exportToCSV: exportUsersToCSV } = useUtils();

watch([searchQuery, filterRole, filterStatus, dateFrom, dateTo, pageSize], () => {
  resetToFirstPage();
});

onMounted(async () => {
  await loadUsers();
});

async function handleSaveEdit(userId: number) {
  try {
    await updateUser(userId, editForm);
    cancelEdit();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    alert("Ошибка сохранения: " + errorMessage);
  }
}

async function handleDeleteUser(userId: number) {
  if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
    return;
  }

  try {
    await deleteUser(userId);
    removeFromSelection(userId);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    alert("Ошибка удаления: " + errorMessage);
  }
}

async function handleDeleteSelectedUsers() {
  if (!confirm(`Вы уверены, что хотите удалить ${selectedUsers.value.length} пользователей?`)) {
    return;
  }

  try {
    await deleteUsers(selectedUsers.value);
    clearSelection();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    alert("Ошибка удаления: " + errorMessage);
  }
}

async function handleAddNewUser() {
  validateNewUserName();
  validateNewUserEmail();

  if (!isNewUserValid.value) {
    return;
  }

  try {
    await addUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
    });
    closeAddUserModal();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    alert("Ошибка создания пользователя: " + errorMessage);
  }
}

function handleUpdateEditForm(field: keyof EditUserForm, value: string | UserRole) {
  if (field === "name" || field === "email") {
    (editForm as any)[field] = value as string;
  } else if (field === "role") {
    (editForm as any)[field] = value as UserRole;
  }
}

function handleUpdateNewUser(field: keyof EditUserForm | "sendWelcomeEmail", value: string | boolean | UserRole) {
  if (field === "name" || field === "email") {
    (newUser as any)[field] = value as string;
  } else if (field === "role") {
    (newUser as any)[field] = value as UserRole;
  } else if (field === "sendWelcomeEmail") {
    (newUser as any)[field] = value as boolean;
  }
}

function handleExportToCSV() {
  const usersToExport =
    selectedUsers.value.length > 0
      ? users.value.filter((u: { id: number }) => selectedUsers.value.includes(u.id))
      : sortedUsers.value;

  exportUsersToCSV(usersToExport, getRoleLabel, formatDate);
}

function handleToggleUserStatus(userId: number) {
  toggleUserStatus(userId);
}
</script>

<template>
  <div class="user-table-container">
    <!-- Хедер с действиями -->
    <Header
      :title="title"
      :users-length="filteredAndSearchedUsers.length"
      :selected-users="selectedUsers.length"
      :is-loading="isLoading"
      :show-all-users="false"
      v-model:searchQuery="searchQuery"
      v-model:filterRole="filterRole"
      @handle-search="() => {}"
      @open-add-user-modal="openAddUserModal"
      @exportToCSV="handleExportToCSV"
      @delete-selected-users="handleDeleteSelectedUsers"
    />

    <!-- Фильтры -->
    <Filters
      v-model:filter-status="filterStatus"
      v-model:data-to="dateTo"
      v-model:date-from="dateFrom"
      @clear-date-filter="clearDateFilter"
    />

    <!-- Загрузка -->
    <Loader v-if="isLoading" title="Загрузка данных..." />

    <!-- Ошибка -->
    <Error v-if="error" :error="error" @retry-load="loadUsers" />

    <!-- Таблица -->

    <UserTableLayout v-if="!isLoading && !error">
      <template #header>
        <tr>
          <th>
            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
          </th>
          <th @click="sortBy('id')" :class="{ sortable: true, active: sortColumn === 'id' }">
            ID
            <span v-if="sortColumn === 'id'">
              {{ sortDirection === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th @click="sortBy('name')" :class="{ sortable: true, active: sortColumn === 'name' }">
            Имя
            <span v-if="sortColumn === 'name'">
              {{ sortDirection === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th @click="sortBy('email')" :class="{ sortable: true, active: sortColumn === 'email' }">
            Email
            <span v-if="sortColumn === 'email'">
              {{ sortDirection === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th>Роль</th>
          <th>Статус</th>
          <th
            @click="sortBy('registrationDate')"
            :class="{
              sortable: true,
              active: sortColumn === 'registrationDate',
            }"
          >
            Дата регистрации
            <span v-if="sortColumn === 'registrationDate'">
              {{ sortDirection === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th>Последняя активность</th>
          <th>Действия</th>
        </tr>
      </template>
      <template #body>
        <UserTableRow
          v-for="user in paginatedUsers"
          :key="user.id"
          :user="user"
          :is-selected="selectedUsers.includes(user.id)"
          :is-editing="editingUserId === user.id"
          :edit-form="editForm"
          @toggle-select="toggleSelectUser"
          @start-edit="startEdit"
          @save-edit="handleSaveEdit"
          @cancel-edit="cancelEdit"
          @open-details="openUserDetails"
          @delete-user="handleDeleteUser"
          @toggle-status="handleToggleUserStatus"
          @update-edit-form="handleUpdateEditForm"
        />
      </template>

      <template #footer>
        <div v-if="paginatedUsers.length === 0" class="no-data">
          <p>😔 Нет данных для отображения</p>
          <button @click="clearAllFilters" class="btn btn-primary">Сбросить фильтры</button>
        </div>
      </template>
    </UserTableLayout>

    <!-- Пагинация -->
    <Pagination
      :is-loading="isLoading"
      :start="paginationStart"
      :end="paginationEnd"
      :current-page="currentPage"
      :entities-length="filteredAndSearchedUsers.length"
      :visible-pages="visiblePages"
      :total-pages="totalPages"
      v-model:page-size="pageSize"
      @go-to-page="goToPage"
      @handle-page-size-change="handlePageSizeChange"
    />

    <!-- Модальное окно добавления пользователя -->
    <AddUserModal
      :show="showAddUserModal"
      :new-user="newUser"
      :new-user-errors="newUserErrors"
      :is-saving="isSaving"
      :is-valid="isNewUserValid"
      @close="closeAddUserModal"
      @update:newUser="handleUpdateNewUser"
      @validate-name="validateNewUserName"
      @validate-email="validateNewUserEmail"
      @submit="handleAddNewUser"
    />

    <!-- Модальное окно деталей пользователя -->
    <UserDetailsModal :show="showDetailsModal" :user="selectedUser" @close="closeDetailsModal" />
  </div>
</template>

<style scoped>
.user-table-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.no-data {
  padding: 60px 20px;
  text-align: center;
  color: #999;
}

.no-data p {
  font-size: 18px;
  margin-bottom: 20px;
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
</style>
