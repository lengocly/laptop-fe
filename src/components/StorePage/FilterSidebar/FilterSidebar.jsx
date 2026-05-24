

// Nhiệm vụ: Hiện danh mục + checkbox. Không import getCategories

import styles from './styles.module.scss';

function FilterSidebar({ categories, selectedSlug, onSelectSlug }) {
    const { wrap, title, groupTitle, checkRow, clearBtn } = styles;

    return (
        <div className={wrap}>
            <h2 className={title}>Danh mục</h2>

            {/* Tất cả sản phẩm */}
            <label className={checkRow}>
                <input
                    type="checkbox"
                    checked={selectedSlug === null}
                    onChange={() => onSelectSlug(null)}
                />
                Tất cả
            </label>

            {/* API trả mảng cha, mỗi cha có children */}
            {categories.map((parent) => (
                <div key={parent.id}>
                    <p className={groupTitle}>{parent.name}</p>
                    {(parent.children ?? []).map((child) => (
                        <label key={child.id} className={checkRow}>
                            <input
                                type="checkbox"
                                // Chỉ 1 danh mục được chọn (controlled input)
                                checked={selectedSlug === child.slug}
                                onChange={() => {
                                    if (selectedSlug === child.slug) {
                                        onSelectSlug(null);
                                    } else {
                                        onSelectSlug(child.slug);
                                    }
                                }}
                            />
                            {child.name}
                        </label>
                    ))}
                </div>
            ))}

            <button
                type="button"
                className={clearBtn}
                onClick={() => onSelectSlug(null)}
            >
                Xóa bộ lọc
            </button>
        </div>
    );
}

export default FilterSidebar;