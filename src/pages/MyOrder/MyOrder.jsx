import { RemoveRedEyeOutlined } from '@mui/icons-material';
import { Divider, Grid, Loading, Text } from '@nextui-org/react';
import { Table } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/UserService';
import { StyledBadge } from './StyledBadge';

export default function MyOrder() {
    let navigate = useNavigate();
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const [now, setNow] = useState([]);
    const [last, setLast] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function getData() {
            setLoading(true);
            let res = await getOrders();
            if (res.success) {
                let temp1 = res.data.filter((order) => order.state !== 'paid');
                let temp2 = res.data.filter((order) => order.state === 'paid');
                setNow(temp1);
                setLast(temp2);
                setLoading(false);
            } else {
                setLoading('404');
            }
        }
        getData();
    }, []);
    const state = {
        'enable': 'Hiện tại',
        'done': 'Hoàn tất',
        'process': 'Đang xử lý',
        'pending': 'Đang chờ xác nhận',
        'delivery': 'Đang giao hàng',
        'cancel': 'Đã hủy',
    }

    return (
        <>
            {loading === true ? (
                <Grid.Container wrap="wrap" justify="center" gap={2}>
                    <Grid xs={12} css={{ w: '100vw', h: '100vh' }} alignItems="center" justify="center">
                        <Loading size="xl" type="gradient" color={'warning'} />
                    </Grid>
                </Grid.Container>
            ) : (
                <>
                    {loading === '404' ? (
                        <Grid.Container wrap="wrap" justify="center" gap={2}>
                            <Grid xs={12} css={{ w: '100vw', h: '100vh' }} alignItems="center" justify="center">
                                <Text size={30} css={{ textAlign: 'center' }}>
                                    Bạn chưa có đơn hàng nào !!!
                                </Text>
                            </Grid>
                        </Grid.Container>
                    ) : (
                        <>
                            <Text size={30} css={{ textAlign: 'center' }}>
                                Đơn hàng hiện tại
                            </Text>
                            <Table
                                aria-label="Example table with dynamic content"
                                css={{
                                    height: 'auto',
                                    minWidth: '100%',
                                }}
                            >
                                <Table.Header>
                                    <Table.Column>MÃ ĐƠN HÀNG</Table.Column>
                                    <Table.Column>NGƯỜI ĐẶT</Table.Column>
                                    <Table.Column>TỔNG SỐ TIỀN</Table.Column>
                                    <Table.Column>SỐ LƯỢNG SẢN PHẨM</Table.Column>
                                    <Table.Column>TRẠNG THÁI</Table.Column>
                                    <Table.Column></Table.Column>
                                </Table.Header>

                                <Table.Body>
                                    {now.map((row) => (
                                        <Table.Row key={row.id}>
                                            <Table.Cell>{row.id}</Table.Cell>
                                            <Table.Cell>{row.userName}</Table.Cell>
                                            <Table.Cell>{formatPrice(row.totalPrice)}</Table.Cell>
                                            <Table.Cell>{row.totalProduct}</Table.Cell>
                                            <Table.Cell>
                                                <StyledBadge type={row.state}>{state[row.state]}</StyledBadge>
                                            </Table.Cell>
                                            <Table.Cell css={{ display: 'flex', justifyContent: 'center' }}>
                                                <button onClick={() => navigate(`/orderDetail/${row.id}`)}>
                                                    <RemoveRedEyeOutlined />
                                                </button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                                <Table.Pagination
                                    shadow
                                    noMargin
                                    align="center"
                                    color={'warning'}
                                    rowsPerPage={3}
                                    onPageChange={(page) => console.log({ page })}
                                />
                            </Table>
                            <Divider />
                            <Text size={30} css={{ textAlign: 'center' }}>
                                Đơn hàng hoàn tất
                            </Text>
                            <Table
                                aria-label="Example table with dynamic content"
                                css={{
                                    height: 'auto',
                                    minWidth: '100%',
                                }}
                            >
                                <Table.Header>
                                    <Table.Column>MÃ ĐƠN HÀNG</Table.Column>
                                    <Table.Column>NGƯỜI ĐẶT</Table.Column>
                                    <Table.Column>TỔNG SỐ TIỀN</Table.Column>
                                    <Table.Column>SỐ LƯỢNG SẢN PHẨM</Table.Column>
                                    <Table.Column>TRẠNG THÁI</Table.Column>
                                    <Table.Column></Table.Column>
                                </Table.Header>

                                <Table.Body>
                                    {last.map((row) => (
                                        <Table.Row key={row.id}>
                                            <Table.Cell>{row.id}</Table.Cell>
                                            <Table.Cell>{row.userName}</Table.Cell>
                                            <Table.Cell>{formatPrice(row.totalPrice)}</Table.Cell>
                                            <Table.Cell>{row.totalProduct}</Table.Cell>
                                            <Table.Cell>
                                                <StyledBadge type={row.state}>{row.state}</StyledBadge>
                                            </Table.Cell>
                                            <Table.Cell css={{ display: 'flex', justifyContent: 'center' }}>
                                                <button onClick={() => navigate(`/orderDetail/${row.id}`)}>
                                                    <RemoveRedEyeOutlined />
                                                </button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                                <Table.Pagination
                                    shadow
                                    noMargin
                                    align="center"
                                    color={'warning'}
                                    rowsPerPage={3}
                                    // onPageChange={(page) => console.log({ page })}
                                />
                            </Table>
                        </>
                    )}
                </>
            )}
        </>
    );
}
