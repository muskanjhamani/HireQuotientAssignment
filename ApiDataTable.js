import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

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
        const filtered = apiData.filter(rowData =>
            Object.values(rowData).some(value =>
                value.toString().toLowerCase().includes(term.toLowerCase())
            )
        );

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page after search/filter
    };

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
    };

    // Handle row selection
    const handleRowSelect = (row) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(row) ? prevSelectedRows.filter((selectedRow) => selectedRow !== row) : [...prevSelectedRows, row]
        );
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

    return (
        <div>
            <h2>API Data Table</h2>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((rowData) => (
                        <tr
                            key={rowData.id}
                            style={{ backgroundColor: selectedRows.includes(rowData) ? '#ccc' : 'inherit' }}
                            onClick={() => handleCheckboxChange(rowData)}
                        >
                            <td style={{ cursor: 'pointer' }}>
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

                            <td>{rowData.id}</td>
                            <td>{rowData.name}</td>
                            <td>{rowData.email}</td>
                            <td>{rowData.role}</td>
                            <td>
                                <button onClick={() => handleEdit(rowData.id)}>Edit</button>
                                <button onClick={() => handleDelete(rowData.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First Page</button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous Page</button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next Page</button>
                <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last Page</button>
            </div>

            <div>
                <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                    Delete Selected
                </button>
            </div>
            {/* console.log(rowToEdit); */}
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
