import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UpdateSuccessNavigate = (wait,msg,url) => {
    toast.update(
        wait,
        {
            render:  msg ,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            pauseOnHover: false,
            draggable: true,
            onClose:()=> window.location.href = url
        }
    );
}