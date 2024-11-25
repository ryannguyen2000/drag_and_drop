export function debounce(callback, delay) {
    let timer;

    return (...args) => {
        // Xóa timer cũ nếu có
        if (timer) clearTimeout(timer);

        // Đặt timer mới
        timer = setTimeout(() => {
            callback(...args); // Gọi callback với các tham số truyền vào
        }, delay);
    };
}
