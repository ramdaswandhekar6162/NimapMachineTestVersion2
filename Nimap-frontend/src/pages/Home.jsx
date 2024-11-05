import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { GET_PRODUCTS } from '../constants/api';
import { useEffect, useState } from 'react';
import { fetchData } from '../utils/apiUtils';
import { GET_CATEGORIES } from '../constants/api';
import { ADD_PRODUCT } from '../constants/api';

const Home = () => {
    const [productsData, setProductsData] = useState({});
    const [productsDataLoading, setProductsDataLoading] = useState(false);
    const [productName, setProductName] = useState('');
    const [categoriesData, setCategoriesData] = useState([]);
    const [categoriesDataLoading, setCategoriesDataLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchProducts = (pageNum) => {
        fetchData(
            `${GET_PRODUCTS}?page=${pageNum || 1}`,
            setProductsData,
            setProductsDataLoading,
            `Some thing wen wrong while fetching: ${GET_PRODUCTS}`
        );
    };
    const fetchCategories = () => {
        fetchData(
            GET_CATEGORIES,
            setCategoriesData,
            setCategoriesDataLoading,
            `Some thing went wrong while fetching: ${GET_CATEGORIES}`
        );
    };
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);
    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
    };
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };
    const handleEditFormSubmit = async (evt) => {
        evt.preventDefault();
        try {
            await axios.post(
                `${ADD_PRODUCT}?name=${productName}&categoryId=${selectedCategory}`
            );
            fetchProducts();
        } catch {
            console.error('Add product failure');
            alert('Add product failure');
        }
    };

    return (
        <div>
            <h3 className="flex justify-center p-8 text-3xl text-slate-200">
                Products
            </h3>
            <form
                className="mb-8 flex gap-8 p-4"
                onSubmit={handleEditFormSubmit}>
                <input
                    type="text"
                    id="product_name"
                    className="ml-auto w-52 rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter new product name"
                    value={productName}
                    onChange={handleProductNameChange}
                    required
                />
                {categoriesDataLoading ? (
                    <p>Loading...</p>
                ) : (
                    <select
                        id="all_categories"
                        className="inline rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        value={selectedCategory}
                        onChange={handleCategoryChange}>
                        <option>Select a category</option>
                        {categoriesData.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                )}

                <button
                    type="submit"
                    className="inline rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800">
                    Submit
                </button>
            </form>
            <div className="flex min-h-60 flex-wrap items-start justify-evenly gap-8">
                {productsDataLoading ? (
                    <p>loading...</p>
                ) : (
                    productsData?.products?.map((productData, index) => {
                        return (
                            <ProductCard
                                key={index}
                                productData={productData}
                            />
                        );
                    })
                )}
            </div>
            <div className="mt-36 flex justify-center">
                <button
                    className={`ms-3 flex h-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 text-base font-medium ${
                        productsData?.pagination?.current <= 1
                            ? 'cursor-not-allowed bg-gray-600 text-gray-400'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => {
                        let prevNum = productsData?.pagination?.current - 1;
                        fetchProducts(prevNum);
                    }}
                    disabled={productsData?.pagination?.current <= 1}>
                    Previous
                </button>

                <button
                    className={`ms-3 flex h-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 px-4 text-base font-medium ${
                        productsData?.pagination?.current >=
                        productsData?.pagination?.totalPages
                            ? 'cursor-not-allowed bg-gray-600 text-gray-400'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                    disabled={
                        productsData?.pagination?.current >=
                        productsData?.pagination?.totalPages
                    }
                    onClick={() => {
                        let nextNum = productsData?.pagination?.current + 1;
                        fetchProducts(nextNum);
                    }}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
