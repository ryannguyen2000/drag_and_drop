import React, { useEffect, useState } from "react";

interface DimensionInputProps {
    onChange: (value: { inputValue: number; unit: string }) => void;
    defaultValue?: number;
    defaultUnit?: string;
}

const DimensionInput: React.FC<DimensionInputProps> = ({
    onChange,
    defaultValue = 0,
    defaultUnit = "px",
}) => {
    const [inputValue, setInputValue] = useState<number>(defaultValue);
    const [unit, setUnit] = useState<string>(defaultUnit);

    useEffect(() => {
        setInputValue(defaultValue); // Cập nhật lại giá trị input khi defaultValue thay đổi
        setUnit(defaultUnit); // Cập nhật lại đơn vị khi defaultUnit thay đổi
    }, [defaultValue, defaultUnit]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0; // Đảm bảo giá trị là số
        setInputValue(value);
        onChange({ inputValue: value, unit });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setUnit(value);
        onChange({ inputValue, unit: value });
    };

    return (
        <div className="flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden">
            <input
                type="number"
                className="h-10 w-full rounded-tl-lg rounded-bl-lg focus:ring-blue-500 focus:border-blue-500 pl-3"
                value={inputValue}
                onChange={handleInputChange}
            />
            <select
                id="dimension"
                className="border border-gray-300 appearance-none h-10 px-2 text-sm rounded-tr-lg rounded-br-lg focus:ring-blue-500 focus:border-blue-500 block cursor-pointer"
                value={unit}
                onChange={handleSelectChange}
            >
                <option value="px">px</option>
                <option value="%">%</option>
                <option value="em">em</option>
                <option value="rem">rem</option>
                <option value="vw">vw</option>
                <option value="vh">vh</option>
            </select>
        </div>
    );
};

export default DimensionInput;
