<script setup lang="ts">
import { watch, onMounted, computed } from "vue";
import { useUsers } from "@/composables/users/use-users";
import { useFilters } from "@/composables/filters/use-filters";
import { useSorting } from "@/composables/sorting/use-sorting";
import { usePagination } from "@/composables/pagination/use-pagination";
import { useSelection } from "@/composables/selection/use-selection";
import { useModals } from "@/composables/modals/use-modals";
import { useValidation } from "@/composables/validation/use-validation";
import { useUtils } from "@/composables/utils/use-utils";
import type { EditUserForm } from "@/types/user.ts";
import type { RoleValue } from "@/constants/role/role.constants";
import UserTableLayout from "./user-table-layout.vue";
import Header from "./header.vue";
import Filters from "./filters.vue";
import Loader from "@/components/shared/loader.vue";
import Error from "@/components/shared/error.vue";
import Pagination from "@/components/shared/pagination.vue";
import UserTableRow from "./user-table-row.vue";
import AddUserModal from "./add-user-modal.vue";
import UserDetailsModal from "./user-details-modal.vue";

type Props = {
  title?: string;
  initialPageSize?: number;
  apiEndpoint?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: "Управление пользователями",
  initialPageSize: 25,
  apiEndpoint: "/api/users",
});

const user = useUsers();
const filter = useFilters();

const roleFilteredUsers = computed(() => {
  if (!filter.filterRole.value) {
    return user.users.value;
  }
  return user.users.value.filter(
    (user) => user.role === filter.filterRole.value
  );
});

const statusFilteredUsers = computed(() => {
  if (!filter.filterStatus.value) {
    return roleFilteredUsers.value;
  }
  return roleFilteredUsers.value.filter(
    (user) => user.status === filter.filterStatus.value
  );
});

const dateFilteredUsers = computed(() => {
  let filtered = statusFilteredUsers.value;

  if (filter.dateFrom.value) {
    const fromDate = new Date(filter.dateFrom.value);
    filtered = filtered.filter((user) => {
      const userDate = new Date(user.registrationDate);
      return userDate >= fromDate;
    });
  }

  if (filter.dateTo.value) {
    const toDate = new Date(filter.dateTo.value);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((user) => {
      const userDate = new Date(user.registrationDate);
      return userDate <= toDate;
    });
  }

  return filtered;
});

const filteredAndSearchedUsers = computed(() => {
  if (!filter.searchQuery.value.trim()) {
    return dateFilteredUsers.value;
  }

  const query = filter.searchQuery.value.toLowerCase().trim();
  return dateFilteredUsers.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.id.toString().includes(query)
    );
  });
});

const sort = useSorting(filteredAndSearchedUsers);
const pagination = usePagination(sort.sortedUsers, props.initialPageSize ?? 25);
const paginatedUsers = pagination.paginatedItems as typeof user.users;
const selection = useSelection(paginatedUsers);
const modals = useModals();
const validation = useValidation(
  modals.newUser,
  modals.newUserErrors,
  user.users
);
const { getRoleLabel, formatDate, exportToCSV: exportUsersToCSV } = useUtils();

watch(
  [
    filter.dateFrom,
    filter.dateFrom,
    filter.searchQuery,
    filter.filterRole,
    filter.filterStatus,
  ],
  () => {
    pagination.resetToFirstPage();
  }
);

onMounted(async () => {
  await user.loadUsers();
});

async function handleSaveEdit(userId: number) {
  try {
    await user.updateUser(userId, modals.editForm);
    modals.cancelEdit();
  } catch (err) {
    const errorMessage = err instanceof TypeError ? err.message : String(err);
    alert("Ошибка сохранения: " + errorMessage);
  }
}

async function handleDeleteUser(userId: number) {
  if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
    return;
  }

  try {
    await user.deleteUser(userId);
    selection.removeFromSelection(userId);
  } catch (err) {
    const errorMessage = err instanceof TypeError ? err.message : String(err);
    alert("Ошибка удаления: " + errorMessage);
  }
}

async function handleDeleteSelectedUsers() {
  if (
    !confirm(
      `Вы уверены, что хотите удалить ${selection.selectedUsers.value.length} пользователей?`
    )
  ) {
    return;
  }

  try {
    await user.deleteUsers(selection.selectedUsers.value);
    selection.clearSelection();
  } catch (err) {
    const errorMessage = err instanceof TypeError ? err.message : String(err);
    alert("Ошибка удаления: " + errorMessage);
  }
}

async function handleAddNewUser() {
  validation.validateNewUserName();
  validation.validateNewUserEmail();

  if (!validation.isNewUserValid.value) {
    return;
  }

  try {
    await user.addUser({
      name: modals.newUser.name,
      email: modals.newUser.email,
      role: modals.newUser.role,
      status: "active",
    });
    modals.closeAddUserModal();
  } catch (err) {
    const errorMessage = err instanceof TypeError ? err.message : String(err);
    alert("Ошибка создания пользователя: " + errorMessage);
  }
}

function handleUpdateEditForm(
  field: keyof EditUserForm,
  value: string | RoleValue
) {
  if (field === "name" || field === "email") {
    (modals.editForm as any)[field] = value as string;
  } else if (field === "role") {
    (modals.editForm as any)[field] = value as RoleValue;
  }
}

