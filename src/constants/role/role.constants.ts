// Маппинг Русское название роли -> значение value (eng), как в status-filter.constants.ts

export const RoleTitleValueMap = {
  Администратор: "admin",
  Пользователь: "user",
  Модератор: "moderator",
} as const;

export type Role = keyof typeof RoleTitleValueMap;
export type RoleValue = (typeof RoleTitleValueMap)[Role];

export type RoleFilter = {
  title: Role;
  value: RoleValue;
};

export const Roles: RoleFilter[] = [
  {
    title: "Администратор",
    value: RoleTitleValueMap["Администратор"],
  },
  {
    title: "Пользователь",
    value: RoleTitleValueMap["Пользователь"],
  },
  {
    title: "Модератор",
    value: RoleTitleValueMap["Модератор"],
  },
];
