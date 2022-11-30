import { DeleteForever, Edit } from "@mui/icons-material";
import { Button, Modal, Radio, Row, Table, Text, useAsyncList, useCollator, User } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateError } from "../../../components/Alert/UpdateError";
import { UpdateSuccessNavigate } from "../../../components/Alert/UpdateSuccessNavigate";
import { updateProductByAdmin } from "../../../services/AdminService";
import { StyledBadge } from "../../MyOrder/StyledBadge";
import { CSVLink } from "react-csv";

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
function TableProduct({ products,show }) {
    const collator = useCollator({ numeric: true });
    async function load() {
        return { items: products.list }
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
    const list = useAsyncList({ load, sort });
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
                <div style={{display:'flex',alignItems:'center'}}>
                    <CSVLink
                        data={products.list}
                        filename={"products.csv"}
                        className="btn btn-primary"
                        target="_blank"
                        style={{marginRight:10}}
                    >
                        Export CSV
                    </CSVLink>
                    <Button auto ghost color={'warning'} onClick={()=>navigate('/admin/addProduct')}>Thêm sản phẩm</Button>
                </div>
            </Row>
            <Table
                bordered
                shadow={false}
                color="primary"
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
                            <Table.Cell css={{textAlign:'center'}}>{formatPrice(product.price)}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{product.discount}%</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{product.categoryName}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{product.brandName}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>
                                <StyledBadge type={product.state}>{state[product.state]}</StyledBadge>
                            </Table.Cell>
                            <Table.Cell css={{d:'flex',justifyContent:'center',h:'100%',alignItems:'center'}}>
                                <Row align="center">
                                    <button onClick={() => {
                                        if(product.state==='enable'){
                                            navigate(`/admin/updateProduct/${product.id}`)
                                        }else{
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
                    total={Math.ceil(products.totalQuantity/5)}
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