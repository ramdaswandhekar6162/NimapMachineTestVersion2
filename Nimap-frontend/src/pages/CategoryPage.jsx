import { useParams, useNavigate } from 'react-router-dom';
import {
    GET_CATEGORIE,
    EDIT_CATEGORY,
    DELETE_CATEGORY
} from '../constants/api';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard'; // Ensure this is installed
import { FaRegCopy } from 'react-icons/fa'; // Ensure this is installed

const CategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categoryData, setCategoryData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [editData, setEditData] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    const fetchCategoryData = useCallback(() => {
        const categoryUrl = `${GET_CATEGORIE}?id=${id}`;
        setCategoryLoading(true);
        setErrorMessage(''); // Clear any previous error message

        axios
            .get(categoryUrl)
            .then((response) => {
                const categoryData = response.data;
                setCategoryData(categoryData);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Failed to fetch category data');
            })
            .finally(() => {
                setCategoryLoading(false);
            });
    }, [id]);

    const handleDeleteCategory = async () => {
        try {
            await axios.post(`${DELETE_CATEGORY}?id=${id}`);
            navigate('/');
        } catch {
            console.error('Delete failure');
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]);

    const handleEditFormSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const response = await axios.post(
                `${EDIT_CATEGORY}?id=${id}&name=${categoryName}`
            );

            if (response.status >= 200 && response.status < 300) {
                console.log('Product updated successfully:', response.data);
                fetchCategoryData(); // Refetch product data after successful post
                setEditData(false); // Optional: close edit form
            }
        } catch (err) {
            console.log('post error: ', err);
        }
    };

    return (
        <div>
            {categoryLoading ? (
                <p>Loading...</p>
            ) : errorMessage ? (
                <p>{errorMessage}</p>
            ) : (
                <table className="w-full rounded-md text-left text-sm text-gray-400">
                    <thead className="text-xs uppercase text-gray-400">
                        <tr className="border-b border-t border-gray-700">
                            <th scope="col" className="bg-gray-800 px-6 py-3">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-700">
                            <th
                                scope="row"
                                className="whitespace-nowrap bg-gray-800 px-6 py-4 font-medium text-white">
                                Category ID
                            </th>
                            <td className="flex items-center justify-between gap-4 px-6 py-4">
                                {categoryData?.id}
                                <CopyToClipboard text={categoryData?.id}>
                                    <button>
                                        <FaRegCopy />
                                    </button>
                                </CopyToClipboard>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-700">
                            <th
                                scope="row"
                                className="whitespace-nowrap bg-gray-800 px-6 py-4 font-medium text-white">
                                Category Name
                            </th>
                            <td className="flex items-center justify-between gap-4 px-6 py-4">
                                {categoryData?.name}
                                <CopyToClipboard text={categoryData?.name}>
                                    <button>
                                        <FaRegCopy />
                                    </button>
                                </CopyToClipboard>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}{' '}
            <div>
                <div className="ml-4 mt-6">
                    <button
                        type="button"
                        className="mb-2 me-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
                        onClick={() => setEditData(!editData)}>
                        Edit
                    </button>
                    <button
                        type="button"
                        className="mb-2 me-2 ml-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-900"
                        onClick={handleDeleteCategory}>
                        Delete
                    </button>
                </div>
                {editData && (
                    <form className="w-96 p-4" onSubmit={handleEditFormSubmit}>
                        <label
                            htmlFor="product_name"
                            className="mb-2 block text-sm font-medium text-white">
                            Enter new Category name
                        </label>
                        <input
                            type="text"
                            id="product_name"
                            className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            value={categoryName}
                            onChange={handleCategoryNameChange}
                            required
                        />
                        <button
                            type="submit"
                            className="mb-2 me-2 mt-4 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800">
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
