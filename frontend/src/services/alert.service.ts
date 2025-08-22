
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// A reusable function for a success message
export const showSuccessAlert = (title: string, text: string) => {
    MySwal.fire({
        title: `<p>${title}</p>`,
        text: text,
        icon: 'success',
        timer: 2000, // The alert will close automatically after 2 seconds
        showConfirmButton: false,
    });
};

// A reusable function for an error message
export const showErrorAlert = (title: string, text: string) => {
    MySwal.fire({
        title: `<p>${title}</p>`,
        text: text,
        icon: 'error',
    });
};

// A reusable function for a confirmation dialog (like for deleting)
export const showConfirmationDialog = (title: string, text: string) => {
    return MySwal.fire({
        title: `<p>${title}</p>`,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
    });
};