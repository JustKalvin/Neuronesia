import user from "../assets/user/user.png";
import { useState } from "react";

export default function Card() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage(imgURL);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow-xl rounded-2xl space-y-4">
        <img src={user} alt="" className="h-50 w-auto mx-auto block"/>
        <h1 className="text-xl font-semibold text-gray-800">Name</h1>
        <p className="text-sm text-gray-600">Description</p>
      {/* <input
        type="text"
        placeholder="Enter a description..."
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /> */}

      {/* <input type="file" accept="image/*" onChange={handleImageChange} />

      <div className="space-y-2">
        {image && <img src={image} alt="Uploaded" className="w-full h-48 object-cover rounded" />}
        {description && <p className="text-gray-700">{description}</p>}
      </div> */}
    </div>
  );
}
