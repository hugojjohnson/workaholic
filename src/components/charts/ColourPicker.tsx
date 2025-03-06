import { useState } from "react";
import { BackgroundColours, Colours } from "../../Interfaces";

// const colors = ["red", "blue", "green"];
const colors = Object.values(BackgroundColours)
const colourArray: Colours[] = ["red", "orange", "yellow", "green", "blue", "purple", "grey"]

const ColourPicker = ({start, callback}: {start: Colours, callback: (colour: Colours) => void}) => {
    const [color, setColor] = useState(colors[colourArray.indexOf(start)]); // TODO: This has an edge case to be handled.
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex flex-col items-center">
            {/* Custom Dropdown */}
            <div className="w-12 h-5 rounded cursor-pointer flex items-center justify-between" style={{ backgroundColor: color }} onClick={() => setIsOpen(!isOpen)}></div>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="flex flex-col gap-3 items-center justify-center shadow-md p-3 absolute top-5 border-white border-dashed border-[1px] rounded-md overflow-clip bg-[#242424]">
                    {colors.map((c, ind) => (
                        <div key={c} className="w-12 h-5 rounded-md p-2 cursor-pointer flex items-center justify-center" style={{ backgroundColor: c }}
                            onClick={() => {
                                setColor(c);
                                setIsOpen(false);
                                callback(colourArray[ind])
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColourPicker;
