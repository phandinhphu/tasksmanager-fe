import { useContext } from 'react';
import Context from '../contexts/StatusPriority/Context';

export const useStatusPriority = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useStatusPriority must be used within an AuthProvider');
    }
    return context;
};
