import { Link } from 'react-router-dom';

const CategoryCard = ({ categoryData }) => {
    return (
        <div>
            <Link
                className="block max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 shadow hover:bg-gray-700"
                to={`/category/${categoryData?.id || ''}`}>
                <p className="mb-2 text-2xl font-bold tracking-tight text-white">
                    {categoryData?.name}
                </p>
            </Link>
        </div>
    );
};

export default CategoryCard;
