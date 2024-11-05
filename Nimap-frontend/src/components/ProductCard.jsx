import { Link } from 'react-router-dom';

const ProductCard = ({ productData }) => {
    return (
        <Link
            className="block max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 shadow hover:bg-gray-700"
            to={`/product/${productData?.id || ''}`}>
            <p className="mb-2 text-2xl font-bold tracking-tight text-white">
                {productData?.name || ''}
            </p>
        </Link>
    );
};

export default ProductCard;
