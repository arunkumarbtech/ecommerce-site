import React, { useContext, useEffect, useState } from "react";
import { CollectionContext } from "../contexts/CollectionContext";
import { BASE_URL } from "../api/api";
export default function AddCollectionModal({ onClose }) {
    const {
        addCollection,
        updateCollection,
        isEditCollection,
        setIsEditCollection,
        editingCollection,
        setEditingCollection
    } = useContext(CollectionContext);

    const [collectionName, setCollectionName] = useState('');
    const [description, setDescription] = useState('');


    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    useEffect(() => {
        if (isEditCollection && editingCollection) {
            setCollectionName(editingCollection.collection_name);
            setDescription(editingCollection.description);
            setImagePreview(editingCollection.collection_image || null);
        } else {
            setCollectionName("");
            setDescription("");
            setImageFile(null);
            setImagePreview(null);
            setRemoveExistingImage(false);
        }
    }, [isEditCollection, editingCollection]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("collection_name", collectionName);
        formData.append("description", description);
        if (imageFile) formData.append("collection_image", imageFile);
        if (removeExistingImage) formData.append("remove_image", "true");

        try {
            if (isEditCollection) {
                await updateCollection(editingCollection.collection_id, formData);
            } else {
                await addCollection(formData);
            }

            setCollectionName("");
            setDescription("");
            setImageFile(null);
            setImagePreview(null);
            setRemoveExistingImage(false);
            setIsEditCollection(false);
            setEditingCollection(null);
            onClose();
        } catch (error) {
            console.error("Failed to save collection:", error);
        }
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-2xl shadow-lg w-96 p-6 relative">
                <button
                    className="absolute top-3 right-3  hover:text-red-500"
                    onClick={() => {
                        setIsEditCollection(false);
                        setEditingCollection(null);
                        onClose();
                    }}
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4 ">
                    {isEditCollection ? "Edit Collection" : "Add Collection"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="collectionName"
                            className="block text-[20px] font-medium"
                        >
                            Collection Name
                        </label>
                        <input
                            id="collectionName"
                            type="text"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
                            placeholder="Enter Collection Name"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2  focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-[20px] font-medium"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Description"
                            style={{ resize: "none" }}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2  focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none resize-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold mb-3">Collection Image</label>

                        <div
                            className="relative w-85 h-48 border-2 border-dashed border-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0493fb] transition"
                            onClick={() => document.getElementById("collectionImageInput").click()}
                        >
                            {imagePreview ? (
                                <>
                                    <img
                                        src={
                                            imagePreview.startsWith("blob:")
                                                ? imagePreview
                                                : `${BASE_URL}${imagePreview}`
                                        }
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent triggering input
                                            setImageFile(null);
                                            setImagePreview(null);
                                            setRemoveExistingImage(true);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <div className="text-center text-white">
                                    <p className="text-sm">Click or drag image here</p>
                                </div>
                            )}
                        </div>

                        {/* Hidden input */}
                        <input
                            id="collectionImageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));
                                    setRemoveExistingImage(false);
                                }
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditCollection(false);
                                setEditingCollection(null);
                                onClose();
                            }}
                            className="px-4 py-2 rounded-lg bg-[#0493fb]  hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#0493fb] text-white hover:bg-[#000060]"
                        >
                            {isEditCollection ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}