import { create } from "zustand";

interface ActiveRowState {
	activeRowIndex: number | null;
	setActiveRowIndex: (index: number | null) => void;
}

const useActiveRowStore = create<ActiveRowState>((set) => ({
	activeRowIndex: null,
	setActiveRowIndex: (index: number | null) => {
		set({ activeRowIndex: index });
	},
}));

export default useActiveRowStore;
