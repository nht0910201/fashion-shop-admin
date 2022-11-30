import { Edit } from '@mui/icons-material';
import { Button, Row, Table, User, Modal, Text, Radio, Input, useAsyncList, useCollator } from '@nextui-org/react'
import { useState } from 'react';
import { addUserByAdmin, updateUserByAdmin } from '../../../services/AdminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateError } from '../../../components/Alert/UpdateError';
import { UpdateSuccessNavigate } from '../../../components/Alert/UpdateSuccessNavigate';
import { StyledBadge } from '../../MyOrder/StyledBadge';
import { CSVLink } from "react-csv";
import validator from 'validator';

export function AddModal() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('')
    const [role, setRole] = useState('ROLE_STAFF')
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const closeHandler = () => {
        setName('')
        setEmail('')
        setPass('')
        setRole('ROLE_STAFF')
        setVisible(false);
    };
    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleChangePass = (e) => {
        setPass(e.target.value)
    }
    const handleChangeRole = (e) => {
        setRole(e)
    }
    const adduser = async ({ name, email, password, phone, province, district, ward, address, gender, role }) => {
        if(validator.isEmpty(name)){
            toast.error('Vui lòng nhập tên người dùng', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if(!validator.isEmail(email)){
            toast.error('Email sai định dạng. Vui lòng nhập lại', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if(validator.isEmpty(password)){
            toast.error('Vui lòng nhập mật khẩu', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if(password.length < 8){
            toast.error('Vui lòng nhập mật khẩu có ít nhất 8 kí tự', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else{
            const wait = toast.loading("Vui lòng chờ ...")
            let res = await addUserByAdmin({ name, email, password, phone, province, district, ward, address, gender, role })
            if (res.data.success) {
                UpdateSuccessNavigate(wait, 'Thêm tài khoản thành công', '/admin?page=user')
            } else {
                UpdateError(wait, 'Thêm tài khoản thất bại')
            }
        }  
    }
    let phone = '0909090909'
    let province = 0
    let district = 0
    let ward = 0
    let address = 'unknown'
    let gender = 'other'
    const handleClickAddUSer = () => {
        adduser({ name, email, password, phone, province, district, ward, address, gender, role })
    }
    return (
        <div>
            <Button auto ghost onClick={handler} color={'warning'}>
                Thêm tài khoản
            </Button>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={20} b>
                        THÊM TÀI KHOẢN
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Input size='lg' placeholder="Tên người dùng" type={'text'} value={name} onChange={handleChangeName} />
                    <Input size='lg' placeholder="Email" type={'email'} value={email} onChange={handleChangeEmail} />
                    <Input size='lg' placeholder="Mật khẩu" type={'password'} value={password} onChange={handleChangePass} />
                    <Radio.Group label="Role" orientation='horizontal' value={role} onChange={handleChangeRole}>
                        <Radio value="ROLE_STAFF">Nhân viên</Radio>
                        <Radio value="ROLE_USER">Khách hàng</Radio>
                    </Radio.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Huỷ
                    </Button>
                    <Button auto onClick={handleClickAddUSer}>
                        Lưu
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>

        </div>
    );
}
export function EditModal({ user }) {
    const [visible, setVisible] = useState(false);
    const [userNew, setUserNew] = useState(user)
    const handler = async () => {
        setVisible(true)
    };
    const handleChangeUser = (e) => {
        setUserNew({ ...userNew, state: e })
    }
    const closeHandler = () => {
        setUserNew(user)
        setVisible(false);
    };
    const updateUser = async (data, id) => {
        const w = toast.loading("Vui lòng chờ ...")
        let res = await updateUserByAdmin(data, id)
        if (res.success) {
            UpdateSuccessNavigate(w, 'Cập nhật tài khoản thành công', '/admin?page=user');
        } else {
            UpdateError(w, 'Cập nhật tài khoản thất bại')
        }
    }
    const handleUpdateUser = () => {
        updateUser(userNew, userNew.id)
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
                        CHÌNH SỬA TÀI KHOẢN
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <Radio.Group label="Trạng thái" value={userNew.state} onChange={handleChangeUser} orientation='horizontal'>
                        <Radio value="activated">Kích hoạt</Radio>
                        <Radio value="deactivated">Vô hiệu hoá</Radio>
                    </Radio.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Huỷ
                    </Button>
                    <Button auto onClick={handleUpdateUser}>
                        Lưu
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}

function TableUser({ users, show }) {
    const collator = useCollator({ numeric: true });
    async function load() {
        return { items: users.list }
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
        activated: 'Hiển thị',
        deactivated: 'Vô hiệu hóa',
        unverify: 'Chưa xác nhận',
    };
    return (
        <div id='user' hidden={show}>
            <Row justify='space-between' align='center' css={{ marginTop: '$5', marginBottom: '$5' }}>
                <Text b size={20}>TÀI KHOẢN</Text>
                <div style={{display:'flex',alignItems:'center'}}>
                    <CSVLink
                        data={users.list}
                        filename={"users.csv"}
                        className="btn btn-primary"
                        target="_blank"
                        style={{marginRight:10}}
                    >
                        Export CSV
                    </CSVLink>
                    <AddModal/>
                </div>
            </Row>
            <Table
                bordered
                shadow={false}
                color="primary"
                aria-label="Users table"
                css={{
                    height: "calc($space$14 * 10)",
                    minWidth: "100%",
                }}
                selectionMode="single"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
            >
                <Table.Header>
                    <Table.Column key={'name'} allowsSorting>TÀI KHOẢN*</Table.Column>
                    <Table.Column align='center'>EMAIL</Table.Column>
                    <Table.Column align='center'>SỐ ĐIỆN THOẠI</Table.Column>
                    <Table.Column align='center' key={'role'} allowsSorting>PHÂN QUYỀN*</Table.Column>
                    <Table.Column align='center' key={'state'} allowsSorting>TRẠNG THÁI*</Table.Column>
                    <Table.Column>CHỈNH SỬA</Table.Column>
                </Table.Header>

                <Table.Body items={list.items} loadingState={list.loadingState}>
                    {(item) => (
                        <Table.Row key={item.id}>
                            <Table.Cell>
                                <User
                                    src={item.avatar}
                                    name={item.name}
                                />
                            </Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{item.email}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{item.phone}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{item.role}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>
                                <StyledBadge type={item.state}>{state[item.state]}</StyledBadge>
                            </Table.Cell>
                            <Table.Cell css={{d:'flex',justifyContent:'center',h:'100%',alignItems:'center'}}>
                                <EditModal user={item} />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
                <Table.Pagination
                    total={Math.ceil(users.totalQuantity / 5)}
                    loop
                    shadow
                    noMargin
                    align="center"
                    color={'warning'}
                    rowsPerPage={5}
                />
            </Table>
        </div>

    );
}

export default TableUser;