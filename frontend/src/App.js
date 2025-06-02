import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [name, setName] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [data, setData] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

        try {
            console.log("Submitting to:", apiBaseUrl + "/submit");
            await axios.post(apiBaseUrl + '/submit', { name, bloodGroup });
            console.log("Submitted successfully");
            fetchData();
        } catch (err) {
            console.error("Submit failed:", err);
        }
    };

    const fetchData = async () => {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

        try {
            const response = await axios.get(apiBaseUrl + '/data');
            console.log("Fetched data:", response.data);
            setData(response.data);
        } catch (err) {
            console.error("Fetch data failed:", err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div>
            <h1>Blood Group Collector</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Blood Group"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <h2>Collected Data:</h2>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item.name} - {item.blood_group}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
