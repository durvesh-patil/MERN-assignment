import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemForm from "./components/ItemForm2";
import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";

const DataTable = () => {
  //state to store the items
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [imageSrcs, setImageSrcs] = useState({});
  // console.log(
  //   "currentItem",
  //   items.map((item) => item.image)
  // );

  useEffect(() => {
    // Fetch data from the backend
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setItems(response.data);

      // Preload images to avoid flash error when rendering (error flash for millisecond on screen)
      const srcs = {};
      for (const item of response.data) {
        if (item.image) {
          const src = await import(`./images/${item.image}`);
          srcs[item._id] = src.default;
        }
      }
      setImageSrcs(srcs);
    } catch (error) {
      console.error("There was an error fetching the items!", error);
    }
  };

  //function to handle the edit action
  const handleEdit = (item) => {
    setCurrentItem(item);
  };

  //function to handle the delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("There was an error deleting the item!", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Pass the currentItem, setCurrentItem and refreshItems function to the ItemForm component */}
      <ItemForm
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        refreshItems={fetchItems}
      />
      <h2 className="text-2xl font-bold mb-4">Data Table</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Image</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {/* Loop through the items */}
          {items.map((item) => (
            <tr
              key={item._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium">{item.title}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <span>{item.description}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                {imageSrcs[item._id] ? (
                  <img
                    src={imageSrcs[item._id]}
                    alt={item.title}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <span>no images</span>
                )}
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-4 mr-2 transform  hover:scale-110"
                  >
                    {/* Edit icon */}
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="w-4 mr-2 ml-2 transform hover:text-red-500 hover:scale-110 "
                  >
                    {/* Delete icon */}
                    <DeleteIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
