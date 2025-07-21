export const registerKeyDown = (onClose) => {
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
};
