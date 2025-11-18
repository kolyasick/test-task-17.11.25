import type { StatusValue } from "@/constants/filters/status-filter.constants";
import type { RoleValue } from "@/constants/role/role.constants";
import type { User } from "@/types/user";

export function generateMockUsers(count: number): User[] {
  const roles: RoleValue[] = ["admin", "user", "moderator"] as const;
  const statuses: StatusValue[] = ["active", "inactive"] as const;
  const names = [
    "Иван Петров",
    "Мария Сидорова",
    "Алексей Иванов",
    "Елена Кузнецова",
    "Дмитрий Смирнов",
    "Ольга Попова",
    "Сергей Васильев",
    "Анна Соколова",
    "Николай Михайлов",
    "Татьяна Новикова",
  ];

  const users: User[] = [];
  for (let i = 1; i <= count; i++) {
    const name = names[Math.floor(Math.random() * names.length)] + " " + i;
    const registrationDate = new Date(
      2020,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    );
    const lastActivity = new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    );

    users.push({
      id: i,
      name: name,
      email: `user${i}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)] as
        | "admin"
        | "user"
        | "moderator",
      status: statuses[Math.floor(Math.random() * statuses.length)] as
        | "active"
        | "inactive",
      registrationDate: registrationDate.toISOString(),
      lastActivity: lastActivity.toISOString(),
      avatar: null,
      loginCount: Math.floor(Math.random() * 500),
      postsCount: Math.floor(Math.random() * 100),
      commentsCount: Math.floor(Math.random() * 300),
    });
  }
  return users;
}
