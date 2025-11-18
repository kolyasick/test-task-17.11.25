import { computed, type Ref } from "vue";
import type { NewUserForm, NewUserErrors, User } from "@/types/user";

export function useValidation(newUser: NewUserForm, newUserErrors: NewUserErrors, existingUsers: Ref<User[]>) {
  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateNewUserName() {
    if (newUser.name.trim().length === 0) {
      newUserErrors.name = "Имя обязательно для заполнения";
    } else if (newUser.name.trim().length < 3) {
      newUserErrors.name = "Имя должно содержать минимум 3 символа";
    } else {
      newUserErrors.name = "";
    }
  }

  function validateNewUserEmail() {
    if (newUser.email.trim().length === 0) {
      newUserErrors.email = "Email обязателен для заполнения";
    } else if (!validateEmail(newUser.email)) {
      newUserErrors.email = "Некорректный формат email";
    } else if (existingUsers.value.some((u) => u.email === newUser.email)) {
      newUserErrors.email = "Пользователь с таким email уже существует";
    } else {
      newUserErrors.email = "";
    }
  }

  const isNewUserValid = computed(() => {
    return (
      newUser.name.trim().length > 0 &&
      newUser.email.trim().length > 0 &&
      validateEmail(newUser.email) &&
      !newUserErrors.name &&
      !newUserErrors.email
    );
  });

  return {
    validateEmail,
    validateNewUserName,
    validateNewUserEmail,
    isNewUserValid,
  };
}
