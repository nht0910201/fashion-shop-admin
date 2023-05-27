import { Button, Checkbox, Grid, Input, Popover, Row, Table, Text, useAsyncList, useCollator, User } from "@nextui-org/react";
import { useEffect, useState, useRef } from "react";
import { Button as Button2 } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Await, useNavigate } from "react-router-dom";
import { filter } from 'smart-array-filter'
import { UpdateError } from "../../../components/Alert/UpdateError";
import { UpdateSuccessNavigate } from "../../../components/Alert/UpdateSuccessNavigate";
import { updateProductByAdmin, updateProductPriceByAdmin } from "../../../services/AdminService";
import { StyledBadge } from "../../MyOrder/StyledBadge";
import { Check, DeleteForever, Edit, FilterAlt } from "@mui/icons-material";
import validator from "validator";

function ManagePrice({ products, show }) {

    const collator = useCollator({ numeric: true });
    const [productList, setList] = useState(products.list)
    const [filPro, setFilPro] = useState([])
    const [newPrice, setNewPrice] = useState(0)
    const newPriceRef = useRef(newPrice);
    const [newDiscount, setDis] = useState(0)
    const newDiscountRef = useRef(newDiscount);
    const hanleChangePrice = (e) => {
        setNewPrice(e.target.value)
        newPriceRef.current = e.target.value;
    }
    const hanleChangeDiscount = (e) => {
        setDis(e.target.value);
        newDiscountRef.current = e.target.value
    }
    const handleChangeFilPro = (e) => {
        setFilPro(e)
    }
    const filterProduct = async () => {
        let arr = products.list
        if (filPro.length > 0) {
            arr = filter(arr, {
                keywords: `state:=${filPro}`
            })
            if (arr.length >= 0) {
                setList(arr)
            }
        }
    }
    const resetFilter = async () => {
        setFilPro([])
        setList(products.list)
    }
    async function load() {
        return { items: productList }
    }
    async function sort({ items, sortDescriptor }) {
        return {
            items: items.sort((a, b) => {
                let first = a[sortDescriptor.column];
                let second = b[sortDescriptor.column];
                let cmp = collator.compare(first, second);
                if (sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }
                return cmp;
            }),
        };
    }
    let list = useAsyncList({ load, sort });
    useEffect(() => {
        list.reload()
    }, [productList])
    const updatePriceProduct = async (id) => {
        const data = {
            id: id,
            price: newPriceRef.current,
            discount: newDiscountRef.current
        }

        if (data.price <= 0 || validator.isEmpty(data.price)) {
            toast.warn('Vui lòng nhập giá mới', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (data.discount < 0) {
            toast.warn('Vui lòng nhập giảm giá mới', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
            const w = toast.loading("Vui lòng chờ ...")
            let res = await updateProductPriceByAdmin(data)
            if (res.success) {
                UpdateSuccessNavigate(w, 'Cập nhật giá sản phẩm thành công', '/admin?page=managePrice');
            } else {
                UpdateError(w, 'Cập nhật giá sản phẩm thất bại')
            }
        }
    }

    const handleSave = (id) => {
        updatePriceProduct(id);
    }
    let navigate = useNavigate()
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    const state = {
        enable: 'Hiển thị',
        disable: 'Vô hiệu hóa',
    };
    return (
        <div hidden={show} id='managePrice'>
            <Row justify='space-between' align='center' css={{ marginTop: '$5', marginBottom: '$5' }}>
                <Text b size={20}>SẢN PHẨM</Text>
                <Text b size={20}>{newPrice}</Text>
            </Row>
            <Row justify='space-between' align='center' css={{ marginBottom: '$4' }}>
                <Popover placement='bottom-left'>
                    <Popover.Trigger>
                        <Button auto light animated={false}>
                            Lọc sản phẩm
                            <FilterAlt />
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content css={{ marginRight: '$0', width: '50%' }}>
                        <Grid.Container
                            css={{ borderRadius: "14px", padding: "$10" }}
                        >
                            <Row>
                                <Checkbox.Group
                                    label="Chọn trạng thái"
                                    orientation="horizontal"
                                    color="warning"
                                    value={filPro}
                                    onChange={handleChangeFilPro}
                                >
                                    <Checkbox css={{ textAlign: 'center' }} value="enable">Hiển thị</Checkbox>
                                    <Checkbox css={{ textAlign: 'center' }} value="disable">Vô hiệu hoá</Checkbox>
                                </Checkbox.Group>
                            </Row>
                            <Grid.Container justify="flex-end" alignContent="center" gap={1}>
                                <Grid>
                                    <Button size="sm" color="warning" onClick={filterProduct}>
                                        Xem kết quả
                                    </Button>

                                </Grid>
                                <Grid>
                                    <Button size="sm" bordered color={'error'} onClick={resetFilter}>
                                        Xoá bộ lọc
                                    </Button>
                                </Grid>
                            </Grid.Container>

                        </Grid.Container>
                    </Popover.Content>
                </Popover>
                <Row justify='flex-end' align='center'>
                    {filPro.length > 0 ?
                        <>
                            <Text size={'$lg'} css={{ marginRight: '$2' }}>Lọc theo trạng thái: </Text>
                            {filPro.map((state) => (
                                <Button2 variant="outlined" color='inherit'>
                                    {state === 'enable' ? "Hiển thị" : 'Vô hiệu hoá'}
                                </Button2>
                            ))}
                        </>
                        :
                        <></>
                    }
                </Row>
            </Row>
            <Table
                bordered
                shadow={false}
                color={'warning'}
                aria-label="Orders table"
                css={{
                    height: "calc($space$14 * 10)",
                    minWidth: "100%",
                }}
                // selectionMode="single"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
            >
                <Table.Header>
                    <Table.Column >TÊN SẢN PHẨM</Table.Column>
                    <Table.Column align="center" key={'price'} allowsSorting>GIÁ*</Table.Column>
                    <Table.Column align="center" key={'discount'} allowsSorting>GIẢM GIÁ*</Table.Column>
                    <Table.Column align="center">GIÁ MỚI</Table.Column>
                    <Table.Column align="center">GIẢM GIÁ MỚI</Table.Column>
                    <Table.Column align="center" key={'state'} allowsSorting>TRẠNG THÁI*</Table.Column>
                    <Table.Column>LƯU LẠI</Table.Column>
                </Table.Header>

                <Table.Body items={list.items} loadingState={list.loadingState}>
                    {(product) => (
                        <Table.Row key={product.id}>
                            <Table.Cell><User
                                squared
                                src={product.images[0].url}
                                name={product.name}
                            /></Table.Cell>
                            <Table.Cell css={{ textAlign: 'center' }}>{formatPrice(product.price)}</Table.Cell>
                            <Table.Cell css={{ textAlign: 'center' }}>{product.discount}%</Table.Cell>
                            <Table.Cell css={{ textAlign: 'center' }}>
                                <Input
                                    underlined
                                    value={newPrice}
                                    onChange={hanleChangePrice}
                                    color="warning"
                                />
                            </Table.Cell>
                            <Table.Cell css={{ textAlign: 'center' }}>
                                <Input
                                    underlined
                                    value={newDiscount}
                                    onChange={hanleChangeDiscount}
                                    color="warning"
                                />
                            </Table.Cell>
                            <Table.Cell css={{ textAlign: 'center' }}>
                                <StyledBadge type={product.state}>{state[product.state]}</StyledBadge>
                            </Table.Cell>
                            <Table.Cell css={{ d: 'flex', justifyContent: 'center', h: '100%', alignItems: 'center' }}>
                                <Row align="center">
                                    <button
                                        // disabled={price === '' || discount==='' ? true :false}
                                        onClick={() => handleSave(product.id)}
                                    >
                                        <Check />
                                    </button>
                                </Row>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
                <Table.Pagination
                    total={Math.ceil(productList.length / 10)}
                    loop
                    shadow
                    noMargin
                    align="center"
                    color={'warning'}
                    rowsPerPage={10}
                />

            </Table>
            <ToastContainer />
        </div>
    );
}

export default ManagePrice;