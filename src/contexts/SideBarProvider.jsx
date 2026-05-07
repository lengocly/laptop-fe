import { createContext } from 'react';
import { useState } from 'react';

export const SideBarContext = createContext();

//tham số childen là những component con của SideBarProvider
export const SideBarProvider = ({ children }) => {
    //isOpen là trạng thái mở hay đóng của sidebar, setIsOpen là hàm để thay đổi trạng thái đó
    const [isOpen, setIsOpen] = useState(false);
    return (
        <SideBarContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SideBarContext.Provider>
    );
};
