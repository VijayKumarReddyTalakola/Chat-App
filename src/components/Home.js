// import React, { useState, useEffect } from "react";

// const Home = () => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//       fetch("https://fakestoreapi.com/products")
//         .then((response) => response.json())
//         .then((data) => setData(data));
//     }, []);
//   return (
//     <>
//         <h2>API Demo</h2>
//         <div className="products">
//                 {data.map((item, index) => (
//                 <div key={index} className="product">
//                       <img src={item.image} alt="" />
//                       <h2>{item.title.slice(0,25)}</h2>
//                       <p>{item.description.slice(0,100)}</p>
//                       <h2>${item.price}</h2>
//                     </div>
//                 ))}
//         </div>
//     </>
//   );
// }

// export default Home

import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [covidData, setCovidData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("https://api.covid19api.com/live/country/india/status/confirmed");
      setCovidData(result.data);
    };
    fetchData();
  }, []);

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const filteredData = covidData.filter((data) =>
//     data.Province.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  return (
    <>
      <h1>Covid -19 Cases in India</h1>
      {/* <input
        type="text"
        placeholder="Search by state..."
        onChange={handleSearchChange}
        value={searchTerm}
      /> */}
      <div className="states">
        {covidData.map((data) => (
          <div key={data.Date} className="state">
            <h1>{data.Province}</h1>
            <p>Confirmed Cases : {data.Confirmed}</p>
            <p>Deaths : {data.Deaths}</p>
            <p>Recovered : {data.Recovered}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
