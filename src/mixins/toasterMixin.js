import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
export default {
  methods: {
    triggerSwal: function (message, type) {
      Toast.fire({
        icon: type,
        title: message,
      });
    },

    handleErrorResponse(response) {
      if (response.status == 422) {
        let errors = response.data.error;

        for (let key in errors) {
          let error_string = errors[key][0];

          this.triggerSwal(error_string, "error");
        }
      } else if (
        Object.prototype.hasOwnProperty.call(response?.data, "message")
      ) {
        this.triggerSwal(response.data.message, "error");
      } else if (
        Object.prototype.hasOwnProperty.call(
          response?.response?.data,
          "message"
        )
      ) {
        this.triggerSwal(response.response.data.message, "error");
      } else {
        console.log(response);
      }
    },
  },
};
