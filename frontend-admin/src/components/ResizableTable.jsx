import React, { useContext, useEffect, useRef } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const ResizableTable = ({ columns, data, onEdit, onDelete }) => {
    const tableRef = useRef(null);
    useEffect(() => {
        makeResizableColumns(tableRef.current);
    }, []);

    const makeResizableColumns = (table) => {
        const cols = table.querySelectorAll("th");
        cols.forEach((col) => {
            if (!col.style.width) {
                col.style.width = col.offsetWidth + "px";
            }

            const resizer = document.createElement("div");
            resizer.classList.add("resizer");
            col.style.position = "relative";
            col.appendChild(resizer);

            let startX, startWidth;

            resizer.addEventListener("mousedown", (e) => {
                startX = e.pageX;
                startWidth = col.offsetWidth;
                document.addEventListener("mousemove", resize);
                document.addEventListener("mouseup", stopResize);
            });

            function resize(e) {
                const newWidth = Math.max(30, startWidth + (e.pageX - startX));
                col.style.width = newWidth + "px";
            }

            function stopResize() {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stopResize);
            }
        });
    };

    return (
        <div className="table-container">
            <table ref={tableRef}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.replace(/_/g, " ").toUpperCase()}</th>
                        ))}
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {row[col] === null || row[col] === undefined
                                        ? "NULL"
                                        : typeof row[col] === "boolean"
                                            ? row[col].toString()
                                            : row[col]}
                                </td>
                            ))}

                            {/* {(permissions.includes("manage") || permissions.includes("view")) && (
                                <td style={{ textAlign: "center" }}>
                                    {permissions.includes("manage") && (
                                        <>
                                            <button onClick={() => onEdit(row)}>
                                                <FaEdit style={{ color: "green", marginRight: "8px" }} />
                                            </button>
                                            <button onClick={() => onDelete(row)}>
                                                <FaTrash style={{ color: "red" }} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            )} */}

                            <td style={{ textAlign: "center" }}>
                                {/* <button>
                                    <FaEye style={{ color: "blue", marginRight: "8px" }} />
                                </button> */}
                                <button onClick={() => onEdit(row)}>
                                    <FaEdit style={{ color: "green", marginRight: "8px" }} />
                                </button>
                                <button onClick={() => onDelete(row)}>
                                    <FaTrash style={{ color: "red" }} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResizableTable;