import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
const ProductGrid = ({ products, loading, error, onAddToCart, onRetry }) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

if (!products || products.length === 0) {
    return (
      <Empty
        title="No Products Found"
        message="We couldn't find any products matching your search. Try using different keywords, checking your spelling, or browse our categories to discover great products."
        actionLabel="Clear Filters"
        onAction={onRetry}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;