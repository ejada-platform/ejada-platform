
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
// A reusable function for a confirmation dialog
export const showConfirmationDialog = (title: string, text: string, confirmButtonText: string = 'Yes, do it!') => {
    return MySwal.fire({
        title: `<p>${title}</p>`,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6', // Blue for confirm
        cancelButtonColor: '#d33',   // Red for cancel
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Cancel',
    });
};