/**
 * @file CartContext.jsx
 * @description Proveedor de contexto global para la gestión del carrito de compras.
 * Alimenta y sincroniza la UI con la base de datos backend para operaciones
 * de agregar, eliminar, actualizar cantidades y limpiar el carrito. Expone una
 * propiedad derivada `cartCount` útil para notificaciones en Navbar.
 *
 * @author Jhon Michael Cariaco Rosales
 * @email jhoncariaco@gmail.com
 * @github https://github.com/Jhonmcr
 * @date 2026-03-20
 * @version 1.0.0
 */

import React, { createContext, useState, useContext, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // ─── ESTADOS DEL CARRITO ─────────────────────────────────────────
    const [cart, setCart] = useState(null);         // Información del carrito desde DRF (incluye `items` y `total`)
    const [loading, setLoading] = useState(false);  // Bandera general de carga de peticiones asíncronas

    // ─── MÉTODOS Y OPERACIONES ────────────────────────────────────────

    /**
     * Obtiene el carrito actualizado desde el backend y actualiza el estado.
     * Usado al montar la sesión o después de realizar cambios.
     * 
     * @returns {Promise<void>}
     */
    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            // Requiere Bearer Token (usuario autenticado)
            const response = await api.get("cart/");
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
            // Si el token expira o falla silenciosamente para visitantes no interrumpe UI severamente
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Anexa un producto al carrito en la base de datos.
     * Si ya existe un CartItem para este producto, incrementa su cantidad.
     * 
     * @param {number} productId ID relacional del producto en la tabla
     * @param {number} [quantity=1] Cantidad de ocurrencias a añadir
     */
    const addToCart = async (productId, quantity = 1) => {
        try {
            await api.post("cart/items/", { product_id: productId, quantity });
            toast.success("Producto agregado al carrito");
            fetchCart(); // Refresca grilla para recalcular el nuevo .total remotamente
        } catch (error) {
            console.error("Error adding to cart:", error);
            
            // Captura mensajes detallados del backend DRF si falló validación de stock
            if (error.response?.data?.error) {
                toast.error(error.response.data.error); 
            } else {
                // Posible fallo de autenticación (Ej. Dar clic estando no-logueado)
                toast.error("Debes iniciar sesión para agregar al carrito");
            }
        }
    };

    /**
     * Quita completamente un renglón (ítem) del carrito.
     * 
     * @param {number} itemId ID *del CartItem*, no del producto general
     */
    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`cart/items/${itemId}/`);
            toast.success("Producto eliminado del carrito");
            fetchCart();
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Error al eliminar el producto");
        }
    };

    /**
     * Actualiza arbitrariamente la cantidad de un ítem ya en el carrito.
     * 
     * @param {number} itemId ID *del CartItem*
     * @param {number} quantity Nueva cantidad estricta (no es aditiva, sino destructiva y fijadora)
     */
    const updateItemQuantity = async (itemId, quantity) => {
        if (quantity < 1) return; // Validación frontend temprana
        
        try {
            await api.put(`cart/items/${itemId}/`, { quantity });
            fetchCart(); // Recalcula totales
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Stock insuficiente o error de conectividad");
        }
    };

    /**
     * Genera la orden (Checkout). El Backend interceptará esto, 
     * pasará los items del carrito a la tabla Order/OrderItem y lo vaciará.
     */
    const checkout = async () => {
        try {
            const response = await api.post("orders/create/");
            toast.success("Orden creada exitosamente!");
            // Se asume vaciado atómico por parte del Servidor, 
            // así que en lugar de peticionar, limpiamos el Context.
            setCart(null); 
            return response.data; // Útil para redigir a pantalla de "Éxito"
        } catch (error) {
            console.error("Error during checkout:", error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);  // Mensaje como: "Stock Insuficiente" del Model
            } else {
                toast.error("Error al procesar la orden");
            }
            throw error;
        }
    };

    /**
     * Limpia el carrito entero manual o intencionalmente sin generar orden.
     * Implementación optimista desde el frontend si el endpoint lo soportara (Actualmente se limpia en la sesión).
     */
    const clearCart = () => {
        setCart(null);
    };

    // Propiedad derivada para el globo flotante de notificación de productos
    const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        // Value expone var y metodos globalmente
        <CartContext.Provider 
            value={{ 
                cart, 
                loading, 
                fetchCart, 
                addToCart, 
                removeFromCart, 
                updateItemQuantity, 
                checkout,
                clearCart,
                cartCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook personalizado para consumir el CartContext de forma explícita.
 * Previene el crasheo retornando error temprano si se llama fuera de la rama Context.
 * 
 * @returns {Object} Objetos y modificadores del carrito
 */
export { CartContext };
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
};
