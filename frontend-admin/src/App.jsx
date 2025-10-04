import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserProvider from './contexts/UserContext';
import Loading from './components/Loading';
import OrderProvider from './contexts/OrderContext';
import { ProductListProvider } from './contexts/ProductListContext';
import Home from './pages/Home';
import ProductsList from './pages/ProductsList';
import CategoriesList from './pages/CategoriesList';
import CollectionsProductList from './pages/CollectionsProductList';
import CollectionProvider from './contexts/CollectionContext';
import CollectionsList from './pages/CollectionsList';
import CouponsList from './pages/CouponsList';
import CouponProvider from './contexts/CouponContext';
import AuthPage from './pages/AuthPage';
import OutOfStockList from './pages/OutOfStockList';
import CategoryTitleList from './pages/CategoryTitleList';
import CategoryProvider from './contexts/CategoryContext';
import OrdersList from './pages/OrdersList';
import EmployeesList from './pages/EmployeesList';
import RolesList from './pages/RolesList';
import PermissionsList from './pages/PermissionsList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <UserProvider>
      <OrderProvider>
        <ProductListProvider>
          <CollectionProvider>
            <CouponProvider>
              <CategoryProvider>
                <BrowserRouter>
                  <Nav />
                  <Routes>
                    <Route path='/loading' element={<Loading />} />
                    <Route path='/auth' element={<AuthPage />} />
                    <Route path='/' element={<Home />} />

                    {/* Admin Routes with Role-based Permissions */}
                    <Route
                      path='/admin/productList'
                      element={
                        <ProtectedRoute
                          element={<ProductsList />}
                          requiredPermissions={["view_products"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/CategoriesList'
                      element={
                        <ProtectedRoute
                          element={<CategoriesList />}
                          requiredPermissions={["view_categories"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/collectionProductList'
                      element={
                        <ProtectedRoute
                          element={<CollectionsProductList />}
                          requiredPermissions={["view_collection_products"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/collections'
                      element={
                        <ProtectedRoute
                          element={<CollectionsList />}
                          requiredPermissions={["view_collections"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/coupons'
                      element={
                        <ProtectedRoute
                          element={<CouponsList />}
                          requiredPermissions={["view_coupons"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/outofstock'
                      element={
                        <ProtectedRoute
                          element={<OutOfStockList />}
                          requiredPermissions={["view_outOfStock_products"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/categorytitle'
                      element={
                        <ProtectedRoute
                          element={<CategoryTitleList />}
                          requiredPermissions={["view_category_title"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/orders'
                      element={
                        <ProtectedRoute
                          element={<OrdersList />}
                          requiredPermissions={["view_orders"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/employees'
                      element={
                        <ProtectedRoute
                          element={<EmployeesList />}
                          requiredPermissions={["view_admins"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/roles'
                      element={
                        <ProtectedRoute
                          element={<RolesList />}
                          requiredPermissions={["manage_roles"]}
                        />
                      }
                    />
                    <Route
                      path='/admin/permissions'
                      element={
                        <ProtectedRoute
                          element={<PermissionsList />}
                          requiredPermissions={["manage_permissions"]}
                        />
                      }
                    />
                  </Routes>
                </BrowserRouter>
              </CategoryProvider>
            </CouponProvider>
          </CollectionProvider>
        </ProductListProvider>
      </OrderProvider>
    </UserProvider>
  );
}

export default App;
