import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { IconButton, ImageList, ImageListItem, Popover } from '@mui/material';
import { FileUpload } from '@mui/icons-material';
import { Text } from '@nextui-org/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllCategory } from '../../../../services/CategoryService';
import { addProductAttrByAdmin, addProductByAdmin, addProductOptionByAdmin, getAllBrandsByAdmin } from '../../../../services/AdminService';
import { UpdateSuccessReload } from '../../../../components/Alert/UpdateSuccessReload';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateError } from '../../../../components/Alert/UpdateError';
import { ChromePicker } from 'react-color';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import validator from 'validator';

const steps = ['Thông tin sản phẩm', 'Phiên bản sản phẩm', 'Thông số'];

const theme = createTheme();

function AddProduct() {
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    useEffect(() => {
        async function getCategories() {
            let res = await getAllCategory(false)
            if (res.success) {
                setCategories(res.data)
            }
        }
        async function getBrands() {
            let res = await getAllBrandsByAdmin()
            if (res.success) {
                setBrands(res.data)
            }
        }
        getCategories()
        getBrands()
    }, [])
    const [activeStep, setActiveStep] = React.useState(0);
    const [files, setFiles] = useState([])
    const [preview, setPreview] = useState([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [category, setCategory] = useState('')
    const [brand, setBrand] = useState('')
    const [description, setDes] = useState('')
    const [size, setSize] = useState('')
    const [stock, setStock] = useState('')
    const [color, setColor] = useState('#1a237e')
    const [extraFee, setFee] = useState(0)
    const [k, setK] = useState('')
    const [val, setVal] = useState('');
    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const handleChangePrice = (e) => {
        setPrice(e.target.value)
    }
    const handleChangeDiscount = (e) => {
        setDiscount(e.target.value)
    }
    const handleChangeCategory = (e) => {
        setCategory(e.target.value)
    }
    const handleChangeBrand = (e) => {
        setBrand(e.target.value)
    }
    const handleChangeDes = (e) => {
        setDes(e)

    }
    const handleChangeSize = (e) => {
        setSize(e.target.value)
    }
    const handleChangeColor = (color) => {
        setColor(color.hex)
    }
    const handleChangeStock = (e) => {
        setStock(e.target.value)
    }
    const handleChangeFee = (e) => {
        setFee(e.target.value)
    }
    const handleChangeK = (e) => {
        setK(e.target.value)
        setName(e.target.value)
    }
    const handleChangeVal = (e) => {
        setVal(e.target.value)
    }
    const handleUploadFile = (e) => {
        setFiles(e.target.files)
        setPreview([...e.target.files].map((image) => {
            return URL.createObjectURL(image)
        }))
    }
    const handleNext = async (e) => {
        setActiveStep(activeStep + 1)
    };
    const [productId, setProductId] = useState('')
    const addProduct = async ({ name, description, price, discount, category, brand }) => {
        if (validator.isEmpty(name)) {
            toast.error('Vui lòng nhập tên sản phẩm', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (price === 0 || validator.isEmpty(price)) {
            toast.error('Vui lòng nhập giá sản phẩm', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (discount < 0 || validator.isEmpty(price)) {
            toast.error('Vui lòng nhập giảm giá sản phẩm', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (validator.isEmpty(category)) {
            toast.error('Vui lòng chọn danh mục cho sản phẩm', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (validator.isEmpty(brand)) {
            toast.error('Vui lòng chọn nhãn hàng cho sản phẩm', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (validator.isEmpty(description)) {
            toast.error('Vui lòng nhập mô tả sản phẩm', {
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
            const wait = toast.loading('Vui lòng chờ ...!')
            let res = await addProductByAdmin({ name, description, price, discount, category, brand })
            if (res.data.success) {
                setProductId(res.data.data.id)
                UpdateSuccessReload(wait, 'Thêm sản phẩm thành công', false)
                setActiveStep(1)
            } else {
                UpdateError(wait, 'Thêm sản phẩm thất bại')
            }
        }

    }
    const addProductOption = async () => {
        if (validator.isEmpty(size)) {
            toast.error('Vui lòng nhập size', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        else if (!validator.isInt(stock)) {
            toast.error('Vui lòng nhập chính xác số lượng của phiên bản', {
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
            toast.error('Vui lòng chọn ảnh của phiên bản', {
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
            data.append('name', size)
            data.append('stock', stock)
            data.append('color', color)
            data.append('extraFee', extraFee)
            let arr = Array.from(files)
            arr.forEach((file) => {
                data.append('images', file)
            })
            const wait = toast.loading('Vui lòng chờ...!')
            let res = await addProductOptionByAdmin(data, productId)
            if (res.data.success) {
                UpdateSuccessReload(wait, 'Thêm phiên bản thành công', false)
            } else {
                UpdateError(wait, 'Thêm phiên bản thất bại')
            }
        }
    }
    const addProductAttr = async ({ name, val }, id) => {
        if (validator.isEmpty(name)) {
            toast.error('Vui lòng nhập tên thông số', {
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
            toast.error('Vui lòng nhập giá trị của thông số', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        } else {
            const wait = toast.loading('Vui lòng chờ...!')
            let res = await addProductAttrByAdmin({ name, val }, id)
            if (res.data.success) {
                UpdateSuccessReload(wait, 'Thêm thông số chi tiết thành công', false)
            } else {
                UpdateError(wait, 'Thêm thông số chi tiết thất bại')
            }
        }
    }
    const handleSave = () => {
        if (activeStep === 0) {
            addProduct({ name, description, price, discount, category, brand })
        } else if (activeStep === 1) {
            addProductOption()
        } else if (activeStep === 2) {

            addProductAttr({ name, val }, productId)
        }
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center">
                        THÊM SẢN PHẨM
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === 0 ? <>
                            <Typography variant="h6" style={{ textAlign: 'center' }} gutterBottom>
                                Thông tin chung
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="name"
                                        name="name"
                                        label="Tên sản phẩm"
                                        fullWidth
                                        type={'text'}
                                        variant="standard"
                                        value={name}
                                        onChange={handleChangeName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="price"
                                        name="price"
                                        label="Giá sản phẩm"
                                        fullWidth
                                        type={'number'}
                                        variant="standard"
                                        value={price}
                                        onChange={handleChangePrice}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="discount"
                                        name="discount"
                                        label="Giảm giá"
                                        fullWidth
                                        type={'number'}
                                        variant="standard"
                                        value={discount}
                                        onChange={handleChangeDiscount}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="category-label">Danh mục</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            id="category-select"
                                            value={category}
                                            onChange={handleChangeCategory}
                                            label="Danh mục"
                                        >
                                            {categories?.map((category) => (
                                                <MenuItem value={category.id}>{category.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="brand-label">Nhãn hàng</InputLabel>
                                        <Select
                                            labelId="brand-label"
                                            id="brand-select"
                                            value={brand}
                                            onChange={handleChangeBrand}
                                            label="Nhãn hàng"
                                        >
                                            {brands?.map((brand) => (
                                                <MenuItem value={brand.id}>{brand.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <label style={{ fontSize: 13 }}>Mô tả sản phẩm</label>
                                    <ReactQuill theme="snow" value={description} onChange={handleChangeDes} />
                                </Grid>
                            </Grid>
                        </> : <></>}
                        {activeStep === 1 ? <>
                            <Typography variant="h6" align="center" gutterBottom>
                                Phiên bản
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="name_version"
                                        name="name_version"
                                        label="Size"
                                        fullWidth
                                        type={'text'}
                                        variant="standard"
                                        value={size}
                                        onChange={handleChangeSize}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="stock"
                                        name="stock"
                                        label="Số lượng"
                                        fullWidth
                                        type={'number'}
                                        variant="standard"
                                        value={stock}
                                        onChange={handleChangeStock}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <label>Chọn màu</label>
                                    <Button aria-describedby={id} onClick={handleClick} sx={{ padding: 0 }}>
                                        <span style={{ backgroundColor: color, padding: 10 }}>
                                        </span>
                                    </Button>
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <ChromePicker color={color} onChangeComplete={handleChangeColor} />
                                    </Popover>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="extraFee"
                                        name="extraFee"
                                        label="Phí cộng thêm"
                                        fullWidth
                                        type={'number'}
                                        variant="standard"
                                        value={extraFee}
                                        onChange={handleChangeFee}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <IconButton
                                        color="primary"
                                        component="label"
                                        sx={{ borderRadius: 5 }}
                                    >
                                        <Text size={16} color='blue'>Tải ảnh logo lên</Text>
                                        <FileUpload sx={{ marginLeft: 1 }} />
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleUploadFile}
                                            multiple
                                            accept=".jpg,.png"
                                        />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
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
                                </Grid>
                            </Grid>
                        </> : <></>}
                        {activeStep === 2 ? <>
                            <Typography variant="h6" align="center" gutterBottom>
                                Thông số chi tiết
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="newPassword"
                                        label="Thông số"
                                        type={'text'}
                                        fullWidth
                                        variant="standard"
                                        value={k}
                                        onChange={handleChangeK}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="confirmPass"
                                        label="Giá trị"
                                        type={'text'}
                                        fullWidth
                                        variant="standard"
                                        value={val}
                                        onChange={handleChangeVal}
                                    />
                                </Grid>
                            </Grid>
                        </> :
                            <></>
                        }
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                sx={{ mt: 3, ml: 1, backgroundColor: 'red' }}
                                onClick={() => window.location.href = '/admin?page=product'}
                            >
                                Xong
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ mt: 3, ml: 1 }}
                                onClick={handleSave}
                            >
                                Lưu
                            </Button>
                            <Button onClick={handleNext}
                                sx={{ mt: 3, ml: 1 }}
                                disabled={activeStep === 2 || activeStep === 0 ? true : false}
                            >
                                <ArrowForwardIcon />
                            </Button>
                        </Box>
                    </React.Fragment>
                </Paper>
                <ToastContainer />
            </Container>
        </ThemeProvider>
    );
}

export default AddProduct;