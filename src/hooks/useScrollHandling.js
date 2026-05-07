import { useEffect, useRef, useState } from 'react';

// hook để xử lý sự kiện cuộn chuột
const useScrollHandling = () => {
    //sự kiện khi lướt chuột xuống lên của ảnh
    const [scrollDriction, setScrollDrection] = useState(null);

    //biến để lưu vị trí cuộn trước đó
    const previousScrollPosition = useRef(0);

    const [scrollPosition, setScrollPosition] = useState(0); //lưu vị trí cuộn hiện tại

    //biến lấy ra vị trí cuộn hiện tại
    const scrollTracing = () => {
        const currentScrollPosition = window.pageYOffset;

        if (currentScrollPosition > previousScrollPosition.current) {
            setScrollDrection('down');
        } else if (currentScrollPosition < previousScrollPosition.current) {
            setScrollDrection('up');
        }

        //cập nhật vị trí cuộn trước đó, tránh trường hợp cuộn lên trên cùng sẽ có giá trị âm
        previousScrollPosition.current =
            currentScrollPosition <= 0 ? 0 : currentScrollPosition;

        setScrollPosition(currentScrollPosition);
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollTracing); //đăng ký sự kiện cuộn

        return () => {
            window.removeEventListener('scroll', scrollTracing); //hủy đăng ký sự kiện cuộn khi component unmount
        };
    }, []);

    return { scrollDriction, scrollPosition };
};

export default useScrollHandling;
