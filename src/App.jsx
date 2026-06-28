import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from '@/routers/routers';
import { lazy, Suspense } from 'react';
import { SideBarProvider } from '@/contexts/SideBarProvider';
import Sidebar from '@/components/Sidebar/Sidebar';
import { AuthProvider } from '@/contexts/AuthProvider';
import { CartProvider } from '@/contexts/CartProvider';
import { WishlistProvider } from '@/contexts/WishlistProvider';
import { CompareProvider } from '@/contexts/CompareProvider';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import CompareBar from '@/components/CompareBar/CompareBar';
import AuthUrlHandler from '@/components/AuthUrlHandler/AuthUrlHandler';
const ChatWidget = lazy(() => import('@/components/ChatWidget/ChatWidget'));
function PageFallback() {
    return null;
}
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
                        <AuthUrlHandler />
                            <Suspense fallback={null}>
                                <ChatWidget />
                            </Suspense>
                                <Suspense fallback={<PageFallback />}>
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

