import { FilterAlt, LocalShipping, NoCrash, Visibility } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Grid,
    Image,
    Loading,
    Modal,
    Popover,
    Row,
    Table,
    Text,
    useAsyncList,
    useCollator,
} from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { getOrderByIDByAdmin } from '../../../services/AdminService';
import { getDistrict, getProvince, getWard } from '../../../services/AuthService';
import { cancelOrderByAdmin, changeStateOrder, confirmOrderByAdmin, createShipping } from '../../../services/Payment';
import { UpdateSuccessNavigate } from '../../../components/Alert/UpdateSuccessNavigate';
import { UpdateError } from '../../../components/Alert/UpdateError';
import { StyledBadge } from '../../MyOrder/StyledBadge';
import { CSVLink } from "react-csv";
import {Button as Button2} from '@mui/material'
import { filter } from 'smart-array-filter'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
export function OrderModal({ orderId }) {
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
    };
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [order, SetOrder] = useState({});
    useEffect(() => {
        async function getOrder() {
            let res = await getOrderByIDByAdmin(orderId);
            if (res.success) {
                SetOrder(res.data);
            }
        }
        getOrder();
    }, []);
    useEffect(() => {
        async function getProvinceAPI(data) {
            let provinces = await getProvince({ data });
            if (provinces.message === 'Success') {
                setProvinces(provinces.data);
            }
        }
        getProvinceAPI({});
    }, []);
    useEffect(() => {
        async function getDistrictAPI(province_id) {
            let districts = await getDistrict({ province_id });
            if (districts.message === 'Success') {
                setDistricts(districts.data);
            }
        }
        getDistrictAPI(+order.deliveryDetail?.receiveProvince);
    }, [order]);
    useEffect(() => {
        async function getWardAPI(district_id) {
            let wards = await getWard({ district_id });
            if (wards.message === 'Success') {
                setWards(wards.data);
            }
        }
        getWardAPI(+order.deliveryDetail?.receiveDistrict);
    }, [order.deliveryDetail?.receiveDistrict]);
    const confirmOrder = async () => {
        const wait = toast.loading('Vui l??ng ch??? ... !');
        let res = await confirmOrderByAdmin(orderId);
        if (res.success) {
            UpdateSuccessNavigate(wait, 'X??c nh???n ????n h??ng th??nh c??ng', '/admin?page=order');
        } else {
            UpdateError(wait, 'X??c nh???n ????n h??ng kh??ng th??nh c??ng');
        }
    };
    const handleConfirm = () => {
        confirmOrder();
    };
    const cancelOrder = async () => {
        const wait = toast.loading('Vui l??ng ch??? ... !');
        let res = await cancelOrderByAdmin(orderId);
        if (res.success) {
            UpdateSuccessNavigate(wait, 'Hu??? ????n h??ng th??nh c??ng', '/admin?page=order');
        } else {
            UpdateError(wait, 'Hu??? ????n h??ng kh??ng th??nh c??ng');
        }
    };
    const handleCancel = () => {
        cancelOrder();
    };
    const deliverylOrder = async (data) => {
        const wait = toast.loading('Vui l??ng ch??? ... !');
        let res = await createShipping(orderId, data);
        if (res.data.success) {
            UpdateSuccessNavigate(wait, 'Ti???n h??nh giao h??ng th??nh c??ng', '/admin?page=order');
        } else {
            UpdateError(wait, 'Ti???n h??nh giao h??ng kh??ng th??nh c??ng');
        }
    };
    const handleDelivery = () => {
        let data = {
            to_province_name:provinces.filter(province => {
                return province.ProvinceID === +order.deliveryDetail?.receiveProvince
                })[0]?.ProvinceName,
            to_district_name: districts.filter(district => {
                return district.DistrictID === +order.deliveryDetail?.receiveDistrict
            })[0]?.DistrictName,
            to_ward_name: wards.filter(ward => {
                return ward.WardCode === order.deliveryDetail?.receiveWard
            })[0]?.WardName,
            items: order.items?.map(({name, quantity}) => ({name, quantity}))
        }
        deliverylOrder(data);
    };

    const handleStateOrder = async () => {
        const wait = toast.loading('Vui l??ng ch??? ... !');
        let res = await changeStateOrder(orderId, 'delivered');
        if (res.success) {
            UpdateSuccessNavigate(wait, 'X??c nh???n ???? giao h??ng th??nh c??ng', '/admin?page=order');
        } else {
            UpdateError(wait, 'X??c nh???n ???? giao h??ng kh??ng th??nh c??ng');
        }
    };
    const handleChangeState = () => {
        handleStateOrder();
    };
    return (
        <>
            {!order.id ? (
                <div>
                    <Button light auto onClick={handler}>
                        <Visibility />
                    </Button>
                    <Modal width="50%" aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
                        <Modal.Body>
                            <Grid.Container wrap="wrap" justify="center" gap={2}>
                                <Grid xs={12} css={{ w: '100vw', h: '50vh' }} alignItems="center" justify="center">
                                    <Loading size="xl" type="gradient" color={'warning'} />
                                </Grid>
                            </Grid.Container>
                        </Modal.Body>
                    </Modal>
                </div>
            ) : (
                <div>
                    <Button light auto onClick={handler}>
                        <Visibility />
                    </Button>
                    <Modal
                        width="60%"
                        scroll
                        closeButton
                        aria-labelledby="modal-title"
                        open={visible}
                        onClose={closeHandler}
                    >
                        <Modal.Header>
                            <Text id="modal-title" size={18}>
                                ????n h??ng: <Text b>{order.id}</Text>
                            </Text>
                        </Modal.Header>
                        <Modal.Body>
                            <Grid.Container wrap="wrap" gap={1} justify={'center'}>
                                <Grid xs={12} lg={8} direction="column" justify="center">
                                    <Divider />
                                    {order.items?.map((item) => (
                                        <Row key={item.id} justify="space-between">
                                            <Grid>
                                                <Image
                                                    autoResize
                                                    objectFit="contain"
                                                    width={100}
                                                    height={100}
                                                    src={item.image}
                                                    alt="...Loading"
                                                />
                                            </Grid>

                                            <Col>
                                                <Row css={{ marginTop: '$5' }}>{item.name}</Row>
                                                <Row align="center">
                                                    <Text size={18}>SL: {item.quantity} /</Text>
                                                    <Text size={18} css={{ marginLeft: '$2', marginRight: '$2' }}>
                                                        Size: {item.size}/ M??u:
                                                    </Text>
                                                    <span
                                                        className={classNames(
                                                            'z-10 h-5 w-5 border border-black border-opacity-10 rounded-full',
                                                        )}
                                                        style={{ backgroundColor: item.color }}
                                                    ></span>
                                                </Row>
                                                <Row>
                                                    <Text css={{ marginRight: '$10' }} size={20}>
                                                        {formatPrice(item.subPrice)}
                                                    </Text>
                                                </Row>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Divider />
                                    <Row gap={2}>
                                        <Col>
                                            <Text size={'$2xl'} weight={'semibold'}>T???m t??nh:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$2xl'}>{formatPrice(order?.totalPrice)}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>H??nh th???c thanh to??n:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>{order?.paymentType || 'Ch??a c??'}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>Ng?????i nh???n:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>{order.deliveryDetail?.receiveName || 'Ch??a c??'}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>S??? ??i???n tho???i:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>{order.deliveryDetail?.receivePhone || 'Ch??a c??'}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>?????a ch???:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>
                                                {order.deliveryDetail?.receiveAddress}/
                                                {wards.map((ward) =>
                                                    ward.WardCode === order.deliveryDetail?.receiveWard
                                                        ? ward.WardName
                                                        : '',
                                                )}
                                                /
                                                {districts.map((district) =>
                                                    district.DistrictID === +order.deliveryDetail?.receiveDistrict
                                                        ? district.DistrictName
                                                        : '',
                                                )}
                                                /
                                                {provinces.map((province) =>
                                                    province.ProvinceID === +order.deliveryDetail?.receiveProvince
                                                        ? province.ProvinceName
                                                        : '',
                                                )}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>Ph?? v???n chuy???n:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>{formatPrice(order.deliveryDetail.deliveryInfo?.fee || 0)}</Text>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row gap={2}>
                                        <Col>
                                            <Text size={'$3xl'} weight={'semibold'}>T???ng c???ng:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$3xl'}>{formatPrice(order.totalPrice + order.deliveryDetail.deliveryInfo?.fee || order.totalPrice)}</Text>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Grid.Container>
                        </Modal.Body>
                        <Modal.Footer justify="center">
                            {order?.state === 'pending' ? (
                                <>
                                    <Button auto flat color="error" onClick={handleCancel}>
                                        Hu??? ????n h??ng
                                    </Button>
                                    <Button auto color={'gradient'} onClick={handleConfirm}>
                                        X??c nh???n ????n h??ng
                                    </Button>
                                </>
                            ) : order?.state === 'prepare' ? (
                                <>
                                    <Button auto color={'gradient'} onClick={handleDelivery}>
                                         Giao h??ng <LocalShipping sx={{ml: 1}}/>
                                    </Button>
                                </>
                            ) : order?.state === 'delivery' ? (
                                <>
                                    <Button auto color={'gradient'} onClick={handleChangeState}>
                                         X??c nh???n giao h??ng th??nh c??ng <NoCrash sx={{ml: 1}}/>
                                    </Button>
                                </>
                            ) :(
                                <></>
                            )}
                        </Modal.Footer>
                        <ToastContainer />
                    </Modal>
                </div>
            )}
        </>
    );
}
function TableOrder({ orders, show }) {
    const collator = useCollator({ numeric: true });
    const [orderList, setList] = useState(orders.list)
    const [filOrder, setFilOrder] = useState([])
    const handleChangeFilOrder = (e) => {
        setFilOrder(e)
    }
    const filterOrder = async () => {
        let arr = orders.list
        if (filOrder.length > 0) {
            arr = filter(arr, {
                keywords: `state:=${filOrder}`
            })
            if (arr.length >= 0) {
                setList(arr)
            }
        }
    }
    const resetFilter = async () => {
        setFilOrder([])
        setList(orders.list)
    }
    async function load() {
        return { items: orderList};
    }
    async function sort({ items, sortDescriptor }) {
        return {
            items: items.sort((a, b) => {
                let first = a[sortDescriptor.column];
                let second = b[sortDescriptor.column];
                let cmp = collator.compare(first, second);
                if (sortDescriptor.direction === 'descending') {
                    cmp *= -1;
                }
                return cmp;
            }),
        };
    }
    let list = useAsyncList({ load, sort });
    useEffect(() => {
        list.reload()
    }, [orderList])
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const state = {
        enable: 'Hi???n t???i',
        done: 'Ho??n t???t',
        process: '??ang x??? l??',
        pending: '??ang ch??? x??c nh???n',
        delivery: '??ang giao h??ng',
        prepare: '??ang chu???n b??? h??ng',
        delivered: '???? giao h??ng',
        cancel: '???? h???y',
    };
    return (
        <span hidden={show} id="order">
            <Row justify="space-between" align="center" css={{ marginTop: '$5', marginBottom: '$5' }}>
                <Text b size={20}>
                    ????N H??NG
                </Text>
                <CSVLink
                    data={orders.list}
                    filename={"orders.csv"}
                    className="btn btn-primary"
                    target="_blank"
                >
                    Xu???t CSV
                </CSVLink>
            </Row>
            <Row justify='space-between' align='center' css={{marginBottom:'$4'}}>
                <Popover placement='bottom-left'>
                    <Popover.Trigger>
                    <Button auto light animated={false}>
                            L???c ????n h??ng
                            <FilterAlt/>
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content css={{ marginRight: '$0', width: '80%' }}>
                        <Grid.Container
                            css={{ borderRadius: "14px", padding: "$10" }}
                        >
                            <Row>
                                <Checkbox.Group
                                    label="Ch???n tr???ng th??i"
                                    orientation="horizontal"
                                    color="warning"
                                    value={filOrder}
                                    onChange={handleChangeFilOrder}
                                >
                                    <Checkbox css={{ textAlign: 'center' }} value="enable">Hi???n th???</Checkbox>
                                    <Checkbox css={{ textAlign: 'center' }} value="done">Ho??n t???t</Checkbox>
                                    <Checkbox css={{ textAlign: 'center' }} value="process">??ang x??? l??</Checkbox>
                                    <Checkbox css={{ textAlign: 'center' }} value="pending">??ang ch??? x??c nh???n</Checkbox>
                                    <Checkbox css={{ textAlign: 'center' }} value="prepare">??ang chu???n b??? h??ng</Checkbox>
                                    <Checkbox css={{ textAlign: 'center' }} value="delivery">??ang giao h??ng</Checkbox>
                                    <Checkbox css={{ textAlign: 'center' }} value="cancel">???? h???y</Checkbox>
                                </Checkbox.Group>
                            </Row>
                            <Grid.Container justify="flex-end" alignContent="center" gap={1}>
                                <Grid>
                                    <Button size="sm" color="warning" onClick={filterOrder}>
                                        Xem k???t qu???
                                    </Button>

                                </Grid>
                                <Grid>
                                    <Button size="sm" bordered color={'error'} onClick={resetFilter}>
                                        Xo?? b??? l???c
                                    </Button>
                                </Grid>
                            </Grid.Container>

                        </Grid.Container>
                    </Popover.Content>
                </Popover>
                <Row justify='flex-end' align='center'>
                    {filOrder.length > 0 ?
                        <>
                            <Text size={'$lg'} css={{marginRight:'$2'}}>L???c theo tr???ng th??i: </Text>
                            {filOrder.map((state) => (
                                <Button2 variant="outlined" color='inherit'>
                                    {state === 'enable' ? 'Hi???n t???i':
                                        state === 'done' ? 'Ho??n t???t':
                                            state === 'process' ? '??ang x??? l??':
                                                state === 'pending' ? '??ang ch??? x??c nh???n':
                                                    state ==='delivery'?'??ang giao h??ng':
                                                        state ==='prepare'?'??ang chu???n b??? h??ng':
                                                            state ==='delivered'?'???? giao h??ng':
                                                            '???? hu???'}
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
                color="warning"
                aria-label="Orders table"
                css={{
                    height: 'calc($space$14 * 10)',
                    minWidth: '100%',
                }}
                selectionMode="single"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
            >
                <Table.Header>
                    <Table.Column>M?? ????N H??NG</Table.Column>
                    <Table.Column align='center' key={'createdDate'} allowsSorting>NG??Y ?????T*</Table.Column>
                    <Table.Column align="center" key={'userName'} allowsSorting>
                        NG?????I ?????T*
                    </Table.Column>
                    <Table.Column align="center" key={'totalProduct'} allowsSorting>
                        S??? L?????NG S???N PH???M*
                    </Table.Column>
                    <Table.Column align="center" key={'totalPrice'} allowsSorting>
                        T???NG S??? TI???N*
                    </Table.Column>
                    <Table.Column align="center" key={'state'} allowsSorting>
                        TR???NG TH??I*
                    </Table.Column>
                    <Table.Column></Table.Column>
                </Table.Header>

                <Table.Body items={list.items} loadingState={list.loadingState}>
                    {(order) => (
                        <Table.Row key={order.id}>
                            <Table.Cell>{order.id}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{order.createdDate}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{order.userName}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{order.totalProduct}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>{formatPrice(order.totalPrice)}</Table.Cell>
                            <Table.Cell css={{textAlign:'center'}}>
                                <StyledBadge type={order.state}>{state[order.state]}</StyledBadge>
                            </Table.Cell>
                            <Table.Cell css={{d:'flex',justifyContent:'center',h:'100%',alignItems:'center'}}>
                                <OrderModal orderId={order.id} />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
                <Table.Pagination
                    total={Math.ceil(orderList.length / 10)}
                    shadow
                    noMargin
                    align="center"
                    color={'warning'}
                    rowsPerPage={10}
                />
            </Table>
        </span>
    );
}

export default TableOrder;
