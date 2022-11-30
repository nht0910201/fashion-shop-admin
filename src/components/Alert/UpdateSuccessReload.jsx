
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const UpdateSuccessReload = ( wait,msg,check ) => {
    toast.update(
        wait,
        {
            render:  msg ,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            pauseOnHover: false,
            draggable: true,
            onClose:() => {
                if(check===true)
                {
                    window.location.reload()
                }
            }
        }
    );
}