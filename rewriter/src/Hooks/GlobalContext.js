import React, {createContext, useEffect, useState} from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({children}) => {
    const initialUserData = {
        id: '', login: '', email: '', adresses: [], admin: false,
    };
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState(initialUserData);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('panier');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);


    return (<GlobalContext.Provider
        value={{
            cartItems,
            setCartItems,
            userEmail,
            setUserEmail,
            userId,
            setUserId,
            userData,
            setUserData,
            isConnected,
            setIsConnected,
        }}
    >
        {children}
    </GlobalContext.Provider>);
};

export {GlobalProvider, GlobalContext};
