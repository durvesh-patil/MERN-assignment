import { useEffect, useState } from "react";
import axios from "axios";

const ItemForm = ({ currentItem, setCurrentItem, refreshItems }) => {
  //state to store the form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  //if currentItem is passed, set the form data to the currentItem
  useEffect(() => {
    if (currentItem) {
      setTitle(currentItem.title);
      setDescription(currentItem.description);
      setImage(null);
    }
  }, [currentItem]);

  //function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //create a FormData object to store the form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    //if currentItem is passed, send a PUT request to update the item else POST request to create a new item
    try {
      if (currentItem) {
        await axios.put(
          `http://localhost:5000/items/${currentItem._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post("http://localhost:5000/items", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      //refresh the items after saving the item
      refreshItems();
      setTitle("");
      setDescription("");
      setImage(null);
      setCurrentItem(null);
    } catch (error) {
      console.error("There was an error saving the item!", error);
    }
  };

  return (
    <form
      className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mb-8"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6">
        {currentItem ? "Edit" : "Add"} Item
      </h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="title"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {currentItem ? "Update" : "Add"} Item
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
