import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CSVReader = () => {
  const [data, setData] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const cleaned = result.data.map(row => ({
          income: parseFloat(row["Avg. Area Income"]),
          houseAge: parseFloat(row["Avg. Area House Age"]),
          rooms: parseFloat(row["Avg. Area Number of Rooms"]),
          bedrooms: parseFloat(row["Avg. Area Number of Bedrooms"]),
          population: parseFloat(row["Area Population"]),
          price: parseFloat(row["Price"]),
        }));
        setData(cleaned);
      }
    });
  };

  const features = [
    { key: "income", label: "Avg. Area Income" },
    { key: "houseAge", label: "Avg. Area House Age" },
    { key: "rooms", label: "Avg. Area Number of Rooms" },
    { key: "bedrooms", label: "Avg. Area Number of Bedrooms" },
    { key: "population", label: "Area Population" },
  ];

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFile} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '20px' }}>
        {data.length > 0 &&
          features.map(feature => (
            <div key={feature.key} style={{ width: '100%', height: 300 }}>
              <h3>{feature.label} vs Price</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey={feature.key} label={{ value: feature.label, position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="price" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CSVReader;
