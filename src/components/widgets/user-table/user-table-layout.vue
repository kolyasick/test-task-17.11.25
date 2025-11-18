<template>
  <div class="table-wrapper">
    <table class="user-table">
      <thead>
        <slot name="header" />
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </table>

    <slot name="footer" />
  </div>
</template>

<style>
.table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.user-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.user-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.user-table th.sortable:hover {
  background: #eeeeee;
}

.user-table th.active {
  color: #4caf50;
}

.user-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.user-table tbody tr {
  transition: background 0.2s;
}

.user-table tbody tr:hover {
  background: #fafafa;
}

.user-table tbody tr.selected {
  background: #e8f5e9;
}

.user-table tbody tr.editing {
  background: #fff9c4;
}

.user-table tbody tr.inactive {
  opacity: 0.6;
}
</style>
