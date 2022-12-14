import { Avatar, Button, Collapse } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { getUserFromLocalStorage } from "../../../utils/userHanle";
import * as authAction from '../../../redux/auth/authSlice'
import { BarChart, BrandingWatermark, Category, Inventory, Person, ReceiptLong } from "@mui/icons-material";

function SideBar() {
    let userCur = getUserFromLocalStorage()
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
        dispatch(authAction.logout())
        window.location.href='/'
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
                        <Button onClick={handleLogout} light auto color={'error'}>????ng xu???t</Button>
                    </Collapse>
                    <Collapse contentLeft={<BarChart/>} title="Th???ng k??">
                        <Button onClick={handleStatistic} light auto color={'warning'}>Xem th???ng k??</Button>
                    </Collapse>
                    <Collapse contentLeft={<Person/>} title="T??i kho???n">
                        <Button onClick={handleUserManage} light auto color={'warning'}>Qu???n l?? t??i kho???n </Button>
                    </Collapse>
                    <Collapse contentLeft={<Inventory/>} title="S???n ph???m">
                        <Button onClick={handleProductManage} light auto color={'warning'}>Qu???n l?? s???n ph???m </Button>
                    </Collapse>
                    <Collapse contentLeft={<Category/>} title="Danh m???c">
                        <Button onClick={handleCategoryManage} light auto color={'warning'}>Qu???n l?? danh m???c </Button>
                    </Collapse>
                    <Collapse contentLeft={<BrandingWatermark/>} title="Nh??n h??ng">
                        <Button onClick={handleBrandManage} light auto color={'warning'}>Qu???n l?? nh??n h??ng </Button>
                    </Collapse>
                    <Collapse contentLeft={<ReceiptLong/>} title="????n h??ng">
                        <Button onClick={handleOrderManage} light auto color={'warning'}>Qu???n l?? ????n h??ng</Button>
                    </Collapse>
                    
                </> :
                <>
                    <Collapse title={userCur.name} contentLeft={<Avatar
                        size="lg"
                        src={userCur.avatar}
                        bordered
                        
                    />}>
                        <Button onClick={handleLogout} light auto color={'warning'}>????ng xu???t</Button>
                    </Collapse>
                    <Collapse contentLeft={<Inventory/>} title="S???n ph???m">
                        <Button onClick={handleProductManage} light auto color={'warning'}>Qu???n l?? s???n ph???m </Button>
                    </Collapse>
                    <Collapse contentLeft={<ReceiptLong/>} title="????n h??ng">
                        <Button onClick={handleOrderManage} light auto color={'warning'}>Qu???n l?? ????n h??ng</Button>
                    </Collapse>
                </>
            }
        </Collapse.Group>
    );
}

export default SideBar;