import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [name, setName] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [data, setData] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
//        await axios.post('http://localhost:5000/submit', { name, bloodGroup }); // api call if running on server
	 await axios.post('http://192.168.152.133:5000/submit', { name, bloodGroup }); // api call if running on docker, in docker compose backend has been called as "backend"
        fetchData();
    };

    const fetchData = async () => {
//        const response = await axios.get('http://localhost:5000/data');
	 const response = await axios.get('http://192.168.152.133:5000/data');
        setData(response.data);
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div>
            <h1>Blood Group Collector</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Blood Group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required />
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

