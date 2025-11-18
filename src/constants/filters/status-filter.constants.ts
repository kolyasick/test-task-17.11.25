// Точное соответствие значения value для каждого title через маппинг

export const StatusTitleValueMap = {
  Все: "",
  Активные: "active",
  Неактивные: "inactive",
} as const;

export type Statuses = keyof typeof StatusTitleValueMap;
export type StatusValue = (typeof StatusTitleValueMap)[Statuses];

export type StatusFilter = {
  title: Statuses;
  value: StatusValue;
};

export const statusFilters: StatusFilter[] = [
  {
    title: "Все",
    value: StatusTitleValueMap["Все"],
  },
  {
    title: "Активные",
    value: StatusTitleValueMap["Активные"],
  },
  {
    title: "Неактивные",
    value: StatusTitleValueMap["Неактивные"],
  },
];
