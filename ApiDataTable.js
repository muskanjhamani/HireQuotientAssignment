import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/20/solid';

const ApiDataTable = () => {
    const [apiData, setApiData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // const [editModalOpen, setEditModalOpen] = useState(false);
    // const [editedRow, setEditedRow] = useState(null);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    // const [editedData, setEditedData] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const rowsPerPage = 10;

    useEffect(() => {
        // Fetch data from the API
        fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            .then(response => response.json())
            .then(data => {
                console.log("Fetch Called");
                setApiData(data);
                setFilteredData(data); // Initialize filteredData with the full data set
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []); // Empty dependency array ensures the effect runs only once, equivalent to componentDidMount

    // Handle search input change
    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        // Filter data based on the search term
        // const filtered = apiData.filter(rowData =>
        //     Object.values(rowData).some(value =>
        //         value.toString().toLowerCase().includes(term.toLowerCase())
        //     )
        // );

        // setFilteredData(filtered);
        // setCurrentPage(1); // Reset to the first page after search/filter
    };

    const handleSearch = () => {
        const filtered = apiData.filter(rowData =>
            Object.values(rowData).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        setFilteredData(filtered);
        setCurrentPage(1); 
    }

    // Calculate the total number of pages based on filtered data and rows per page
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Get the current page data based on rows per page and current page number
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Handle pagination button click
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEdit = (id) => {
        console.log(id);
        // setEditModalOpen(true);
        setRowToEdit(id);
        setModalOpen(true);
        // setEditedData({ ...row, name: row.name || '', email: row.email || '', role: row.role || '' });
    };


    const handleDelete = (id) => {
        // Remove the row from the filtered data and API data
        setFilteredData(prevData => prevData.filter(rowData => rowData.id !== id));
        setApiData(prevData => prevData.filter(rowData => rowData.id !== id));
    };

    const handleModalClose = () => {
        setEditModalOpen(false);
    };

    const handleSubmit = (newRow) => {
        if (rowToEdit === newRow.id) {
            setApiData(prevApiData => {
                const updatedData = [...prevApiData];
                const indexToUpdate = updatedData.findIndex(item => item.id === newRow.id);

                if (indexToUpdate !== -1) {
                    // Update the existing element with the new data
                    updatedData[indexToUpdate] = newRow;
                } else {
                    // If the element is not found, you may handle it accordingly (e.g., add it to the end)
                    updatedData.push(newRow);
                }
                console.log(updatedData);
                return updatedData;
            });
            setFilteredData(prevApiData => {
                const updatedData = [...prevApiData];
                const indexToUpdate = updatedData.findIndex(item => item.id === newRow.id);

                if (indexToUpdate !== -1) {
                    // Update the existing element with the new data
                    updatedData[indexToUpdate] = newRow;
                } else {
                    // If the element is not found, you may handle it accordingly (e.g., add it to the end)
                    updatedData.push(newRow);
                }
                console.log(updatedData);
                return updatedData;
            });
        }


        // console.log(apiData);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleDeleteSelected = () => {
        // Remove selected rows from the filtered data and API data
        setFilteredData((prevData) => prevData.filter((rowData) => !selectedRows.includes(rowData)));
        setApiData((prevData) => prevData.filter((rowData) => !selectedRows.includes(rowData)));
        // Clear selected rows after deletion
        setSelectedRows([]);
        setSelectAll(!selectAll);
    };

    // Handle row selection using checkboxes
    const handleCheckboxChange = (row) => {
        setSelectedRows((prevSelectedRows) => {
            const isRowSelected = prevSelectedRows.includes(row);
            if (isRowSelected) {
                // If row is already selected, deselect it
                return prevSelectedRows.filter((selectedRow) => selectedRow !== row);
            } else {
                // If row is not selected, select it
                return [...prevSelectedRows, row];
            }
        });
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);

        if (!selectAll) {
            // If "Select All" is checked, select all rows on the current page
            setSelectedRows(currentData);
        } else {
            // If "Select All" is unchecked, deselect all rows on the current page
            setSelectedRows([]);
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-7">
            <h1 className='text-center underline'>Admin Dashboard</h1>
            <div className="flex justify-between items-center m-7">
                
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className='m-2'
                    />
                    <button
                        className="search-icon bg-green-500 text-white p-2 rounded"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                
                    <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                        Delete Selected
                    </button>
                
            </div>
            

            <table className="w-full text-sm text-gray-500 dark:text-gray-400">
                <thead>
                    <tr>
                        <th className="text-center">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                    className="cursor-pointer"
                                />
                            </label>
                        </th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Role</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((rowData) => (
                        <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            key={rowData.id}
                            style={{ backgroundColor: selectedRows.includes(rowData) ? '#ccc' : 'inherit' }}
                            onClick={() => handleCheckboxChange(rowData)}
                        >
                            <td className="w-4 p-4" style={{ cursor: 'pointer' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.some((selectedRow) => selectedRow.id === rowData.id)}
                                        onChange={() => handleCheckboxChange(rowData)}
                                        style={{ display: 'none' }}
                                    />
                                    {/* Visible fake checkbox for styling */}
                                    <span role="checkbox" aria-checked={selectedRows.some((selectedRow) => selectedRow.id === rowData.id)}>
                                        {selectedRows.some((selectedRow) => selectedRow.id === rowData.id) ? '✔' : '■'}
                                    </span>
                                </label>
                            </td>

                            {/* <td></td> */}
                            <td className="text-center">{rowData.name}</td>
                            <td className="text-center">{rowData.email}</td>
                            <td className="text-center">{rowData.role}</td>
                            <td className="text-center">
                                <button onClick={() => handleEdit(rowData.id)}>Edit</button>
                                <button onClick={() => handleDelete(rowData.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-center mt-4">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 mr-2 text-black rounded-md cursor-pointer"
                >
                    <ChevronDoubleLeftIcon className="w-4 h-4" /> {/* Example: ArrowLeft SVG icon */}
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 mr-2 text-black rounded-md cursor-pointer"
                >
                    <ChevronLeftIcon className="w-4 h-4" /> {/* Example: ArrowLeft SVG icon */}
                </button>
                <span className="text-gray-800">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 ml-2 text-black rounded-md cursor-pointer"
                >
                    <ChevronRightIcon className="w-4 h-4" /> {/* Example: ArrowRight SVG icon */}
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 ml-2 text-black rounded-md cursor-pointer"
                >
                    <ChevronDoubleRightIcon className="w-4 h-4" /> {/* Example: ArrowRight SVG icon */}
                </button>
            </div>

            {modalOpen && (
                <Modal
                    closeModal={() => {
                        setModalOpen(false);
                        setRowToEdit(null);
                    }}
                    onSubmit={handleSubmit}
                    defaultValue={apiData[rowToEdit - 1]}
                />
            )}

            {/* {editModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleModalClose}>
                            &times;
                        </span>
                        <h2>Edit Row</h2>
                        <label>
                            Name:
                            <input type="text" name="name" value={editedData.name} onChange={handleInputChange} />
                        </label>
                        <label>
                            Email:
                            <input type="text" name="email" value={editedData.email} onChange={handleInputChange} />
                        </label>
                        <label>
                            Role:
                            <input type="text" name="role" value={editedData.role} onChange={handleInputChange} />
                        </label>
                        <button onClick={handleSaveChanges}>Save Changes</button>
                    </div>
                </div>
            )} */}

        </div>
    );
};

export default ApiDataTable;
