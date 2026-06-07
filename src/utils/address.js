// Tạo hàm tạo địa chỉ

/** Ghép chuỗi gửi BE — format giống shop chuẩn */
export function buildFullAddress({ street, ward, district, province }) {
    const parts = [
        street?.trim(),
        ward?.name,
        district?.name,
        province?.name,
    ].filter(Boolean);

    return parts.join(', ');
}

/** Text hiển thị trên ô "Tỉnh/TP, Quận/Huyện, Phường/Xã" */
export function formatAdminAddress({ province, district, ward }) {
    if (!province?.name) return '';
    if (!district?.name) return province.name;
    if (!ward?.name) return `${province.name} / ${district.name}`;
    return `${province.name} / ${district.name} / ${ward.name}`;
}

/** Validate trước submit */
export function validateShippingAddress({ street, province, district, ward }) {
    if (!street?.trim()) return 'Vui lòng nhập số nhà, tên đường.';
    if (!province?.code) return 'Vui lòng chọn Tỉnh/Thành phố.';
    if (!district?.code) return 'Vui lòng chọn Quận/Huyện.';
    if (!ward?.code) return 'Vui lòng chọn Phường/Xã.';
    return '';
}