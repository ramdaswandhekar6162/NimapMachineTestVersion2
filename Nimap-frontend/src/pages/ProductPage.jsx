import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    GET_CATEGORIES,
    GET_PRODUCT,
    EDIT_PRODUCT,
    DELETE_PRODUCT
} from '../constants/api';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy } from 'react-icons/fa';
import axios from 'axios';
import { fetchData } from '../utils/apiUtils';

const ProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [productData, setProductData] = useState({});
    const [productDataLoading, setProductDataLoading] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [categoriesDataLoading, setCategoriesDataLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [editData, setEditData] = useState(false);
    const [productName, setProductName] = useState('');

    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // Move fetchProductData outside useEffect to make it reusable
    const fetchProductData = useCallback(() => {
        const productUrl = `${GET_PRODUCT}?id=${id}`;
        setProductDataLoading(true);
        axios
            .get(productUrl)
            .then((response) => {
                const productData = response.data;
                setProductData(productData);
                setProductName(productData?.product?.name || '');

                // Fetch categories after fetching product data
                fetchCategoriesData(productData?.product?.categoryId);
            })
            .catch((error) => {
                console.error('Error fetching product data:', error);
            })
            .finally(() => {
                setProductDataLoading(false);
            });
    }, [id]);

    // Fetch categories data
    const fetchCategoriesData = (productCategoryId) => {
        setCategoriesDataLoading(true);
        axios
            .get(GET_CATEGORIES)
            .then((response) => {
                const catData = response.data;
                setCategoriesData(
                    catData.map((item) => ({
                        ...item,
                        selected: item?.id === productCategoryId
                    }))
                );
                setSelectedCategory(productCategoryId);
            })
            .catch((error) => {
                console.error('Error fetching categories data:', error);
            })
            .finally(() => {
                setCategoriesDataLoading(false);
            });
    };

    // Call fetchProductData inside useEffect to load data on page load
    useEffect(() => {
        fetchProductData();
    }, [id, fetchProductData]);

    const handleDeleteProduct = async () => {
        try {
            await axios.post(`${DELETE_PRODUCT}?id=${id}`);
            navigate('/');
        } catch {
            console.error('Delete failure');
            alert('Delete failure');
        }
    };

    // Submit form and refetch data after successful edit
    const handleEditFormSubmit = async (evt) => {
        evt.preventDefault();
        try {
            const response = await axios.post(
                `${EDIT_PRODUCT}?productId=${id}&productName=${productName}&categoryId=${selectedCategory}`
            );

            if (response.status >= 200 && response.status < 300) {
                console.log('Product updated successfully:', response.data);
                fetchProductData(); // Refetch product data after successful post
                setEditData(false); // Optional: close edit form
            }
        } catch (err) {
            console.log('post error: ', err);
        }
    };

    return (
        <div>
            {productDataLoading ? (
                <p>Loading...</p>
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
                                Product ID
                            </th>
                            <td className="flex items-center justify-between gap-4 px-6 py-4">
                                {productData?.product?.id}
                                <CopyToClipboard
                                    text={productData?.product?.id}>
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
                                Product name
                            </th>
                            <td className="flex items-center justify-between gap-4 px-6 py-4">
                                {productData?.product?.name}
                                <CopyToClipboard
                                    text={productData?.product?.name}>
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
                                Category name
                            </th>
                            <td className="flex items-center justify-between gap-4 px-6 py-4">
                                {productData?.category?.name}
                                <CopyToClipboard
                                    text={productData?.category?.name}>
                                    <button>
                                        <FaRegCopy />
                                    </button>
                                </CopyToClipboard>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
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
                    onClick={handleDeleteProduct}>
                    Delete
                </button>
            </div>
            {editData && (
                <form className="w-96 p-4" onSubmit={handleEditFormSubmit}>
                    <label
                        htmlFor="product_name"
                        className="mb-2 block text-sm font-medium text-white">
                        Enter new product name
                    </label>
                    <input
                        type="text"
                        id="product_name"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        value={productName}
                        onChange={handleProductNameChange}
                        required
                    />
                    {categoriesDataLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <label
                                htmlFor="all_categories"
                                className="mb-2 mt-4 block text-sm font-medium text-white">
                                Select a category
                            </label>
                            <select
                                id="all_categories"
                                className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                value={selectedCategory}
                                onChange={handleCategoryChange}>
                                {categoriesData.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    <button
                        type="submit"
                        className="mb-2 me-2 mt-4 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800">
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default ProductPage;
