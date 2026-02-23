import React from 'react';

const Skeleton = ({
    className = "",
    variant = "text", // text, circular, rectangular
    width,
    height,
    ...props
}) => {
    const baseClass = "animate-pulse bg-slate-200 rounded-md";

    const variantClasses = {
        text: "h-3 w-full mb-2",
        circular: "rounded-full",
        rectangular: "",
    };

    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    return (
        <div
            className={`${baseClass} ${variantClasses[variant] || ""} ${className}`}
            style={style}
            {...props}
        />
    );
};

export default Skeleton;
