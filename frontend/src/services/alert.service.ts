import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
export const showSuccessAlert = (title: string, text: string) => {
    MySwal.fire({
        title: `<p>${title}</p>`,
        text: text,
        icon: 'success',
        timer: 2000, 
        showConfirmButton: false,
    });
};

export const showErrorAlert = (title: string, text: string) => {
    MySwal.fire({
        title: `<p>${title}</p>`,
        text: text,
        icon: 'error',
    });
};


export const showConfirmationDialog = (
    title: string, 
    text: string, 
    confirmButtonText: string, 
    cancelButtonText: string 
) => {
    return MySwal.fire({
        title: `<p>${title}</p>`,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText, 
        cancelButtonText: cancelButtonText, 
    });
};