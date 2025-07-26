import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../Style/FresherSearch.css';

const FresherSearch = () => {
    const [filters, setFilters] = useState({ skill: '', department: '', status: '', query: '' });
    const [newFresher, setNewFresher] = useState({ email: '', department: '', startDate: '' });
    const [filteredFreshers, setFilteredFreshers] = useState([]);
    const [allFreshers, setAllFreshers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFreshers = async () => {
            const snapshot = await getDocs(collection(db, 'users'));
            const fetched = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            setAllFreshers(fetched);
        };

        fetchFreshers();
    }, []);

    const handleSearchChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = () => {
        const queryText = filters.query.trim().toLowerCase();
        const departmentFilter = filters.department.trim().toLowerCase();
        const skillFilter = filters.skill.trim().toLowerCase();
        const statusFilter = filters.status.trim().toLowerCase();

        const noFiltersProvided =
            queryText === '' &&
            departmentFilter === '' &&
            skillFilter === '' &&
            statusFilter === '';

        if (noFiltersProvided) {
            setFilteredFreshers([]);
            return;
        }

        const results = allFreshers.filter((fresher) => {
            const nameMatch = fresher.name?.toLowerCase().includes(queryText);
            const emailMatch = fresher.email?.toLowerCase().includes(queryText);
            const queryMatch = queryText === '' || nameMatch || emailMatch;

            const departmentMatch = departmentFilter === '' || fresher.department?.toLowerCase() === departmentFilter;
            const skillMatch = skillFilter === '' || fresher.skill?.toLowerCase() === skillFilter;
            const statusMatch = statusFilter === '' || fresher.status?.toLowerCase() === statusFilter;

            return queryMatch && departmentMatch && skillMatch && statusMatch;
        });

        setFilteredFreshers(results);
    };

    const handleFresherChange = (e) => {
        setNewFresher({ ...newFresher, [e.target.name]: e.target.value });
    };

    const handleAddFresher = () => {
        if (!newFresher.email || !newFresher.department || !newFresher.startDate) {
            alert("Please fill all fresher fields.");
            return;
        }

        console.log("Fresher added:", newFresher);
        alert("Fresher added successfully!");
        setNewFresher({ email: '', department: '', startDate: '' });
    };

    return (
        <div className="fresher-container">
            <div className="card-box">
                <h3>Search Freshers</h3>
                <div className="filters">
                    <input name="query" placeholder="Search by name/email" onChange={handleSearchChange} />
                    <select name="department" onChange={handleSearchChange}>
                        <option value="">Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Support">Support</option>
                    </select>
                    <select name="skill" onChange={handleSearchChange}>
                        <option value="">Skill</option>
                        <option value="Java">Java</option>
                        <option value="React">React</option>
                    </select>
                    <select name="status" onChange={handleSearchChange}>
                        <option value="">Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>

            <div className="card-box">
                <h3>Add New Fresher</h3>
                <div className="add-fresher-form">
                    <input
                        name="email"
                        type="email"
                        placeholder="Fresher Email"
                        value={newFresher.email}
                        onChange={handleFresherChange}
                    />
                    <select name="department" value={newFresher.department} onChange={handleFresherChange}>
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Support">Support</option>
                    </select>
                    <input
                        name="startDate"
                        type="date"
                        value={newFresher.startDate}
                        onChange={handleFresherChange}
                    />
                    <button onClick={handleAddFresher}>Add Fresher</button>
                </div>
            </div>

            <div className="card-box">
                <h3>Fresher Results</h3>
                <div className="fresher-results">
                    {filteredFreshers.length === 0 ? (
                        <p>No freshers found. Please enter filters and search.</p>
                    ) : (
                        filteredFreshers.map((fresher, index) => (
                            <div className="fresher-card" key={index}>
                                <h4>{fresher.name}</h4>
                                <p><strong>Email:</strong> {fresher.email}</p>
                                <p><strong>Department:</strong> {fresher.department}</p>
                                <p><strong>Skill:</strong> {fresher.skill}</p>
                                <p><strong>Status:</strong> {fresher.status}</p>
                                <p><strong>Start Date:</strong> {fresher.startDate}</p>
                                <button
                                    className="view-btn"
                                    onClick={() => navigate(`/fresher/${encodeURIComponent(fresher.email)}`)}
                                >
                                    View
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FresherSearch;
