import React from 'react';

const Button = ({ onClick, name }) => {
    return (
        <div>
            <button
                className="btn btn-4"
                style={{height:48}}
                type="submit"
                onClick={onClick}
            >
                {name}
            </button>
        </div>
    );
};

export default Button;
