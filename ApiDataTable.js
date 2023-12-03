import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ApiDataTable = () => {
    const [apiData, setApiData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Get the current page data based on rows per page and current page number
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

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
    }, []);

    // Handle search input change
    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
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

    // Handle pagination button click
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEdit = (id) => {
        setRowToEdit(id);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        // Remove the row from the filtered data and API data
        setFilteredData(prevData => prevData.filter(rowData => rowData.id !== id));
        setApiData(prevData => prevData.filter(rowData => rowData.id !== id));
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
                return updatedData;
            });
        }
    };

    const handleDeleteSelected = () => {
        // Remove selected rows from the filtered data and API data
        setFilteredData((prevData) => prevData.filter((rowData) => !selectedRows.includes(rowData)));
        setApiData((prevData) => prevData.filter((rowData) => !selectedRows.includes(rowData)));
        // Clear selected rows after deletion
        setSelectedRows([]);
        (selectAll) ? setSelectAll(!selectAll) : '';
    };

    // Handle row selection using checkboxes
    const handleCheckboxChange = (row) => {
        const updatedSelectedRows = selectedRows.includes(row)
            ? selectedRows.filter((selectedRow) => selectedRow.id !== row.id)
            : [...selectedRows, row];

        setSelectedRows(updatedSelectedRows);
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
            <h1 className='mb-2 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white text-center'>Admin Dashboard</h1>
            <div className="flex justify-between items-center m-7">

                <div className="flex items-center space-x-2 m-2">
                    <span className="text-gray-400">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border rounded"
                    />
                    <button
                        className="search-icon bg-green-500 text-white p-2 rounded"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>

            </div>


            <table className="w-full text-sm text-gray-800 dark:text-gray-400">
                <thead>
                    <tr>
                        <th className="text-center">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                    className="cursor-pointer mr-2 h-4 w-4"
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
                            <td className="w-4 p-4 " style={{ cursor: 'pointer' }}>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.some((selectedRow) => selectedRow.id === rowData.id)}
                                        onChange={() => handleCheckboxChange(rowData)}
                                        className="cursor-pointer mr-5 h-4 w-4"
                                    />
                                    <span>{rowData.name}</span>
                                </label>
                            </td>

                            <td className="text-center">{rowData.name}</td>
                            <td className="text-center">{rowData.email}</td>
                            <td className="text-center">{rowData.role}</td>
                            <td className="text-center">
                                <button onClick={() => handleEdit(rowData.id)} className="mr-4 edit"><FontAwesomeIcon icon={faEdit} /></button>
                                <button onClick={() => handleDelete(rowData.id)} className="mr-4 delete"> <FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-center mt-4">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 mr-2 text-black rounded-md cursor-pointer first-page"
                >
                    <ChevronDoubleLeftIcon className="w-4 h-4" /> {/* Example: ArrowLeft SVG icon */}
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 mr-2 text-black rounded-md cursor-pointer previous-page"
                >
                    <ChevronLeftIcon className="w-4 h-4" /> {/* Example: ArrowLeft SVG icon */}
                </button>
                <span className="text-gray-800">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 ml-2 text-black rounded-md cursor-pointer next-page"
                >
                    <ChevronRightIcon className="w-4 h-4" /> {/* Example: ArrowRight SVG icon */}
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 ml-2 text-black rounded-md cursor-pointer last-page"
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

        </div>
    );
};

export default ApiDataTable;
