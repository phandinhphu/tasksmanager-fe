export const sortTasks = (tasks) => {
    const now = new Date();

    const statusOrder = {
        'In Progress': 1,
        'To Do': 2,
        Completed: 3,
        Overdue: 4,
    };

    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
    };

    return [...tasks].sort((a, b) => {
        const statusAName = a.status?.name || '';
        const statusBName = b.status?.name || '';

        const priorityAName = a.priority?.name || '';
        const priorityBName = b.priority?.name || '';

        const statusA = statusOrder[statusAName] || 99;
        const statusB = statusOrder[statusBName] || 99;

        const priorityA = priorityOrder[priorityAName] || 99;
        const priorityB = priorityOrder[priorityBName] || 99;

        const endDateA = new Date(a.endDate);
        const endDateB = new Date(b.endDate);

        const isInProgressA = statusA === 1;
        const isInProgressB = statusB === 1;

        const timeDiffA = endDateA - now;
        const timeDiffB = endDateB - now;

        // Ưu tiên in-progress gần đến hạn
        if (isInProgressA && !isInProgressB) return -1;
        if (!isInProgressA && isInProgressB) return 1;

        if (isInProgressA && isInProgressB) {
            if (timeDiffA !== timeDiffB) return timeDiffA - timeDiffB;
        }

        // So sánh theo status
        if (statusA !== statusB) return statusA - statusB;

        // So sánh theo priority
        if (priorityA !== priorityB) return priorityA - priorityB;

        // So sánh theo deadline
        return endDateA - endDateB;
    });
};
