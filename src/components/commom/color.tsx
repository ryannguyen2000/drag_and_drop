const ColorPickerInput = ({ value, onChange, disabled = false }) => {
    const handleChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Color Picker */}
            <input
                type="color"
                className={`h-10 w-20 bg-white border border-gray-200 cursor-pointer rounded-lg overflow-hidden ${disabled ? 'opacity-50 pointer-events-none' : ''
                    }`}
                onChange={handleChange}
                value={value}
                title="Choose your color"
                disabled={disabled}
            />

            {/* Text Input */}
            <input
                type="text"
                className={`p-1 h-10 w-full bg-white border border-gray-200 cursor-pointer rounded-lg ${disabled ? 'opacity-50 pointer-events-none' : ''
                    }`}
                onChange={handleChange}
                value={value}
                title="Enter your color"
                disabled={disabled}
            />
        </div>
    );
};

export default ColorPickerInput;
