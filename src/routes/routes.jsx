import config from '../config';


import { AdminLayout } from '../layouts'

import Admin from '../pages/Admin/Manage';
import View404 from '../pages/404/View404';
import AddProduct from '../pages/Admin/Product/AddProduct';
import UpdateProduct from '../pages/Admin/Product/UpdateProduct';
import LoginAdmin from '../pages/LoginAdmin';

const publicRoutes = [
    // { path: config.routes.notFound, component: View404 },
    { path: config.routes.loginManage, component: LoginAdmin },
];

const privateRoutes = [
    { path: config.routes.admin, component: Admin, layout: AdminLayout },
    { path: config.routes.loginManage, component: Admin, layout: AdminLayout },
    { path: config.routes.addProduct, component: AddProduct },
    { path: config.routes.updateProduct, component: UpdateProduct },
    { path: config.routes.notFound, component: View404 },
];

export { publicRoutes, privateRoutes };