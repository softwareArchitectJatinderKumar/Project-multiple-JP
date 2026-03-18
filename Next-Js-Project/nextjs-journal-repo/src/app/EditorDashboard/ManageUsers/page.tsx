"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import myAppWebService from '@/services/myAppWebService';
import styles from './EdsManageUser.module.scss';
import EdsTopMenuBar from '../TopBar/EdsTopMenuBar';

const ManageUsersPage = () => {
    const searchParams = useSearchParams();
    const roleId = searchParams.get('Role') || '0';

    const [users, setUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    
    // 1. New State for Search Query
    const [searchQuery, setSearchQuery] = useState('');

    const roleNames: Record<string, string> = {
        '0': 'Editors', '1': 'Authors', '2': 'Reviewers', '4': 'Managing Editors'
    };

    const pageSizeOptions = [5, 10, 15, 20, 25];

    useEffect(() => {
        const loadData = async () => {
            setCurrentPage(1); 
            const response = await myAppWebService.GetAllJournalUserDetails(roleId);
            setUsers(response?.item1 || []);
        };
        loadData();
    }, [roleId]);

    // 2. Filter Logic: Filters the master list based on search input
    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            user.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.emailId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.mobileNumber?.includes(searchQuery)
        );
    }, [users, searchQuery]);

    // 3. Pagination Logic: Now uses filteredUsers instead of users
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to page 1 when searching
    };

    const handleStatusChange = async (user: any, action: 'Approve' | 'Disapprove') => {
        let reason = 'Approved';
        if (action === 'Disapprove') {
            const { value } = await Swal.fire({
                title: 'Disapproval Reason',
                input: 'text',
                showCancelButton: true
            });
            if (!value) return;
            reason = value;
        }

        const formData = new FormData();
        formData.append('UserEmailId', user.emailId);
        formData.append('DisapprovalReason', reason);
        formData.append('Action', action);

        const res = await myAppWebService.ApproveEditor(formData);
        if (res.responseData !== 'Cancel') {
            Swal.fire('Success', 'Status updated', 'success');
            const updated = await myAppWebService.GetAllJournalUserDetails(roleId);
            setUsers(updated?.item1 || []);
        }
    };

    return (
         <>
       <EdsTopMenuBar />
        <div className="p-4">
            <h1 className="text-center mb-4">All <span className="text-danger">{roleNames[roleId]}</span> Details</h1>
            
            <div className="card shadow-sm">
                <div className="card-body">
                    
                    {/* Controls Row: Search & Page Size */}
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 d-flex align-items-center gap-2">
                            <label className="fw-bold mb-0">Show:</label>
                            <select 
                                className="form-select form-select-sm" 
                                style={{ width: '80px' }}
                                value={itemsPerPage}
                                onChange={handlePageSizeChange}
                            >
                                {pageSizeOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <span className="small text-muted">entries</span>
                        </div>
                        
                        <div className="col-md-4 offset-md-4">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search by Name, Email or Mobile..." 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>

                    {filteredUsers.length > 0 ? (
                        <>
                            <div className="table-responsive">
                                <table className={`table table-bordered ${styles.customTable}`}>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Candidate Name</th>
                                            <th>Department</th>
                                            <th>Mobile</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUsers.map((user, i) => {
                                            const isInactive = user.isActive === '0' || user.isApproved === '0';
                                            return (
                                                <tr key={user.emailId}>
                                                    <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                                    <td className="text-start">{user.candidateName}</td>
                                                    <td>{user.departmentName}</td>
                                                    <td>{user.mobileNumber}</td>
                                                    <td className="text-start">{user.emailId}</td>
                                                    <td>
                                                        <span className={isInactive ? "text-danger fw-bold" : "text-success fw-bold"}>
                                                            {isInactive ? "Inactive" : "Active"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {isInactive ? (
                                                            <div className="btn-group">
                                                                <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(user, 'Approve')} title="Approve">✔</button>
                                                                <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(user, 'Disapprove')} title="Disapprove">✖</button>
                                                            </div>
                                                        ) : <span className="text-muted small">Action Applied</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="small text-muted">
                                    Showing {Math.min(filteredUsers.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredUsers.length, currentPage * itemsPerPage)} of {filteredUsers.length} entries
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <button 
                                        className="btn btn-sm btn-danger px-3" 
                                        disabled={currentPage === 1} 
                                        onClick={() => setCurrentPage(p => p - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span className="fw-bold px-2">Page {currentPage} of {totalPages}</span>
                                    <button 
                                        className="btn btn-sm btn-danger px-3" 
                                        disabled={currentPage === totalPages} 
                                        onClick={() => setCurrentPage(p => p + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-danger fs-4">No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ManageUsersPage;
// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Swal from 'sweetalert2';
// import myAppWebService from '@/services/myAppWebService';
// import styles from './EdsManageUser.module.scss';
// import EdsTopMenuBar from '../TopBar/EdsTopMenuBar';

// const ManageUsersPage = () => {
//     const searchParams = useSearchParams();
//     const roleId = searchParams.get('Role') || '0'; // Defaults to Editor (0)

//     const [users, setUsers] = useState<any[]>([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 15;

//     const roleNames: Record<string, string> = {
//         '0': 'Editors', '1': 'Authors', '2': 'Reviewers', '4': 'Managing Editors'
//     };

//     // Triggered whenever the Role in the URL changes
//     useEffect(() => {
//         const loadData = async () => {
//             setCurrentPage(1); // Reset to page 1 for new role
//             const response = await myAppWebService.GetAllJournalUserDetails(roleId);
//             setUsers(response?.item1 || []);
//         };
//         loadData();
//     }, [roleId]);

//     // Pagination Logic
//     const paginatedUsers = useMemo(() => {
//         const start = (currentPage - 1) * itemsPerPage;
//         return users.slice(start, start + itemsPerPage);
//     }, [users, currentPage]);

//     const totalPages = Math.ceil(users.length / itemsPerPage) || 1;

//     // Actions
//     const handleStatusChange = async (user: any, action: 'Approve' | 'Disapprove') => {
//         let reason = 'Approved';
        
//         if (action === 'Disapprove') {
//             const { value } = await Swal.fire({
//                 title: 'Disapproval Reason',
//                 input: 'text',
//                 showCancelButton: true
//             });
//             if (!value) return;
//             reason = value;
//         }

//         const formData = new FormData();
//         formData.append('UserEmailId', user.emailId);
//         formData.append('DisapprovalReason', reason);
//         formData.append('Action', action);

//         const res = await myAppWebService.ApproveEditor(formData);
//         if (res.responseData !== 'Cancel') {
//             Swal.fire('Success', 'Status updated', 'success');
//             // Refresh data
//             const updated = await myAppWebService.GetAllJournalUserDetails(roleId);
//             setUsers(updated?.item1 || []);
//         } else {
//             Swal.fire('Error', 'No changes made', 'error');
//         }
//     };

//     return (
//           <>
//       <EdsTopMenuBar />
//         <div className="p-4">
//             <h1 className="text-center mb-4">All <span className="text-danger">{roleNames[roleId]}</span> Details</h1>
            
//             <div className="card shadow-sm">
//                 <div className="card-body">
//                     {users.length > 0 ? (
//                         <>
//                             <table className={`table table-bordered ${styles.customTable}`}>
//                                 <thead className="table-dark">
//                                     <tr>
//                                         <th>Sr.No</th>
//                                         <th>Candidate Name</th>
//                                         <th>Department</th>
//                                         <th>Mobile</th>
//                                         <th>Email</th>
//                                         <th>Status</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {paginatedUsers.map((user, i) => {
//                                         const isInactive = user.isActive === '0' || user.isApproved === '0';
//                                         return (
//                                             <tr key={user.emailId}>
//                                                 <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
//                                                 <td>{user.candidateName}</td>
//                                                 <td>{user.departmentName}</td>
//                                                 <td>{user.mobileNumber}</td>
//                                                 <td>{user.emailId}</td>
//                                                 <td>
//                                                     <span className={isInactive ? "text-danger" : "text-success"}>
//                                                         {isInactive ? "Inactive" : "Active"}
//                                                     </span>
//                                                 </td>
//                                                 <td>
//                                                     {isInactive ? (
//                                                         <div className="btn-group">
//                                                             <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(user, 'Approve')}>✔</button>
//                                                             <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(user, 'Disapprove')}>✖</button>
//                                                         </div>
//                                                     ) : <span className="text-muted small">Action Applied</span>}
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                             {/* Pagination */}
//                             <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
//                                 <button className="btn btn-sm btn-danger" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
//                                 <span>Page {currentPage} of {totalPages}</span>
//                                 <button className="btn btn-sm btn-danger" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
//                             </div>
//                         </>
//                     ) : <p className="text-center text-danger fs-3">No Data Available.</p>}
//                 </div>
//             </div>
//         </div>
//         </>
//     );
// };

// export default ManageUsersPage;
