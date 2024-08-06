'use client';

import { CSSProperties, useState } from "react";
import { HexColorPicker } from "react-colorful";

const ColorSelector = (props: {
    color?: string | undefined,
    onChange?: ((newColor: string) => void) | undefined,
    style?: CSSProperties | undefined,
}) => {
    const [color, setColor] = useState(props.color || "#14ae31");

    const onChangeHandler = (newColor: string) => {
        setColor(newColor);
        if (props.onChange) {
            props.onChange(newColor);
        }
    }

    return <HexColorPicker color={color} onChange={onChangeHandler} style={{ ...props.style }} />;
};

export default ColorSelector;