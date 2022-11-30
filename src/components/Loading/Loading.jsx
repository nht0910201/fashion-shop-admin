import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
    return (
        <div style={{ backgroundColor: 'white' }}>
            <Backdrop
                sx={{ color: 'skyblue', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* <CircularProgress/> */}
            {/* <Skeleton variant="rectangular" width={'auto'} height={76} /> */}
            
        </div>
    );
}