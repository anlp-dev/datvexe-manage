export const formatCurrency = (amount, currency = 'VND', locale = 'vi-VN') => {
  if (isNaN(amount)) return amount * 1000;
  return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
  }).format(amount * 1000);
};

export const formatMoney = (amount, currency = 'VND', locale = 'vi-VN') => {
  if (isNaN(amount)) return ''; // Nếu amount không hợp lệ, trả về chuỗi rỗng
  return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0, // Không có số thập phân
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Lấy giờ và phút
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Đảm bảo giờ và phút có 2 chữ số
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes}`;
}

export const formatTime = (dateString) => {
  const date = new Date(dateString);

  // Lấy giờ và phút
  let hours = date.getHours();
  let minutes = date.getMinutes();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let years = date.getFullYear();

  // Đảm bảo giờ và phút có 2 chữ số
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes} - ${day}/${month}/${years}`;
}

export const formatDateMonth = (dateString) => {
  const date = new Date(dateString);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let years = date.getFullYear();

  return `${day}/${month}/${years}`;
}

export const formatCurrencyToNumber = (currencyString) => {
  return Number(currencyString.replace(/\./g, "").replace("đ", "").trim());
};
