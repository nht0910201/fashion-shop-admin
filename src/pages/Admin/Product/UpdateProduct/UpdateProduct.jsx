import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { IconButton, ImageList, ImageListItem } from '@mui/material';
import { Add, DeleteForever, Edit, FileUpload } from '@mui/icons-material';
import { useState } from 'react';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChromePicker } from 'react-color';
import { getAllCategory } from '../../../../services/CategoryService';
import { addProductAttrByAdmin, addProductOptionByAdmin, delImagePooductByAdmin, getAllBrandsByAdmin, updateAttrByAdmin, updateProducOptionByAdmin, updateProductByAdmin, uploadImageByAdmin } from '../../../../services/AdminService';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductByID } from '../../../../services/ProductService';
import { Dropdown, Input, Loading, Modal, Row, Table, Text } from '@nextui-org/react';
import { UpdateSuccessReload } from '../../../../components/Alert/UpdateSuccessReload';
import { UpdateError } from '../../../../components/Alert/UpdateError';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import validator from 'validator';

const theme = createTheme();

export function EditOptionModal({ option }) {
    const [version, setVersion] = useState({ ...option, stock: option.variants[0].stock, color: option.variants[0].color })
    const [color, setColor] = useState(option.variants[0].color)
    const [oldColor, setOldColor] = useState(color.split('#')[1])

    const handleChangeSize = (e) => {
        setVersion({ ...version, name: e.target.value })
    }
    const handleChangeFee = (e) => {
        setVersion({ ...version, extraFee: e.target.value })
    }
    const handleChangeQuantity = (e) => {
        setVersion({ ...version, stock: e.target.value })
    }
    const handleChangeColor = (color) => {
        setColor(color.hex)
        setVersion({ ...version, color: color.hex })
    }
    const updateOption = async (data, id, oldColor) => {
        if (validator.isEmpty(version.name)) {
            toast.error('Vui l??ng nh???p size', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (version.extraFee < 0 || version.extraFee === '') {
            toast.error('Vui l??ng nh???p ph?? c???ng th??m', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (version.stock < 0 || version.stock === '') {
            toast.error('Vui l??ng nh???p s??? l?????ng', {
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
            const wait = toast.loading('Vui l??ng ch???...!')
            let res = await updateProducOptionByAdmin(data, id, oldColor);
            if (res.success) {
                UpdateSuccessReload(wait, 'C???p nh???t phi??n b???n th??nh c??ng', true)
            } else {
                UpdateError(wait, 'C???p nh???t kh??ng th??nh c??ng')
            }
        }

    }
    const handleSave = () => {
        updateOption(version, version.id, oldColor)
    }
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);

    const closeHandler = () => {
        setVersion({ ...option, stock: option.variants[0].stock, color: option.variants[0].color })
        setVisible(false);
    };
    return (
        <div>
            <Button auto shadow onClick={handler}>
                <Edit />
            </Button>
            <Modal
                width='50%'
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        CH???NH S???A PHI??N B???N
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown>
                        <Dropdown.Button light color="default" css={{ tt: "capitalize" }}>
                            <Button size='small' disabled sx={{ padding: 0, margin: 0 }}>
                                <span style={{ backgroundColor: color, padding: 10, border: '1px solid black', marginRight: 3 }}>
                                </span>
                                <span style={{ color: 'black' }}>{color}</span>
                            </Button>
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="secondary"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={color}
                            onAction={(key) => { setColor(key); setOldColor(key) }}
                        >
                            {option.variants.map((item) => (
                                <Dropdown.Item key={item.color}>
                                    <Button size='small' disabled sx={{ padding: 0, margin: 0 }}>
                                        <span style={{ backgroundColor: item.color, padding: 10, border: '1px solid black', marginRight: 3 }}>
                                        </span>
                                        <span style={{ color: 'black' }}>{color}</span>
                                    </Button>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Input
                        label='Size'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        value={version.name}
                        onChange={handleChangeSize}
                    />
                    <Input
                        label='Ph?? th??m'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'number'}
                        value={version.extraFee}
                        onChange={handleChangeFee}
                    />
                    <Input
                        label='S??? l?????ng'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'number'}
                        value={version.variants.filter((qty) => {
                            return qty.color === color
                        })[0]?.stock}
                        onChange={handleChangeQuantity}
                    />
                    <label style={{ fontSize: 12 }}>M??u</label>
                    <ChromePicker color={color} onChange={handleChangeColor} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='contained' color="error" onClick={closeHandler} sx={{ marginRight: 1 }}>
                        Hu???
                    </Button>
                    <Button variant='contained' onClick={handleSave}>
                        L??u
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}
export function AddOptionModal({ productId }) {
    const [name, setName] = useState('')
    const [stock, setStock] = useState(0)
    const [color, setColor] = useState('#FFFFFF')
    const [extraFee, setFee] = useState(0)
    const [preview, setPreview] = useState([])
    const [files, setFiles] = useState([])
    const handleUploadFile = (e) => {
        setFiles(e.target.files)
        setPreview([...e.target.files].map((image) => {
            return URL.createObjectURL(image)
        }))
    }
    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const handleChangeStock = (e) => {
        setStock(e.target.value)
    }
    const handleChangeFee = (e) => {
        setFee(e.target.value)
    }
    const handleChangeColor = (color) => {
        setColor(color.hex)
    }
    const addOption = async () => {
        if (validator.isEmpty(name)) {
            toast.error('Vui l??ng nh???p size', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (stock <= 0 || stock === '') {
            toast.error('Vui l??ng nh???p s??? l?????ng c???a phi??n b???n', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (extraFee < 0 || extraFee > 100 || extraFee === '') {
            toast.error('Vui l??ng nh???p ph?? c???ng th??m c???a phien b???n', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (files.length === 0) {
            toast.error('Vui l??ng ch???n ???nh c???a phi??n b???n', {
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
            data.append('stock', stock)
            data.append('color', color)
            data.append('extraFee', extraFee)
            let arr = Array.from(files)
            arr.forEach((file) => {
                data.append('images', file)
            })
            const wait = toast.loading('Vui l??ng ch???...!')
            let res = await addProductOptionByAdmin(data, productId)
            if (res.data.success) {
                UpdateSuccessReload(wait, 'Th??m phi??n b???n th??nh c??ng', false)
            } else {
                UpdateError(wait, 'Th??m phi??n b???n th???t b???i')
            }
        }

    }
    const handleSave = () => {
        addOption()
    }
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);

    const closeHandler = () => {
        setName('')
        setStock(0)
        setFee(0)
        setFiles([])
        setPreview([])
        setVisible(false);
    };
    return (
        <div>
            <Button auto shadow onClick={handler}>
                <Add />
            </Button>
            <Modal
                width='50%'
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        TH??M TH??NG S???
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        label='Size'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'text'}
                        value={name}
                        onChange={handleChangeName}
                    />
                    <Input
                        label='S??? l?????ng'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'number'}
                        value={stock}
                        onChange={handleChangeStock}
                    />
                    <Row>
                        <label style={{ marginRight: 10, fontSize: 14, color: 'navy' }}>Ch???n m??u</label>
                        <ChromePicker color={color} onChangeComplete={handleChangeColor} />
                    </Row>
                    <Input
                        label='Ph?? th??m'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'number'}
                        value={extraFee}
                        onChange={handleChangeFee}
                    />
                    <IconButton
                        color="primary"
                        component="label"
                        sx={{ borderRadius: 5 }}
                    >
                        <Text size={16} color='blue'>T???i ???nh l??n</Text>
                        <FileUpload sx={{ marginLeft: 1 }} />
                        <input
                            type="file"
                            hidden
                            onChange={handleUploadFile}
                            multiple
                            accept=".jpg,.png"
                        />
                    </IconButton>
                    {preview.length === 0 ? <></> :
                        <ImageList sx={{ width: 'auto', height: 'auto', margin: 0 }} cols={2} rowHeight={164} variant='quilted'>
                            {preview.map((item) => (
                                <ImageListItem key={item}>
                                    <img
                                        src={item}
                                        alt={'...Loading'}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='contained' color="error" onClick={closeHandler} sx={{ marginRight: 1,textTransform:'none' }}>
                        Hu???
                    </Button>
                    <Button variant='contained' onClick={handleSave} sx={{textTransform:'none'}}>
                        L??u
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}
export function EditAttrModal({ attr, productId }) {
    const [prop, setProp] = useState(attr)
    const name = attr.name
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);

    const closeHandler = () => {
        setProp(attr)
        setVisible(false);
    };
    const handleChangeName = (e) => {
        setProp({ ...prop, name: e.target.value })
    }
    const handleChangeVal = (e) => {
        setProp({ ...prop, val: e.target.value })
    }
    const updateAttr = async (data, id, name) => {
        if (validator.isEmpty(data.name)) {
            toast.error('Vui l??ng nh???p t??n th??ng s???', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (validator.isEmpty(prop.val)) {
            toast.error('Vui l??ng nh???p gi?? tr??? c???a th??ng s???', {
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
            const wait = toast.loading('Vui l??ng ch???...!');
            let res = await updateAttrByAdmin(data, id, name)
            if (res.success) {
                UpdateSuccessReload(wait, 'C???p nh???t th??ng s??? th??nh c??ng', true);
            } else {
                UpdateError(wait, 'C???p nh???t th??ng s??? kh??ng th??nh c??ng')
            }
        }

    }
    const handleSave = () => {
        updateAttr(prop, productId, name)
    }
    return (
        <div>
            <Button auto shadow onClick={handler}>
                <Edit />
            </Button>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        CH???NH S???A TH??NG S???
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        label='Th??ng s???'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'text'}
                        value={prop.name}
                        onChange={handleChangeName}
                    />
                    <Input
                        label='Gi?? tr???'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'text'}
                        value={prop.val}
                        onChange={handleChangeVal}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='contained' color="error" onClick={closeHandler} sx={{ marginRight: 1,textTransform:'none' }}>
                        Hu???
                    </Button>
                    <Button variant='contained' onClick={handleSave} sx={{textTransform:'none'}}>
                        L??u
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}
export function AddAttrModal({ productId }) {
    const [name, setName] = useState('')
    const [val, setVal] = useState('')
    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const handleChangeVal = (e) => {
        setVal(e.target.value)
    }
    const addAttr = async ({ name, val }, id) => {
        if (validator.isEmpty(name)) {
            toast.error('Vui l??ng nh???p t??n th??ng s???', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (validator.isEmpty(val)) {
            toast.error('Vui l??ng nh???p gi?? tr??? th??ng s???', {
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
            const wait = toast.loading('Vui l??ng ch???...!');
            let res = await addProductAttrByAdmin({ name, val }, id)
            if (res.data.success) {
                UpdateSuccessReload(wait, 'Th??m th??ng s??? th??nh c??ng', true);
            } else {
                UpdateError(wait, 'Th??m th??ng s??? kh??ng th??nh c??ng')
            }
        }
    }
    const handleSave = () => {
        addAttr({ name, val }, productId)
    }
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);

    const closeHandler = () => {
        setName('')
        setVal('')
        setVisible(false);
    };
    return (
        <div>
            <Button auto shadow onClick={handler}>
                <Add />
            </Button>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        TH??M TH??NG S???
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        label='Th??ng s???'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'text'}
                        value={name}
                        onChange={handleChangeName}
                    />
                    <Input
                        label='Gi?? tr???'
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="md"
                        type={'text'}
                        value={val}
                        onChange={handleChangeVal}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='contained' color="error" onClick={closeHandler} sx={{ marginRight: 1,textTransform:'none' }}>
                        Hu???
                    </Button>
                    <Button variant='contained' onClick={handleSave} sx={{textTransform:'none'}}>
                        L??u
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}

function UpdateProduct() {
    let navigate = useNavigate()
    const { id } = useParams();
    const [product, setProduct] = useState({})
    const [productId, setProductId] = useState('')
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    useEffect(() => {
        async function getData() {
            const [categories, brands, product] = await Promise.all([
                getAllCategory(false),
                getAllBrandsByAdmin(),
                getProductByID(id)

            ]);
            if (categories.success && brands.success && product.success) {
                setCategories(categories.data)
                setBrands(brands.data)
                setProduct(product.data)
                setProductId(product.data.id)
            } else {
                console.log('Error')
            }
        }
        getData()
    }, [id])
    const handleChangeName = (e) => {
        setProduct({ ...product, name: e.target.value })
    }
    const handleChangePrice = (e) => {
        setProduct({ ...product, price: e.target.value })
    }
    const handleChangeDiscount = (e) => {
        setProduct({ ...product, discount: e.target.value })
    }
    const handleChangeDes = (e) => {
        setProduct(product => { return { ...product, description: e } })
    }
    const updateProduct = async (data, id) => {
        if (validator.isEmpty(data.name)) {
            toast.error('Vui l??ng nh???p t??n s???n ph???m', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (data.price === null || data.price <= 0) {
            toast.error('Vui l??ng nh???p gi?? s???n ph???m', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (data.discount === null || data.discount < 0 || data.discount > 100) {
            toast.error('Vui l??ng nh???p gi???m gi?? c???a s???n ph???m', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (validator.isEmpty(data.description)) {
            toast.error('Vui l??ng nh???p m?? t??? s???n ph???m', {
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
            console.log(1)
            const wait = toast.loading('Vui l??ng ch???...!')
            let res = await updateProductByAdmin(data, id);
            if (res.success) {
                setProduct(res.data)
                setProductId(res.data.id)
                UpdateSuccessReload(wait, 'C???p nh???t th??ng tin s???n ph???m th??nh c??ng', false)
            } else {
                UpdateError(wait, 'C???p nh???t th??ng tin kh??ng th??nh c??ng')
            }
        }

    }
    const handleSave = () => {
        updateProduct(product, productId)
    }
    const removeImage = async (data, id) => {
        const w = toast.loading('Vui l??ng ch???...!')
        let res = await delImagePooductByAdmin({ data }, id)
        if (res.success) {
            UpdateSuccessReload(w, 'Xo?? ???nh th??nh c??ng', true)
        } else {
            UpdateError(w, 'Xo?? ???nh kh??ng th??nh c??ng')
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {Object.keys(product).length === 0 && product.constructor === Object ?
                <Grid container gap={2} justifyContent='center' alignItems={'center'} height={'100vh'} wrap='wrap' >
                    <Loading size='xl' type='gradient' color={'warning'} />
                </Grid> :
                <>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
                                <Button onClick={() => navigate('/admin?page=product')}>V??? trang qu???n l??</Button>
                                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                                    <Typography component="h4" variant="h5" align="center">
                                        TH??NG TIN S???N PH???M
                                    </Typography>
                                    <React.Fragment>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <label style={{ fontSize: 12 }}>T??n s???n ph???m</label>
                                                <TextField
                                                    required
                                                    id="name"
                                                    name="name"
                                                    // label="T??n s???n ph???m"
                                                    fullWidth
                                                    type={'text'}
                                                    variant="standard"
                                                    value={product.name}
                                                    onChange={handleChangeName}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <label style={{ fontSize: 12 }}>Gi?? g???c</label>
                                                <TextField
                                                    required
                                                    id="price"
                                                    name="price"
                                                    // label="Gi?? s???n ph???m"
                                                    fullWidth
                                                    type={'number'}
                                                    variant="standard"
                                                    value={product.price}
                                                    onChange={handleChangePrice}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <label style={{ fontSize: 12 }}>Gi???m gi??</label>
                                                <TextField
                                                    required
                                                    id="discount"
                                                    name="discount"
                                                    // label="Gi???m gi??"
                                                    fullWidth
                                                    type={'number'}
                                                    variant="standard"
                                                    value={product.discount}
                                                    onChange={handleChangeDiscount}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <span style={{ fontSize: 12 }}>Danh m???c / Nh??n h??ng</span>
                                                <Dropdown>
                                                    <Dropdown.Button light color="default" css={{ tt: "capitalize" }}>
                                                        {categories.filter((cat) => {
                                                            return (cat.id === product?.category)
                                                        })[0]?.name || ''}
                                                    </Dropdown.Button>
                                                    <Dropdown.Menu
                                                        aria-label="Single selection actions"
                                                        color="secondary"
                                                        disallowEmptySelection
                                                        selectionMode="single"
                                                        selectedKeys={product.category}
                                                        onAction={(key) => setProduct({ ...product, category: key })}
                                                    >
                                                        {/* <Dropdown.Item key=''>Kh??ng</Dropdown.Item> */}
                                                        {categories.map((item) => (
                                                            <Dropdown.Item key={item.id}>{item.name}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <Dropdown>
                                                    <Dropdown.Button light color="default" css={{ tt: "capitalize" }}>
                                                        {brands.filter((brand) => {
                                                            return (brand.id === product.brand)
                                                        })[0]?.name || ''}
                                                    </Dropdown.Button>
                                                    <Dropdown.Menu
                                                        aria-label="Single selection actions"
                                                        color="secondary"
                                                        disallowEmptySelection
                                                        selectionMode="single"
                                                        selectedKeys={product.brand}
                                                        onAction={(key) => setProduct({ ...product, brand: key })}
                                                    >
                                                        {/* <Dropdown.Item key=''>Kh??ng</Dropdown.Item> */}
                                                        {brands.map((item) => (
                                                            <Dropdown.Item key={item.id}>{item.name}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <label style={{ fontSize: 12 }}>M?? t??? s???n ph???m</label>
                                                <ReactQuill theme="snow" value={product.description} onChange={handleChangeDes} />
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            sx={{ mt: 3, ml: 1,textTransform:'none' }}
                                            onClick={handleSave}
                                        >
                                            L??u
                                        </Button>
                                    </Box>
                                </Paper>
                                <ToastContainer />
                            </Container>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ marginRight: 0 }}>
                            <Row justify='space-between' align='center' css={{ marginTop: '$15' }}>
                                <Typography variant="h5" style={{ textAlign: 'center' }} gutterBottom>
                                    C??C PHI??N B???N
                                </Typography>
                                <AddOptionModal productId={productId} />
                            </Row>

                            <Table
                                shadow={'false'}
                                aria-label="Example table with static content"
                                css={{
                                    height: "auto",
                                    minWidth: "100%",
                                }}
                            >
                                <Table.Header>
                                    <Table.Column>SIZE</Table.Column>
                                    <Table.Column>M??U</Table.Column>
                                    <Table.Column>PH?? TH??M</Table.Column>
                                    <Table.Column>S??? L?????NG</Table.Column>
                                    <Table.Column></Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {product.options?.map((option) => (
                                        <Table.Row key={option.id}>
                                            <Table.Cell>{option.name}</Table.Cell>
                                            <Table.Cell css={{ justifyContent: 'flex-start', paddingRight: '$0', paddingLeft: '$0' }}>
                                                {option.variants.map((color) => (
                                                    <Button size='small' disabled sx={{ padding: 0, margin: 0 }}>
                                                        <span style={{ backgroundColor: color.color, padding: 10, border: '1px solid black' }}>
                                                        </span>
                                                    </Button>
                                                ))}
                                            </Table.Cell>
                                            <Table.Cell>{option.extraFee}</Table.Cell>
                                            <Table.Cell>{option.inStock}</Table.Cell>
                                            <Table.Cell>
                                                <Row justify='center'>
                                                    <EditOptionModal option={option} productId={productId} />
                                                </Row>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                            <Row justify='space-between' align='center'>
                                <Typography variant="h5" style={{ textAlign: 'center', marginTop: 20 }} gutterBottom>
                                    C??C TH??NG S???
                                </Typography>
                                <AddAttrModal productId={productId} />
                            </Row>
                            <Table
                                shadow={'false'}
                                aria-label="Example table with static content"
                                css={{
                                    height: "auto",
                                    minWidth: "100%",
                                }}
                            >
                                <Table.Header>
                                    <Table.Column>STT</Table.Column>
                                    <Table.Column>TH??NG S???</Table.Column>
                                    <Table.Column>GI?? TR???</Table.Column>
                                    <Table.Column></Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {product.attr?.map((prop, index) => (
                                        <Table.Row key={prop.id}>
                                            <Table.Cell>{index + 1}</Table.Cell>
                                            <Table.Cell>{prop.name}</Table.Cell>
                                            <Table.Cell>{prop.val}</Table.Cell>
                                            <Table.Cell>
                                                <Row justify='center'>
                                                    <EditAttrModal attr={prop} productId={productId} />
                                                </Row>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <Row justify='space-around' align='center'>
                                <Typography variant="h5" style={{ textAlign: 'center', marginTop: 20 }} gutterBottom>
                                    ???NH S???N PH???M
                                </Typography>
                                {product.id !== undefined ?
                                    <UploadImage pro={product} />
                                    :
                                    <></>
                                }
                            </Row>
                            <ImageList sx={{ width: 'auto', height: 'auto', margin: 5 }} gap={15} cols={4} rowHeight={164} variant='quilted'>
                                {product.images?.map((image) => (
                                    <ImageListItem key={image.imageId}>
                                        <button onClick={() => { removeImage({ imageId: image.imageId }, productId) }}>
                                            <DeleteForever />
                                        </button>
                                        <img
                                            src={image.url}
                                            alt={'...Loading'}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Grid>
                    </Grid>
                </>
            }
            <ToastContainer />
        </ThemeProvider >
    );
}
export default UpdateProduct;
export function UploadImage({ pro }) {
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const [color, setColor] = useState(pro.options[0]?.variants[0]?.color)
    let arr = []
    pro.options?.map((option) =>
        option.variants?.map((color) =>
            arr.push(color.color)
        ))
    arr = [...new Set(arr)]
    const [preview, setPreview] = useState([])
    const [files, setFiles] = useState([])
    const closeHandler = () => {
        setPreview([])
        setVisible(false);
    };
    const handleUploadFile = (e) => {
        setFiles(e.target.files)
        setPreview([...e.target.files].map((image) => {
            return URL.createObjectURL(image)
        }))
    }
    const uploadImage = async () => {
        const data = new FormData();
        data.append('color', color)
        let arr = Array.from(files)
        arr.forEach((file) => {
            data.append('files', file)
        })
        const wait = toast.loading('Vui l??ng ch???...!')
        let res = await uploadImageByAdmin(data, pro.id)
        if (res.data.success) {
            UpdateSuccessReload(wait, 'Th??m ???nh th??nh c??ng', true)
        } else {
            UpdateError(wait, 'Th??m ???nh kh??ng th??nh c??ng')
        }
    }
    const handleUpload = () => {
        uploadImage()
    }
    return (
        <div>
            <Button auto shadow onClick={handler}>
                Th??m h??nh ???nh <FileUpload />
            </Button>
            <Modal
                width='50%'
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={30}>
                        Th??m ???nh
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown>
                        <Dropdown.Button light color="default" css={{ tt: "capitalize" }}>
                            <Button size='small' disabled sx={{ padding: 0, margin: 0 }}>
                                <span style={{ backgroundColor: color, padding: 10, border: '1px solid black', marginRight: 3 }}>
                                </span>
                                <span style={{ color: 'black' }}>{color}</span>
                            </Button>
                        </Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="secondary"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={color}
                            onAction={(key) => setColor(key)}
                        >
                            {
                                arr.map((color) => (
                                    <Dropdown.Item key={color}>
                                        <Button size='small' disabled sx={{ padding: 0, margin: 0 }}>
                                            <span style={{ backgroundColor: color, padding: 10, border: '1px solid black', marginRight: 3 }}>
                                            </span>
                                            <span style={{ color: 'black' }}>{color}</span>
                                        </Button>
                                    </Dropdown.Item>
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    <IconButton
                        color="primary"
                        component="label"
                        sx={{ borderRadius: 5 }}
                    >
                        <Text size={16} color='blue'>T???i ???nh l??n</Text>
                        <FileUpload sx={{ marginLeft: 1 }} />
                        <input
                            type="file"
                            hidden
                            onChange={handleUploadFile}
                            multiple
                            accept=".jpg,.png"
                        />
                    </IconButton>
                    {preview.length === 0 ? <></> :
                        <ImageList sx={{ width: 'auto', height: 'auto', margin: 0 }} cols={2} rowHeight={164} variant='quilted'>
                            {preview.map((item) => (
                                <ImageListItem key={item}>
                                    <img
                                        src={item}
                                        alt={'...Loading'}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Hu???
                    </Button>
                    <Button auto onClick={handleUpload}>
                        T???i l??n
                    </Button>
                </Modal.Footer>
                <ToastContainer />
            </Modal>
        </div>
    );
}