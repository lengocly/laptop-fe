import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from '@/routers/routers';
import { Suspense } from 'react';
import { SideBarProvider } from '@/contexts/SideBarProvider';
import Sidebar from '@/components/Sidebar/Sidebar';
import { AuthProvider } from '@/contexts/AuthProvider';
import { CartProvider } from '@/contexts/CartProvider';
import { WishlistProvider } from '@/contexts/WishlistProvider';
import { CompareProvider } from '@/contexts/CompareProvider';
import ChatWidget from '@/components/ChatWidget/ChatWidget';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import CompareBar from '@/components/CompareBar/CompareBar';

//để sử dụng được router thì phải bọc tất cả các component trong BrowserRouter để có thể sử dụng được các tính năng của router như là điều hướng, chuyển trang, v.v.
function App() {
    return (
        <AuthProvider>
           <CartProvider>
                <WishlistProvider>
                    <CompareProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <SideBarProvider>
                        <Sidebar />
                        <CompareBar />
                            <ChatWidget />
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
                    </SideBarProvider>
                </BrowserRouter>
                    </CompareProvider>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
