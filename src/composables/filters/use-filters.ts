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
