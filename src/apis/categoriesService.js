import axiosClient from './axiosClient';
const getCategories = async () => {
    const res = await axiosClient.get('/categories');
    return res.data;
};
const flattenChildCategories = (data) => {
    const flat = [];
    (data?.categories || []).forEach((parent) => {
        (parent.children || []).forEach((child) => {
            flat.push({
                id: child.id,
                name: child.name,
                slug: child.slug,
                parent_slug: parent.slug,
                parent_name: parent.name,
            });
        });
    });
    return flat;
};
const getFlatChildCategories = async () => {
    const data = await getCategories();
    return flattenChildCategories(data);
};
const findParentBySlug = (categories, parentSlug) =>
    (categories || []).find((c) => c.slug === parentSlug) ?? null;
const findChildCategory = (categories, childSlug) => {
    for (const parent of categories || []) {
        const child = (parent.children || []).find((c) => c.slug === childSlug);
        if (child) {
            return { parent, child };
        }
    }
    return null;
};
const buildHomepageCategories = (categories) => {
    const items = [];
    (categories || []).forEach((parent) => {
        (parent.children || [])
            .filter((child) => child.is_featured !== false)
            .forEach((child) => {
                items.push({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                    image: child.image,
                    href: `/cua-hang?category=${child.slug}`,
                });
            });
    });
    return items;
};
export {
    getCategories,
    flattenChildCategories,
    getFlatChildCategories,
    findParentBySlug,
    findChildCategory,
    buildHomepageCategories,
};

