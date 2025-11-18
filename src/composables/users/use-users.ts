import { ref } from "vue";
import type { User } from "@/types/user";
import { generateMockUsers } from "@/utils/generate-mock-users";

export function useUsers() {
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);

  async function loadUsers() {
    isLoading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      users.value = generateMockUsers(100) as User[];
    } catch (err) {
      error.value = "Ошибка загрузки данных: " + (err instanceof Error ? err.message : String(err));
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUser(userId: number, updates: Partial<User>) {
    isSaving.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userIndex = users.value.findIndex((u: User) => u.id === userId);
      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex],
          ...updates,
        } as User;
      }
    } catch (err) {
      throw new Error("Ошибка сохранения: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      isSaving.value = false;
    }
  }

  async function deleteUser(userId: number) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const index = users.value.findIndex((u: User) => u.id === userId);
      if (index !== -1) {
        users.value.splice(index, 1);
      }
    } catch (err) {
      throw new Error("Ошибка удаления: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  async function deleteUsers(userIds: number[]) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      users.value = users.value.filter((user: User) => !userIds.includes(user.id));
    } catch (err) {
      throw new Error("Ошибка удаления: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  async function addUser(
    userData: Omit<
      User,
      "id" | "registrationDate" | "lastActivity" | "avatar" | "loginCount" | "postsCount" | "commentsCount"
    >
  ) {
    isSaving.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: users.value.length > 0 ? Math.max(...users.value.map((u: User) => u.id)) + 1 : 1,
        ...userData,
        status: "active",
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        avatar: null,
        loginCount: 0,
        postsCount: 0,
        commentsCount: 0,
      };

      users.value.unshift(newUser);
      return newUser;
    } catch (err) {
      throw new Error("Ошибка создания пользователя: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      isSaving.value = false;
    }
  }

  function toggleUserStatus(userId: number) {
    const user = users.value.find((u: User) => u.id === userId);
    if (user) {
      user.status = user.status === "active" ? "inactive" : "active";
    }
  }

  return {
    users,
    isLoading,
    isSaving,
    error,
    loadUsers,
    updateUser,
    deleteUser,
    deleteUsers,
    addUser,
    toggleUserStatus,
  };
}
