import { create } from 'zustand';

interface RolModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRolModal = create<RolModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useRolModal;