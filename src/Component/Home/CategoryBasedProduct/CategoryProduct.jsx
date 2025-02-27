  
import { useGetAllProductsQuery } from '../../../redux/api/ProductApi';
import CategoryShowcase from './CategoryShowcase';

const CategoryProduct = () => {
    const {data:products, isLoading:productsLoading, error:productsError} = useGetAllProductsQuery({limit: 'all'});

    // Group products by category into arrays
    const productsByCategory = {};
    
    if (productsLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (productsError) {
        return (
            <div className="text-center text-red-500 py-8">
                Error loading products. Please try again later.
            </div>
        );
    }

    products?.products?.forEach(product => {
        const category = product.basicInfo.category;
        if (!productsByCategory[category]) {
            productsByCategory[category] = [];
        }
        productsByCategory[category].push(product);
    });

    // Get categories with their product arrays, filter for min 4 products and take max 8
    const categoryCollections = Object.keys(productsByCategory)
        .filter(category => productsByCategory[category].length >= 4)
        .map(category => ({
            category,
            products: productsByCategory[category].slice(0, 8)
        }));

    return (
        <div className="my-5 space-y-20 ">
            {categoryCollections.map(categoryProducts => 
                <CategoryShowcase 
                    key={categoryProducts.category} 
                    category={categoryProducts.category} 
                    products={categoryProducts.products}
                />
            )}
        </div>
    );
};

export default CategoryProduct;
