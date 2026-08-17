export const createOrderCode = (employeeName, createdAt = new Date(), existingCodes = []) => {
  const normalizedName = (employeeName || "nhanvien")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  const date = new Date(createdAt);
  const datePart = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`;
  const base = `${normalizedName || "nhanvien"}${datePart}`;
  const used = new Set(existingCodes.filter(Boolean));

  if (!used.has(base)) return base;

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
};

export const getOrderCode = (order) => order.orderCode || createOrderCode(order.employee, order.createdAt);
