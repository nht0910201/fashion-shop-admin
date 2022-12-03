import { DeleteForever, Edit, FilterAlt } from "@mui/icons-material";
import { Button, Checkbox, Grid, Modal, Popover, Radio, Row, Table, Text, useAsyncList, useCollator, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateError } from "../../../components/Alert/UpdateError";
import { UpdateSuccessNavigate } from "../../../components/Alert/UpdateSuccessNavigate";
import { updateProductByAdmin } from "../../../services/AdminService";
import { StyledBadge } from "../../MyOrder/StyledBadge";
import { CSVLink } from "react-csv";
import { Button as Button2 } from '@mui/material'
import { filter } from 'smart-array-filter'

export function RemoveModal({ product }) {
    const [visible, setVisible] = useState(false);
    const [pro, setProduct] = useState(product)
    const handler = async () => {
        setVisible(true)
    };
    const closeHandler = () => {
        setVisible(false);
    };
    const handleChangeState = (e) => {
        setProduct({ ...pro, state: e })
    }
    const deleteProduct = async (data, id) => {
        const w = toast.loading('Vui lòng chờ ...!')
        let res = await updateProductByAdmin(data, id)
        if (res.success) {
            UpdateSuccessNavigate(w, 'Cập nhật trạng thái sản phẩm thành công', '/admin?page=product')
        } else {
            UpdateError(w, 'Cập nhật trạng thái sản phẩm không thành công')
        }
    }
    const handleDeleteProduct = () => {
        deleteProduct(pro, pro.id)
    }
    return (
        <div>
            <Button auto light onClick={handler}>
                <DeleteForever />
            </Button>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={20} b>
                        XOÁ SẢN PHẨM
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Radio.Group label="Trạng thái" value={pro.state} onChange={handleChangeState} orientation='horizontal'>
                        <Radio value="enable">Kích hoạt</Radio>
                        <Radio value="disable">Vô hiệu hoá</Radio>
                    </Radio.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Huỷ
                    </Button>
                    <Button auto onClick={handleDeleteProduct}>
                        Lưu
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}
function TableProduct({ products, show }) {
    const collator = useCollator({ numeric: true });
    const [productList, setList] = useState(products.list)
    const [filPro, setFilPro] = useState([])
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
        <div hidden={show} id='product'>
            <Row justify='space-between' align='center' css={{ marginTop: '$5', marginBottom: '$5' }}>
                <Text b size={20}>SẢN PHẨM</Text>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CSVLink
                        data={products.list}
                        filename={"products.csv"}
                        className="btn btn-primary"
                        target="_blank"
                        style={{ marginRight: 10 }}
                    >
                        Xuất CSV
                    </CSVLink>
                    <Button auto ghost color={'warning'} onClick={() => navigate('/admin/addProduct')}>Thêm sản phẩm</Button>
                </div>
            </Row>
            <Row justify='space-between' align='center' css={{ marginBottom: '$4' }}>
                <Popover placement='bottom-left'>
                    <Popover.Trigger>
                        <Button auto light animated={false}>
                            Lọc nhãn hàng
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
                selectionMode="single"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
            >
                <Table.Header>
                    <Table.Column >TÊN SẢN PHẨM</Table.Column>
                    <Table.Column align="center" key={'price'} allowsSorting>GIÁ*</Table.Column>
                    <Table.Column align="center" key={'discount'} allowsSorting>GIẢM GIÁ*</Table.Column>
                    <Table.Column align="center" key={'categoryName'} allowsSorting>DANH MỤC*</Table.Column>
                    <Table.Column align="center" key={'brandName'} allowsSorting>NHÃN HIỆU*</Table.Column>
                    <Table.Column align="center" key={'state'} allowsSorting>TRẠNG THÁI*</Table.Column>
                    <Table.Column>CHỈNH SỬA</Table.Column>
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
                            <Table.Cell css={{ textAlign: 'center' }}>{product.categoryName}</Table.Cell>
                            <Table.Cell css={{ textAlign: 'center' }}>{product.brandName}</Table.Cell>
                            <Table.Cell css={{ textAlign: 'center' }}>
                                <StyledBadge type={product.state}>{state[product.state]}</StyledBadge>
                            </Table.Cell>
                            <Table.Cell css={{ d: 'flex', justifyContent: 'center', h: '100%', alignItems: 'center' }}>
                                <Row align="center">
                                    <button onClick={() => {
                                        if (product.state === 'enable') {
                                            navigate(`/admin/updateProduct/${product.id}`)
                                        } else {
                                            toast.error('Vui lòng kích hoạt lại sản phẩm', {
                                                position: "top-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: false,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "light",
                                            });
                                        }
                                    }}>
                                        <Edit />
                                    </button>
                                    <RemoveModal product={product} />
                                </Row>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
                <Table.Pagination
                    total={Math.ceil(productList.length / 5)}
                    loop
                    shadow
                    noMargin
                    align="center"
                    color={'warning'}
                    rowsPerPage={5}
                />

            </Table>
            <ToastContainer />
        </div>
    );
}

export default TableProduct;