import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const URL = "http://localhost:3000";

export const useProductStore = create((set, get) => ({
  // products state
  loading: false,
  products: [],
  error: null,
  currentProduct: null,

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },
  setFormData: (formData) => {
    set({ formData });
  },
  resetFormData: () => {
    set({
      formData: {
        name: "",
        price: "",
        image: "",
      },
    });
  },
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${URL}/api/products`);
      const data = await res.data.data;
      set({ products: data, error: null });
    } catch (err) {
      if (err.response?.status === 429) {
        set({ error: "Too many requests. Please try again later." });
      } else {
        set({ error: err.message });
      }
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${URL}/api/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
      await get().fetchProducts();
      toast.success("Product deleted successfully");
    } catch (err) {
      set({ error: err.message });
      toast.error("Something went wrong. Please try again.");
    }
  },
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post(`${URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetFormData();
      document.getElementById("add_product_modal").close();
      toast.success("Product added successfully");
    } catch (err) {
      set({ error: err.message });
      toast.error("Something went wrong. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${URL}/api/products/${id}`);
      const data = await res.data.data;
      set({ currentProduct: data, formData: data, error: null });
    } catch (err) {
      if (err.response?.status === 429) {
        set({ error: "Too many requests. Please try again later." });
      } else {
        set({ error: err.message });
      }
    } finally {
      set({ loading: false });
    }
  },
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const res = await axios.put(`${URL}/api/products/${id}`, formData);
      set({ formData: res.data.data });
      await get().fetchProducts();
      get().resetFormData();
      toast.success("Product updated successfully");
    } catch (err) {
      set({ error: err.message });
      toast.error("Something went wrong. Please try again.");
    } finally {
      set({ loading: false });
    }
  },
}));
