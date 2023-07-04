import React, { useEffect, useRef } from 'react';

const ScrollToElement = ({ targetId }) => {
    const targetRef = useRef(null);

    useEffect(() => {
        const targetElement = targetRef.current;

        if (targetElement) {
            const timeout = setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 300); // Thời gian đợi trước khi trượt đến, ở đây là 1000ms (1 giây)

            return () => clearTimeout(timeout); // Xóa timeout nếu component bị unmount trước khi timeout hoàn thành
        }
    }, []);

    return (
        <div ref={targetRef} id={targetId}>
            {/* Nội dung của phần tử mà bạn muốn trượt đến */}
        </div>
    );
};

export default ScrollToElement;
