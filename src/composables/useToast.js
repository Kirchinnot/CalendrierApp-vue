import { ref } from "vue";

const message = ref("");
const show = ref(false);

export function useToast() {
  const triggerToast = (msg) => {
    message.value = msg;
    show.value = true;

    setTimeout(() => {
      show.value = false;
    }, 2500);
  };

  return { message, show, triggerToast };
}
