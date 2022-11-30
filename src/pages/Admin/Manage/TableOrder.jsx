import { Visibility } from '@mui/icons-material';
import {
    Button,
    Col,
    Divider,
    Grid,
    Image,
    Loading,
    Modal,
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
import { cancelOrderByAdmin, confirmOrderByAdmin } from '../../../services/Payment';
import { UpdateSuccessNavigate } from '../../../components/Alert/UpdateSuccessNavigate';
import { UpdateError } from '../../../components/Alert/UpdateError';
import { StyledBadge } from '../../MyOrder/StyledBadge';
import { CSVLink } from "react-csv";

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
    }, [order]);
    const confirmOrder = async () => {
        const wait = toast.loading('Vui lòng chờ ... !');
        let res = await confirmOrderByAdmin(orderId);
        if (res.success) {
            UpdateSuccessNavigate(wait, 'Xác nhận đơn hàng thành công', '/admin?page=order');
        }
    };
    const handleConfirm = () => {
        confirmOrder();
    };
    const cancelOrder = async () => {
        const wait = toast.loading('Vui lòng chờ ... !');
        let res = await cancelOrderByAdmin(orderId);
        console.log(res);
        if (res.success) {
            UpdateSuccessNavigate(wait, 'Huỷ đơn hàng thành công', '/admin?page=order');
        } else {
            UpdateError(wait, 'Huỷ đơn hàng không thành công');
        }
    };
    const handleCancel = () => {
        cancelOrder();
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
                                Đơn hàng: <Text b>{order.id}</Text>
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
                                                        Size: {item.size}/ Màu:
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
                                            <Text size={'$2xl'} weight={'semibold'}>Tạm tính:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$2xl'}>{formatPrice(order?.totalPrice)}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>Hình thức thanh toán:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>{order?.paymentType || 'Chưa có'}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>Người nhận:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>{order.deliveryDetail?.receiveName || 'Chưa có'}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>Số điện thoại:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>{order.deliveryDetail?.receivePhone || 'Chưa có'}</Text>
                                        </Col>
                                    </Row>
                                    <Row gap={2} justify="center">
                                        <Col>
                                            <Text size={'$xl'} weight={'semibold'}>Địa chỉ:</Text>
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
                                            <Text size={'$xl'} weight={'semibold'}>Phí vận chuyển:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$xl'}>Miễn phí</Text>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row gap={2}>
                                        <Col>
                                            <Text size={'$3xl'} weight={'semibold'}>Tổng cộng:</Text>
                                        </Col>
                                        <Col>
                                            <Text size={'$3xl'}>{formatPrice(order.totalPrice)}</Text>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Grid.Container>
                        </Modal.Body>
                        <Modal.Footer justify="center">
                            {order?.state === 'pending' ? (
                                <>
                                    <Button auto flat color="error" onClick={handleCancel}>
                                        Huỷ đơn hàng
                                    </Button>
                                    <Button auto onClick={handleConfirm}>
                                        Xác nhân đơn hàng
                                    </Button>
                                </>
                            ) : (
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
    async function load() {
        return { items: orders.list };
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
    const list = useAsyncList({ load, sort });
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const state = {
        enable: 'Hiện tại',
        done: 'Hoàn tất',
        process: 'Đang xử lý',
        pending: 'Đang chờ xác nhận',
        delivery: 'Đang giao hàng',
        cancel: 'Đã hủy',
    };
    return (
        <span hidden={show} id="order">
            <Row justify="space-between" align="center" css={{ marginTop: '$5', marginBottom: '$5' }}>
                <Text b size={20}>
                    ĐƠN HÀNG
                </Text>
                <CSVLink
                    data={orders.list}
                    filename={"orders.csv"}
                    className="btn btn-primary"
                    target="_blank"
                >
                    Export CSV
                </CSVLink>
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
                    <Table.Column>MÃ ĐƠN HÀNG</Table.Column>
                    <Table.Column align="center" key={'userName'} allowsSorting>
                        NGƯỜI ĐẶT*
                    </Table.Column>
                    <Table.Column align="center" key={'totalProduct'} allowsSorting>
                        SỐ LƯỢNG SẢN PHẨM*
                    </Table.Column>
                    <Table.Column align="center" key={'totalPrice'} allowsSorting>
                        TỔNG SỐ TIỀN*
                    </Table.Column>
                    <Table.Column align="center" key={'state'} allowsSorting>
                        TRẠNG THÁI*
                    </Table.Column>
                    <Table.Column></Table.Column>
                </Table.Header>

                <Table.Body items={list.items} loadingState={list.loadingState}>
                    {(order) => (
                        <Table.Row key={order.id}>
                            <Table.Cell>{order.id}</Table.Cell>
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
                    total={Math.ceil(orders.totalQuantity / 5)}
                    shadow
                    noMargin
                    align="center"
                    color={'warning'}
                    rowsPerPage={5}
                />
            </Table>
        </span>
    );
}

export default TableOrder;
