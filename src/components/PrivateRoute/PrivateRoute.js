import React from 'react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const PrivateRoute = ({ element }) => {
    // Estado para controlar la redirección
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Maneja el clic en el botón de login
    const handleLoginClick = () => {
        setShouldRedirect(true);
    };

    // Redirige si se presionó el botón de login
    if (shouldRedirect) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            {element}
            <button onClick={handleLoginClick}>Login</button>
        </div>
    );
};

export default PrivateRoute;
