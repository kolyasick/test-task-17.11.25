import { ref, reactive } from "vue";
import type { User, NewUserForm, NewUserErrors, EditUserForm } from "@/types/user";

export function useModals() {
  const showAddUserModal = ref<boolean>(false);
  const showDetailsModal = ref<boolean>(false);
  const selectedUser = ref<User | null>(null);
  const editingUserId = ref<number | null>(null);

  const newUser = reactive<NewUserForm>({
    name: "",
    email: "",
    role: "user",
    sendWelcomeEmail: true,
  });

  const newUserErrors = reactive<NewUserErrors>({
    name: "",
    email: "",
  });

  const editForm = reactive<EditUserForm>({
    name: "",
    email: "",
    role: "user",
  });

  function openAddUserModal() {
    showAddUserModal.value = true;
    newUser.name = "";
    newUser.email = "";
    newUser.role = "user";
    newUser.sendWelcomeEmail = true;
    newUserErrors.name = "";
    newUserErrors.email = "";
  }

  function closeAddUserModal() {
    showAddUserModal.value = false;
  }

  function openUserDetails(user: User) {
    selectedUser.value = user;
    showDetailsModal.value = true;
  }

  function closeDetailsModal() {
    showDetailsModal.value = false;
    selectedUser.value = null;
  }

  function startEdit(user: User) {
    editingUserId.value = user.id;
    editForm.name = user.name;
    editForm.email = user.email;
    editForm.role = user.role;
  }

  function cancelEdit() {
    editingUserId.value = null;
    editForm.name = "";
    editForm.email = "";
    editForm.role = "user";
  }

  return {
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
  };
}

