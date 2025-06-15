import { useState, useEffect } from 'react';
import { getStatusTask, getPriorityTask } from '../../services/taskServices';
import Context from './Context';

export const StatusPriorityProvider = ({ children }) => {
    const [statusTask, setStatusTask] = useState([]);
    const [priorityTask, setPriorityTask] = useState([]);

    useEffect(() => {
        const fetchStatusTask = async () => {
            try {
                const data = await getStatusTask();
                setStatusTask(data);
            } catch (error) {
                console.error('Error fetching status task:', error);
            }
        };

        const fetchPriorityTask = async () => {
            try {
                const data = await getPriorityTask();
                setPriorityTask(data);
            } catch (error) {
                console.error('Error fetching priority task:', error);
            }
        };

        fetchStatusTask();
        fetchPriorityTask();
    }, []);

    return (
        <Context.Provider
            value={{
                statusTask,
                priorityTask,
            }}
        >
            {children}
        </Context.Provider>
    );
};
