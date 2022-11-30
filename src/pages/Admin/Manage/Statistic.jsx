import { Button, Card, Grid, Input, Loading, Progress, Row, Text } from "@nextui-org/react";
import moment from "moment/moment";
import { useState } from "react";
import { getStatsOrderByAdmin } from "../../../services/AdminService";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


function Statistic({ stats, show }) {
    console.log(stats)
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);

    const [loading, setLoad] = useState(false)
    const [data, setData] = useState([])
    const [type, setType] = useState('day')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const handleChangeType = (e) => {
        setType(e.target.value)
    }
    const handleChangeFrom = (e) => {
        setFrom(e.target.value)
    }
    const handleChangeTo = (e) => {
        setTo(e.target.value)
    }
    const getStats = async (from, to, type) => {
        setLoad(true)
        let stats = await getStatsOrderByAdmin(moment(from).format('DD-MM-YYYY'), moment(to).format('DD-MM-YYYY'), type);
        if (stats.success) {
            setData(stats.data)
            setLoad(false)
        }
    }
    const hanleClickStats = () => {
        getStats(from, to, type)
    }
    return (
        <div hidden={show} id='stats'>
            <Row justify='center' align='center' css={{ marginTop: '$5', marginBottom: '$5' }}>
                <Text b size={30}>THỐNG KÊ</Text>
            </Row>
            <Grid.Container gap={1}>
                <Grid xs={12} sm={4}>
                    <Card isHoverable css={{ backgroundColor: 'white' }} variant="bordered">
                        <Card.Header>
                            <Text b>Sản phẩm</Text>
                        </Card.Header>
                        <Card.Divider />
                        <Card.Body css={{ py: "$10" }}>
                            {stats.product.list.map((state) => (
                                <>
                                    <Row align="center">
                                        <Text size={"$md"}>
                                            {state.state === 'enable' ? 'Còn hàng: ' : 'Hết hàng: '}
                                        </Text>
                                        <Text size={'$md'}>{state.count} (sản phẩm)</Text>
                                    </Row>
                                    <Progress value={state.count} color={state.state === 'disable' ? 'error' : 'success'} status={state.state === 'disable' ? 'error' : 'success'} max={stats.product.totalQuantity} />
                                </>
                            ))}
                        </Card.Body>
                    </Card>
                </Grid>
                <Grid xs={12} sm={4}>
                    <Card isHoverable variant="bordered">
                        <Card.Header>
                            <Text b>Đơn hàng</Text>
                        </Card.Header>
                        <Card.Divider />
                        <Card.Body css={{ py: "$10" }}>
                            {stats.order.list.map((state) => (
                                <>
                                    <Row align="center">
                                        <Text size={"$md"}>
                                            {state.state === 'enable' ? 'Khởi tạo: ' :
                                                state.state === 'delivery' ? 'Đang giao: ' :
                                                    state.state === 'done' ? 'Hoàn thành: ' : 
                                                        state.state ==='pending' ? 'Chờ xác nhận: ':
                                                            'Đã huỷ: '}
                                        </Text>
                                        <Text size={'$md'}>{state.count} (đơn hàng)</Text>
                                    </Row>
                                    <Progress
                                        value={state.count}
                                        color={state.state === 'cancel' ? 'error' : state.state === 'delivery' ? 'primary' : state.state === 'done' ? 'success' : 'warning'}
                                        status={state.state === 'cancel' ? 'error' : state.state === 'delivery' ? 'primary' : state.state === 'done' ? 'success' : 'warning'}
                                        max={stats.order.totalQuantity}
                                    />
                                </>
                            ))}
                        </Card.Body>
                    </Card>
                </Grid>
                <Grid xs={12} sm={4}>
                    <Card isHoverable variant="bordered" css={{ backgroundColor: "white" }}>
                        <Card.Header>
                            <Text b>Tài khoản</Text>
                        </Card.Header>
                        <Card.Divider />
                        <Card.Body css={{ py: "$10" }}>
                            {stats.user.list.map((state) => (
                                <>
                                    <Row align="center">
                                        <Text size={"$md"}>
                                            {state.state === 'activated' ? 'Đang sử dụng: ' : state.state === 'deactivated' ? 'Vô hiệu hoá: ' : 'Chưa xác thực: '}
                                        </Text>
                                        <Text size={'$md'}>{state.count} (tài khoản)</Text>
                                    </Row>
                                    <Progress
                                        value={state.count}
                                        color={state.state === 'activated' ? 'success' : state.state === 'deactivated' ? 'error' : 'warning'}
                                        status={state.state === 'activated' ? 'success' : state.state === 'deactivated' ? 'error' : 'warning'}
                                        max={stats.user.totalQuantity} />
                                </>
                            ))}
                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container>
            <Grid.Container gap={2}>
                <Grid xs={12} sm={6}>
                    <Card isHoverable css={{ backgroundColor: 'white' }} variant="bordered">
                        <Card.Header>
                            <Text b>Danh mục</Text>
                        </Card.Header>
                        <Card.Divider />
                        <Card.Body css={{ py: "$10" }}>
                            {stats.category.list.map((state) => (
                                <>
                                    <Row align="center">
                                        <Text size={"$md"}>
                                            {state.state === 'enable' ? 'Đang sử dụng: ' : 'Không sử dụng: '}
                                        </Text>
                                        <Text size={'$md'}>{state.count} (danh mục)</Text>
                                    </Row>
                                    <Progress value={state.count}
                                        color={state.state === 'enable' ? 'success' : 'error'}
                                        status={state.state === 'enable' ? 'success' : 'error'}
                                        max={stats.category.totalQuantity}
                                    />
                                </>
                            ))}
                        </Card.Body>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6}>
                <Card isHoverable css={{ backgroundColor: 'white' }} variant="bordered">
                        <Card.Header>
                            <Text b>Nhãn hàng</Text>
                        </Card.Header>
                        <Card.Divider />
                        <Card.Body css={{ py: "$10" }}>
                            {stats.brand.list.map((state) => (
                                <>
                                    <Row align="center">
                                        <Text size={"$md"}>
                                            {state.state === 'enable' ? 'Đang sử dụng: ' : 'Không sử dụng: '}
                                        </Text>
                                        <Text size={'$md'}>{state.count} (nhãn hàng)</Text>
                                    </Row>
                                    <Progress value={state.count}
                                        color={state.state === 'enable' ? 'success' : 'error'}
                                        status={state.state === 'enable' ? 'success' : 'error'}
                                        max={stats.brand.totalQuantity}
                                    />
                                </>
                            ))}
                        </Card.Body>
                    </Card>
                </Grid>
            </Grid.Container>
            <div style={{ marginTop: 50 }}>
                <Row align="center" justify="space-around" wrap="wrap">
                    <div>
                        <label for="type">Xem thống kê theo:</label>
                        <select id="type" value={type} onChange={handleChangeType}>
                            <option value="day">Ngày</option>
                            <option value="month">Tháng</option>
                            <option value="year">Năm</option>
                        </select>
                    </div>
                    <Input underlined shadow={false} type={'date'} label='Từ ngày' value={from} onChange={handleChangeFrom} />
                    <Input underlined shadow={false} type={'date'} label='Đến ngày' value={to} onChange={handleChangeTo} />
                    <Button disabled={(from === '' || to === '' || loading) ? true : false} css={{ marginTop: '$2' }} auto ghost color={'warning'} onClick={hanleClickStats}>Xem thống kê</Button>
                </Row>
                {loading ? <>
                    <Grid.Container wrap="wrap" justify="center" gap={2} >
                        <Grid xs={12} css={{ w: '100vw', h: '100vh' }} alignItems='center' justify="center">
                            <Loading size='xl' type='gradient' color={'warning'} />
                        </Grid>
                    </Grid.Container>
                </> :
                    <div hidden={data.length === 0 ? true : false}>
                        <ResponsiveContainer width={'100%'} aspect={3}>
                            <LineChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" width={70} tickFormatter={formatPrice} />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="quantity" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                }
            </div>
        </div>
    );
}

export default Statistic;