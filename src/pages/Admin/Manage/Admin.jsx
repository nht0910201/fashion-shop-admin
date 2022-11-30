import { Grid, Loading } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCatgoriesByAdmin, getUsersByAdmin, getAllBrandsByAdmin, getProductsByAdmin, getOrdersByAdmin, getStatsByAdmin } from "../../../services/AdminService";
import { getUserFromLocalStorage } from "../../../utils/userHanle";
import Statistic from "./Statistic";
import TableBrand from "./TableBrand";
import TableCategories from "./TableCategories";
import TableOrder from "./TableOrder";
import TableProduct from "./TableProduct";
import TableUser from "./TableUser";

function Admin() {
  const [stats,setStats] = useState({})
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState({})
  let userCur = getUserFromLocalStorage()
  useEffect(() => {
    async function getData() {
      if (userCur?.role === 'ROLE_ADMIN') {
        let [stats,products, orders, users, categories, brands] = await Promise.all([
          getStatsByAdmin(),
          getProductsByAdmin(0),
          getOrdersByAdmin(0),
          getUsersByAdmin(0),
          getCatgoriesByAdmin(),
          getAllBrandsByAdmin()
        ]);
        if (stats.success && products.success && orders.success && users.success && categories.success && brands.success) {
          setStats(stats.data)
          setProducts(products.data)
          setOrders(orders.data)
          setCategories(categories.data)
          setBrands(brands.data)
          setUsers(users.data)
        }
      }else{
        let [products, orders] = await Promise.all([
          getProductsByAdmin(0),
          getOrdersByAdmin(0),
        ]);
        if (products.success && orders.success) {
          setProducts(products.data)
          setOrders(orders.data)
        }
      }
    }
    getData()
  }, [])
  let locate = useLocation()
  let params = new URLSearchParams(locate.search);
  let url = params.get('page')
  return (
    <div className="w-full">
      {userCur?.role === 'ROLE_STAFF' ? <>
        {products.length === 0 || orders.length === 0 ?
          <Grid.Container wrap="wrap" justify="center" gap={2} >
            <Grid xs={12} css={{ w: '100vw', h: '100vh' }} alignItems='center' justify="center">
              <Loading size='xl' type='gradient' color={'warning'} />
            </Grid>
          </Grid.Container>
          : <>
            <TableProduct products={products} show={url === 'product' || url === null ? false : true} />
            <TableOrder orders={orders} show={url === 'order' ? false : true} />
          </>}
      </> : <>
        {products.length === 0 || orders.length === 0 || brands.length === 0 || users.length === 0 || categories.length === 0 ? <>
          <Grid.Container wrap="wrap" justify="center" gap={2} >
            <Grid xs={12} css={{ w: '100vw', h: '100vh' }} alignItems='center' justify="center">
              <Loading size='xl' type='gradient' color={'warning'} />
            </Grid>
          </Grid.Container>
        </> : <>
          <TableUser users={users} show={url === 'user' ? false : true} />
          <TableProduct products={products} show={url === 'product' ? false : true} />
          <TableCategories categories={categories} show={url === 'category' ? false : true} />
          <TableBrand brands={brands} show={url === 'brand' ? false : true} />
          <TableOrder orders={orders} show={url === 'order' ? false : true} />
          <Statistic stats={stats} show={url === 'stats' || url === null ? false : true}/>
        </>}
      </>}
    </div>
  );
}

export default Admin;