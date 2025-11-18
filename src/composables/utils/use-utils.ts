import type { UserRole } from "@/types/user";

export function useUtils() {
  function getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      admin: "Администратор",
      user: "Пользователь",
      moderator: "Модератор",
    };
    return labels[role] || role;
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "только что";
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 30) return `${diffDays} дн. назад`;
    return formatDate(dateString);
  }

  function getActivityClass(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays < 1) return "activity-recent";
    if (diffDays < 7) return "activity-week";
    if (diffDays < 30) return "activity-month";
    return "activity-old";
  }

  function getDefaultAvatar(name: string): string {
    const colors: readonly string[] = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"] as const;
    const initial = name.charAt(0).toUpperCase();
    const colorIndex = name.charCodeAt(0) % colors.length;
    const color: string = colors[colorIndex]!;

    const encodedColor = encodeURIComponent(color);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='${encodedColor}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`;
  }

  function exportToCSV(
    users: Array<{ id: number; name: string; email: string; role: UserRole; status: string; registrationDate: string }>,
    getRoleLabel: (role: UserRole) => string,
    formatDate: (date: string) => string
  ) {
    const headers = ["ID", "Имя", "Email", "Роль", "Статус", "Дата регистрации"];
    const rows = users.map((user) => [
      user.id,
      user.name,
      user.email,
      getRoleLabel(user.role),
      user.status === "active" ? "Активен" : "Неактивен",
      formatDate(user.registrationDate),
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().getTime()}.csv`;
    link.click();
  }

  return {
    getRoleLabel,
    formatDate,
    formatRelativeTime,
    getActivityClass,
    getDefaultAvatar,
    exportToCSV,
  };
}
