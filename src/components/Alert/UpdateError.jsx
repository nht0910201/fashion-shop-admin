import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const UpdateError = (wait,msg) => {
    toast.update(
        wait,
        {
            render: msg,
            type: "error",
            isLoading: false,
            autoClose: 1500,
            pauseOnHover: false,
            draggable: true,
        }
    );
}