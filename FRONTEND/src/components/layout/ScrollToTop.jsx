import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente que detecta cambios en la ruta y resetea el scroll al inicio (0, 0).
 * Es fundamental en SPAs (React Router) para que al navegar desde un footer,
 * la nueva página no empiece desde abajo.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
