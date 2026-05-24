import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from '@/routers/routers';
import { Suspense } from 'react';
import { SideBarProvider } from '@/contexts/SideBarProvider';
import Sidebar from '@/components/Sidebar/Sidebar';
import { AuthProvider } from '@/contexts/AuthProvider';

//để sử dụng được router thì phải bọc tất cả các component trong BrowserRouter để có thể sử dụng được các tính năng của router như là điều hướng, chuyển trang, v.v.
function App() {
    return (
        <AuthProvider>
           
            <SideBarProvider>
                <Sidebar />
                <BrowserRouter>
                    <Suspense fallback={<div>Loading...</div>}>
                        {/* trong lúc chờ hiện chữ loading khi load component */}
                        <Routes>
                            {routers.map((item, index) => {
                                return (
                                    <Route
                                        key={index}
                                        path={item.path}
                                        element={<item.component />}
                                    />
                                );
                            })}
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </SideBarProvider>
        </AuthProvider>
    );
}

export default App;
