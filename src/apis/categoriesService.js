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
            });
        });
    });
    return flat;
};

const getFlatChildCategories = async () => {
    const data = await getCategories();
    return flattenChildCategories(data);
};

export { getCategories, flattenChildCategories, getFlatChildCategories };