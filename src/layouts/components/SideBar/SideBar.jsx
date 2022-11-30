import { Avatar, Button, Collapse } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../../../utils/userHanle";
import * as authAction from '../../../redux/auth/authSlice'
import { BarChart, BrandingWatermark, Category, Inventory, Person, ReceiptLong } from "@mui/icons-material";

function SideBar() {
    let userCur = getUserFromLocalStorage()
    let navigate = useNavigate()
    let dispatch = useDispatch()
    const handleProductManage = () => {
        let order = document.getElementById('order')
        let product = document.getElementById('product')
        let user = document.getElementById('user')
        let category = document.getElementById('category');
        let brand = document.getElementById('brand');
        let stats = document.getElementById('stats')
        
        product.removeAttribute('hidden')
        order.setAttribute('hidden', true)
        user.setAttribute('hidden', true)
        category.setAttribute('hidden', true)
        brand.setAttribute('hidden', true)
        stats.setAttribute('hidden',true)
    }
    const handleUserManage = () => {
        let user = document.getElementById('user')
        let product = document.getElementById('product')
        let category = document.getElementById('category');
        let brand = document.getElementById('brand');
        let order = document.getElementById('order')
        let stats = document.getElementById('stats')

        user.removeAttribute('hidden')
        product.setAttribute('hidden', true)
        category.setAttribute('hidden', true)
        brand.setAttribute('hidden', true)
        order.setAttribute('hidden', true)
        stats.setAttribute('hidden',true)
    }
    const handleCategoryManage = () => {
        let user = document.getElementById('user')
        let product = document.getElementById('product')
        let category = document.getElementById('category');
        let brand = document.getElementById('brand');
        let order = document.getElementById('order')
        let stats = document.getElementById('stats')

        category.removeAttribute('hidden')
        product.setAttribute('hidden', true)
        user.setAttribute('hidden', true)
        brand.setAttribute('hidden', true)
        order.setAttribute('hidden', true)
        stats.setAttribute('hidden',true)
    }
    const handleBrandManage = () => {
        let user = document.getElementById('user')
        let product = document.getElementById('product')
        let stats = document.getElementById('stats')
        let category = document.getElementById('category');
        let brand = document.getElementById('brand');
        let order = document.getElementById('order')

        brand.removeAttribute('hidden')
        product.setAttribute('hidden', true)
        user.setAttribute('hidden', true)
        category.setAttribute('hidden', true)
        order.setAttribute('hidden', true)
        stats.setAttribute('hidden',true)
    }
    const handleOrderManage = () => {
        let user = document.getElementById('user')
        let product = document.getElementById('product')
        let stats = document.getElementById('stats')
        let category = document.getElementById('category');
        let brand = document.getElementById('brand');
        let order = document.getElementById('order')

        order.removeAttribute('hidden')
        product.setAttribute('hidden', true)
        stats.setAttribute('hidden',true)
        user.setAttribute('hidden', true)
        category.setAttribute('hidden', true)
        brand.setAttribute('hidden', true)
    }
    const handleStatistic = () => {
        let user = document.getElementById('user')
        let product = document.getElementById('product')
        let stats = document.getElementById('stats')
        let category = document.getElementById('category');
        let brand = document.getElementById('brand');
        let order = document.getElementById('order')

        stats.removeAttribute('hidden')
        product.setAttribute('hidden', true)
        order.setAttribute('hidden',true)
        user.setAttribute('hidden', true)
        category.setAttribute('hidden', true)
        brand.setAttribute('hidden', true)
    }
    const handleLogout = () => {
        navigate('/')
        dispatch(authAction.logout())
    }
    return (
        <Collapse.Group css={{ width: '100%'}}>
            {userCur.role === 'ROLE_ADMIN' ?
                <>
                    <Collapse title={userCur.name} contentLeft={<Avatar
                        size="lg"
                        src={userCur.avatar}
                        bordered
                    />}>
                        <Button onClick={handleLogout} light auto color={'warning'}>Đăng xuất</Button>
                    </Collapse>
                    <Collapse contentLeft={<BarChart/>} title="Thống kê">
                        <Button onClick={handleStatistic} light auto color={'warning'}>Xem thống kê</Button>
                    </Collapse>
                    <Collapse contentLeft={<Person/>} title="Tài khoản">
                        <Button onClick={handleUserManage} light auto color={'warning'}>Quản lý tài khoản </Button>
                    </Collapse>
                    <Collapse contentLeft={<Inventory/>} title="Sản phẩm">
                        <Button onClick={handleProductManage} light auto color={'warning'}>Quản lý sản phẩm </Button>
                    </Collapse>
                    <Collapse contentLeft={<Category/>} title="Danh mục">
                        <Button onClick={handleCategoryManage} light auto color={'warning'}>Quản lý danh mục </Button>
                    </Collapse>
                    <Collapse contentLeft={<BrandingWatermark/>} title="Nhãn hàng">
                        <Button onClick={handleBrandManage} light auto color={'warning'}>Quản lý nhãn hàng </Button>
                    </Collapse>
                    <Collapse contentLeft={<ReceiptLong/>} title="Đơn hàng">
                        <Button onClick={handleOrderManage} light auto color={'warning'}>Quản lý đơn hàng</Button>
                    </Collapse>
                    
                </> :
                <>
                    <Collapse title={userCur.name} contentLeft={<Avatar
                        size="lg"
                        src={userCur.avatar}
                        bordered
                        
                    />}>
                        <Button onClick={handleLogout} light auto color={'warning'}>Đăng xuất</Button>
                    </Collapse>
                    <Collapse contentLeft={<Inventory/>} title="Sản phẩm">
                        <Button onClick={handleProductManage} light auto color={'warning'}>Quản lý sản phẩm </Button>
                    </Collapse>
                    <Collapse contentLeft={<ReceiptLong/>} title="Đơn hàng">
                        <Button onClick={handleOrderManage} light auto color={'warning'}>Quản lý đơn hàng</Button>
                    </Collapse>
                </>
            }
        </Collapse.Group>
    );
}

export default SideBar;