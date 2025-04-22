import { createContext, useState, useContext } from 'react'


const ModalContext = createContext() 

export const ModalProvider = ({children}) => {

    const [isModalOpen, setModal] = useState(false);

    const value = {
        isModalOpen,
        setModal
    }

    return <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
}


export const useModalContext = () => useContext(ModalContext)