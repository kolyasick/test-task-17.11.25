import { computed, ref, type Ref } from "vue";
import type { User } from "@/types/user";
import type { StatusValue } from "@/constants/filters/status-filter.constants";
import type { RoleValue } from "@/constants/role/role.constants";

export function useFilters() {
  const searchQuery = ref("");
  const filterRole = ref<RoleValue | "">("");
  const filterStatus = ref<StatusValue>("");
  const dateFrom = ref("");
  const dateTo = ref("");

  function clearAllFilters() {
    searchQuery.value = "";
    filterRole.value = "";
    filterStatus.value = "";
    dateFrom.value = "";
    dateTo.value = "";
  }

  function clearDateFilter() {
    dateFrom.value = "";
    dateTo.value = "";
  }

  return {
    searchQuery,
    filterRole,
    filterStatus,
    dateFrom,
    dateTo,
    clearAllFilters,
    clearDateFilter,
  };
}

export function useFilteredUsers(
  users: Ref<User[]>,
  searchQuery: Ref<string>,
  filterRole: Ref<string>,
  filterStatus: Ref<string>,
  dateFrom: Ref<string>,
  dateTo: Ref<string>
) {
  const roleFilteredUsers = computed(() => {
    if (!filterRole.value) {
      return users.value;
    }
    return users.value.filter((user) => user.role === filterRole.value);
  });

  const statusFilteredUsers = computed(() => {
    if (!filterStatus.value) {
      return roleFilteredUsers.value;
    }
    return roleFilteredUsers.value.filter((user) => user.status === filterStatus.value);
  });

  const dateFilteredUsers = computed(() => {
    let filtered = statusFilteredUsers.value;

    if (dateFrom.value) {
      const fromDate = new Date(dateFrom.value);
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.registrationDate);
        return userDate >= fromDate;
      });
    }

    if (dateTo.value) {
      const toDate = new Date(dateTo.value);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.registrationDate);
        return userDate <= toDate;
      });
    }

    return filtered;
  });

  const filteredAndSearchedUsers = computed(() => {
    if (!searchQuery.value.trim()) {
      return dateFilteredUsers.value;
    }

    const query = searchQuery.value.toLowerCase().trim();
    return dateFilteredUsers.value.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toString().includes(query)
      );
    });
  });

  return {
    filteredAndSearchedUsers,
  };
}
