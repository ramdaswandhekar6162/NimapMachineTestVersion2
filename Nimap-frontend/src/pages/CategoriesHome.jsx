import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import axios from 'axios';
import { ADD_CATEGORY, GET_CATEGORIES } from '../constants/api';
import { fetchData } from '../utils/apiUtils';

const CategoriesHome = () => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [categoriesDataLoading, setCategoriesDataLoading] = useState(false);

    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    const handleEditFormSubmit = async (evt) => {
        evt.preventDefault();
        try {
            await axios.post(`${ADD_CATEGORY}?name=${categoryName}`);
            fetchCategories();
        } catch {
            console.error('Add category failure');
        }
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
        fetchCategories();
    }, []);

    return (
        <div>
            <h3 className="flex justify-center p-8 text-3xl text-slate-200">
                Categories
            </h3>
            <form
                className="mb-8 flex gap-8 p-4"
                onSubmit={handleEditFormSubmit}>
                <input
                    type="text"
                    id="product_name"
                    className="ml-auto w-52 rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter new category name"
                    value={categoryName}
                    onChange={handleCategoryNameChange}
                    required
                />

                <button
                    type="submit"
                    className="inline rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800">
                    Submit
                </button>
            </form>
            <div className="flex flex-wrap justify-evenly gap-8">
                {categoriesDataLoading ? (
                    <p>Loading</p>
                ) : (
                    categoriesData?.map((categoryData, index) => {
                        return (
                            <CategoryCard
                                key={index}
                                categoryData={categoryData}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CategoriesHome;
