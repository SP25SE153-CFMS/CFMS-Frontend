// import React, { useState } from 'react';

// const ChickenDetailForm = () => {
//   const [formData, setFormData] = useState({
//     chickenId: '',
//     weight: '',
//     quantity: '',
//     gender: '',
//   });

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Chicken ID:</label>
//         <input
//           type="text"
//           name="chickenId"
//           value={formData.chickenId}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Weight:</label>
//         <input
//           type="number"
//           name="weight"
//           value={formData.weight}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Quantity:</label>
//         <input
//           type="number"
//           name="quantity"
//           value={formData.quantity}
//           onChange={handleChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Gender:</label>
//         <select
//           name="gender"
//           value={formData.gender}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>
//       </div>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default ChickenDetailForm;
