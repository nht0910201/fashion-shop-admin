
import { Box, Container, Grid, Typography } from "@mui/material";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

function View404() {
    let navigate = useNavigate()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid xs={6}>
                        <Typography variant="h1">
                            404
                        </Typography>
                        <Typography variant="h6">
                            Trang truy cập không tồn tại
                        </Typography>
                        <Button variant="contained" onClick={()=>navigate('/admin')}>Back Home</Button>
                    </Grid>
                    <Grid xs={6}>
                        <img
                            src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
                            alt=""
                            width={500} height={250}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default View404;