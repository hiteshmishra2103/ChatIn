import create from 'zustand';

const useMountedStore = create((set) => ({
    isMounted: false, // default state
    updateMounted: (mounted) => set({ isMounted: mounted }),
}));

export default useMountedStore;
