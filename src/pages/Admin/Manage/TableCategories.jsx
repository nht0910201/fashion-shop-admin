import { CheckOutlined, Edit } from '@mui/icons-material';
import { Button, Row, Table, Text, Radio, Modal, Input, Dropdown, useAsyncList, useCollator } from '@nextui-org/react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addCategoryByAdmin, updateCategoryByAdmin } from '../../../services/AdminService';
import { UpdateError } from '../../../components/Alert/UpdateError';
import { UpdateSuccessNavigate } from '../../../components/Alert/UpdateSuccessNavigate';
import { StyledBadge } from '../../MyOrder/StyledBadge';
import { CSVLink } from "react-csv";
import validator from 'validator';

export function AddModal({ categories }) {
    const root = categories.filter((category) => {
        return category.root === true
    })
    const [name, setName] = useState('');
    const [parent_category, setParentCategory] = useState('');
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const closeHandler = () => {
        setName('')
        setParentCategory('')
        setVisible(false);
    };
    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const addCategory = async () => {
        if (validator.isEmpty(name)) {
            toast.error('Vui lòng nhập tên danh mục', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else {
            const data = new FormData();
            data.append('name', name)
            data.append('parent_category', parent_category)
            const wait = toast.loading('Vui lòng chờ...!')
            let res = await addCategoryByAdmin(data)
            if (res.data.success) {
                UpdateSuccessNavigate(wait, 'Thêm danh mục thành công', '/admin?page=category')
            } else {
                UpdateError(wait, 'Thêm danh mục thất bại')
            }
        }
    }
    const handleAddCategory = () => {
        addCategory()
    }
    return (
        <div>
            <Button auto ghost onClick={handler} color={'warning'}>
                Thêm danh mục
            </Button>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={20} b>
                        THÊM DANH MỤC
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Input size='lg' placeholder="Tên danh mục" type={'text'} value={name} onChange={handleChangeName} />
                    <Dropdown>
                        <Dropdown.Button light color="default" css={{ tt: "capitalize" }}>
                            {categories.filter((cat) => {
                                return (cat.id === parent_category)
                            })[0]?.name || 'Không'}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="secondary"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={parent_category}
                            onAction={(key) => setParentCategory(key)}
                        >
                            <Dropdown.Item key=''>Không</Dropdown.Item>
                            {root.map((item) => (
                                <Dropdown.Item key={item.id}>{item.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Huỷ
                    </Button>
                    <Button auto onClick={handleAddCategory}>
                        Lưu
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}
export function EditModal({ category }) {
    const [visible, setVisible] = useState(false);
    const [categoryNew, setCategoryNew] = useState(category)
    const handler = async () => {
        setVisible(true)
    };
    const handleChangeName = (e) => {
        setCategoryNew({ ...categoryNew, name: e.target.value })
    }
    const handleChangeState = (e) => {
        setCategoryNew({ ...categoryNew, state: e })
    }
    const closeHandler = () => {
        setCategoryNew(category)
        setVisible(false);
    };
    const updateCategory = async (data, id) => {
        if (validator.isEmpty(data.name)) {
            toast.error('Vui lòng nhập tên danh mục', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else {
            const w = toast.loading('Vui lòng chờ ...!')
            let res = await updateCategoryByAdmin(data, id)
            if (res.success) {
                UpdateSuccessNavigate(w, 'Cập nhật danh mục thành công', '/admin?page=category')
            } else {
                UpdateError(w, 'Cập nhật danh mục thất bại')
            }
        }
    }
    const handleUpdateCategory = () => {
        updateCategory(categoryNew, categoryNew.id)
    }
    return (
        <div>
            <Button auto light onClick={handler}>
                <Edit />
            </Button>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={20} b>
                        CHÌNH SỬA DANH MỤC
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Input size='lg' value={categoryNew.name} onChange={handleChangeName} />
                    <Radio.Group label="Trạng thái" value={categoryNew.state} onChange={handleChangeState} orientation='horizontal'>
                        <Radio value="enable">Kích hoạt</Radio>
                        <Radio value="disable">Vô hiệu hoá</Radio>
                    </Radio.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Huỷ
                    </Button>
                    <Button auto onClick={handleUpdateCategory}>
                        Lưu
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}
function TableCategories({ categories, show }) {
    const collator = useCollator({ numeric: true });
    async function load() {
        return { items: categories }
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
    const state = {
        enable: 'Hiển thị',
        disable: 'Vô hiệu hóa',
    };
    return (
        <div id='category' hidden={show}>
            <Row justify='space-between' align='center' css={{ marginTop: '$5', marginBottom: '$5' }}>
                <Text b size={20}>DANH MỤC</Text>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CSVLink
                        data={categories}
                        filename={"categories.csv"}
                        className="btn btn-primary"
                        target="_blank"
                        style={{ marginRight: 10 }}
                    >
                        Export CSV
                    </CSVLink>
                    <AddModal categories={categories} />
                </div>
            </Row>
            <Table
                bordered
                shadow={false}
                color="primary"
                aria-label="Categories table"
                css={{
                    height: "calc($space$14 * 10)",
                    minWidth: "100%",
                }}
                selectionMode="single"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
            >
                <Table.Header>
                    <Table.Column align='center' key={'name'} allowsSorting>TÊN DANH MỤC*</Table.Column>
                    <Table.Column align='center'>DANH MỤC GỐC</Table.Column>
                    <Table.Column align='center' key={'state'} allowsSorting>TRẠNG THÁI*</Table.Column>
                    <Table.Column>CHỈNH SỬA</Table.Column>
                </Table.Header>
                <Table.Body items={list.items} loadingState={list.loadingState}>
                    {(item) => (
                        <Table.Row key={item.id}>
                            <Table.Cell css={{ d: 'flex', justifyContent: 'center', h: '100%', alignItems: 'center' }}>{item.name}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{item.root ? <CheckOutlined sx={{ verticalAlign: 'unset' }} /> : ''}</Table.Cell>
                            <Table.Cell css={{ d: 'flex', justifyContent: 'center', h: '100%', alignItems: 'center' }} >
                                <StyledBadge type={item.state}>{state[item.state]}</StyledBadge>
                            </Table.Cell>
                            <Table.Cell>
                                <EditModal sx={{ verticalAlign: 'unset' }} category={item} />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
                <Table.Pagination
                    total={Math.ceil(categories.length / 4)}
                    loop
                    shadow
                    noMargin
                    align="center"
                    color={'warning'}
                    rowsPerPage={4}
                />
            </Table>
        </div>

    );
}

export default TableCategories;