function handleUpdateNewUser(
  field: keyof EditUserForm | "sendWelcomeEmail",
  value: string | boolean | RoleValue
) {
  if (field === "name" || field === "email") {
    (modals.newUser as any)[field] = value as string;
  } else if (field === "role") {
    (modals.newUser as any)[field] = value as RoleValue;
  } else if (field === "sendWelcomeEmail") {
    (modals.newUser as any)[field] = value as boolean;
  }
}

function handleExportToCSV() {
  const usersToExport =
    selection.selectedUsers.value.length > 0
      ? user.users.value.filter((u: { id: number }) =>
          selection.selectedUsers.value.includes(u.id)
        )
      : sort.sortedUsers.value;

  exportUsersToCSV(usersToExport, getRoleLabel, formatDate);
}

function handleToggleUserStatus(userId: number) {
  user.toggleUserStatus(userId);
}
</script>

<template>
  <div class="user-table-container">
    <!-- Хедер с действиями -->
    <Header
      :title="title"
      :users-length="filteredAndSearchedUsers.length"
      :selected-users="selection.selectedUsers.value.length"
      :is-loading="user.isLoading.value"
      :show-all-users="false"
      v-model:searchQuery="filter.searchQuery.value"
      v-model:filterRole="filter.filterRole.value"
      @handle-search="() => {}"
      @open-add-user-modal="modals.openAddUserModal"
      @exportToCSV="handleExportToCSV"
      @delete-selected-users="handleDeleteSelectedUsers"
    />

    <!-- Фильтры -->
    <Filters
      v-model:filter-status="filter.filterStatus.value"
      v-model:data-to="filter.dateTo.value"
      v-model:date-from="filter.dateFrom.value"
      @clear-date-filter="filter.clearDateFilter"
    />

    <!-- Загрузка -->
    <Loader v-if="user.isLoading.value" title="Загрузка данных..." />

    <!-- Ошибка -->
    <Error
      v-if="user.error.value"
      :error="user.error.value"
      @retry-load="user.loadUsers"
    />

    <!-- Таблица -->

    <UserTableLayout v-if="!user.isLoading.value && !user.error.value">
      <template #header>
        <tr>
          <th>
            <input
              type="checkbox"
              :checked="selection.isAllSelected.value"
              @change="selection.toggleSelectAll"
            />
          </th>
          <th
            @click="sort.sortBy('id')"
            :class="{ sortable: true, active: sort.sortColumn.value === 'id' }"
          >
            ID
            <span v-if="sort.sortColumn.value === 'id'">
              {{ sort.sortDirection.value === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th
            @click="sort.sortBy('name')"
            :class="{
              sortable: true,
              active: sort.sortColumn.value === 'name',
            }"
          >
            Имя
            <span v-if="sort.sortColumn.value === 'name'">
              {{ sort.sortDirection.value === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th
            @click="sort.sortBy('email')"
            :class="{
              sortable: true,
              active: sort.sortColumn.value === 'email',
            }"
          >
            Email
            <span v-if="sort.sortColumn.value === 'email'">
              {{ sort.sortDirection.value === "asc" ? "↑" : "↓" }}
            </span>
          </th>
          <th>Роль</th>
          <th>Статус</th>
          <th
            @click="sort.sortBy('registrationDate')"
            :class="{
              sortable: true,
              active: sort.sortColumn.value === 'registrationDate',
            }"
          >
            Дата регистрации
            <span v-if="sort.sortColumn.value === 'registrationDate'">
              {{ sort.sortDirection.value === "asc" ? "↑" : "↓" }}
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
          :is-selected="selection.selectedUsers.value.includes(user.id)"
          :is-editing="modals.editingUserId.value === user.id"
          :edit-form="modals.editForm"
          @toggle-select="selection.toggleSelectUser"
          @start-edit="modals.startEdit"
          @save-edit="handleSaveEdit"
          @cancel-edit="modals.cancelEdit"
          @open-details="modals.openUserDetails"
          @delete-user="handleDeleteUser"
          @toggle-status="handleToggleUserStatus"
          @update-edit-form="handleUpdateEditForm"
        />
      </template>

      <template #footer>
        <div v-if="paginatedUsers.length === 0" class="no-data">
          <p>😔 Нет данных для отображения</p>
          <button @click="filter.clearAllFilters" class="btn btn-primary">
            Сбросить фильтры
          </button>
        </div>
      </template>
    </UserTableLayout>

    <!-- Пагинация -->
    <Pagination
      :is-loading="user.isLoading.value"
      :start="pagination.paginationStart.value"
      :end="pagination.paginationEnd.value"
      :current-page="pagination.currentPage.value"
      :entities-length="filteredAndSearchedUsers.length"
      :visible-pages="pagination.visiblePages.value"
      :total-pages="pagination.totalPages.value"
      v-model:page-size="pagination.pageSize"
      @go-to-page="pagination.goToPage"
      @handle-page-size-change="pagination.handlePageSizeChange"
    />

    <!-- Модальное окно добавления пользователя -->
    <AddUserModal
      :show="modals.showAddUserModal.value"
      :new-user="modals.newUser"
      :new-user-errors="modals.newUserErrors"
      :is-saving="user.isSaving.value"
      :is-valid="validation.isNewUserValid.value"
      @close="modals.closeAddUserModal"
      @update:newUser="handleUpdateNewUser"
      @validate-name="validation.validateNewUserName"
      @validate-email="validation.validateNewUserEmail"
      @submit="handleAddNewUser"
    />

    <!-- Модальное окно деталей пользователя -->
    <UserDetailsModal
      :show="modals.showDetailsModal.value"
      :user="modals.selectedUser.value"
      @close="modals.closeDetailsModal"
    />
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
