/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import KeyFeatures from "./KeyFeatures";
import Specifications from "./Specifications";
// import VariantImageGallery from "./VariantImageGallery"; // <-- Import the component

const ProductDescription = ({ description }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <span className="text-green-600 text-xl">📋</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">পণ্যের বর্ণনা</h3>
    </div>
    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
      {description.split("\n").map((paragraph, idx) => (
        <p key={idx} className="mb-4 text-gray-600 leading-loose">{paragraph}</p>
      ))}
    </div>
  </div>
);

const PolicyAndShipping = ({ shippingDetails, additionalInfo }) => (
  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
    <div className="space-y-8">
      {/* শিপিং তথ্য */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl">📦</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">শিপিং তথ্য</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">ডাইমেনশন</p>
            <p className="font-medium text-gray-900">
              {shippingDetails.length} x {shippingDetails.width} x {shippingDetails.height} {shippingDetails.dimensionUnit}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500 mb-1">ওজন</p>
            <p className="font-medium text-gray-900">
              {shippingDetails.weight} {shippingDetails.weightUnit}
            </p>
          </div>
        </div>
        {additionalInfo?.estimatedDelivery && (
          <div className="mt-4 bg-blue-50 p-4 rounded-2xl">
            <p className="text-sm text-blue-800 font-medium mb-2">আনুমানিক ডেলিভারি</p>
            {additionalInfo.estimatedDelivery.split("\n").map((line, idx) => (
              <p key={idx} className="text-blue-600 text-sm">{line}</p>
            ))}
          </div>
        )}
      </div>
      {/* রিটার্ন নীতিমালা */}
      {additionalInfo?.returnPolicy && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">↩️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">রিটার্ন নীতিমালা</h3>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl space-y-2">
            {additionalInfo.returnPolicy.split("\n").map((line, idx) => (
              <p key={idx} className="text-purple-600 text-sm">{line}</p>
            ))}
          </div>
        </div>
      )}
      {/* ওয়ারেন্টি */}
      {additionalInfo?.warranty && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">🔧</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">ওয়ারেন্টি</h3>
          </div>
          <div className="bg-yellow-50 p-6 rounded-2xl space-y-2">
            {additionalInfo.warranty.split("\n").map((line, idx) => (
              <p key={idx} className="text-yellow-600 text-sm">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// const KeyFeatures = ({ features }) => (
//   features?.length > 0 && (
//     <section className="max-w-7xl mx-auto bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-3xl p-12">
//       <div className="text-center mb-16">
//         <span className="text-green-600 font-semibold mb-2 block">ফিচারসমূহ</span>
//         <h2 className="text-4xl font-bold text-gray-900 mb-4">মূল বৈশিষ্ট্য</h2>
//         <p className="text-gray-600 max-w-2xl mx-auto">এই পণ্যের বিশেষত্ব জানুন</p>
//       </div>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {features.map((feature, idx) => (
//           <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-100">
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
//               <span className="text-green-600 font-bold text-xl">{idx + 1}</span>
//             </div>
//             <p className="text-gray-800 font-medium leading-relaxed">{feature}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   )
// );



// const Specifications = ({ specifications }) => (
//   specifications?.length > 0 && (
//     <section className="max-w-7xl mx-auto">
//       <div className="text-center mb-16">
//         <span className="text-green-600 font-semibold mb-2 block">স্পেসিফিকেশন</span>
//         <h2 className="text-4xl font-bold text-gray-900 mb-4">প্রযুক্তিগত তথ্য</h2>
//         <p className="text-gray-600 max-w-2xl mx-auto">সম্পূর্ণ প্রযুক্তিগত স্পেসিফিকেশন</p>
//       </div>
//       <div className="grid md:grid-cols-2 gap-8">
//         {specifications.map((spec, idx) => (
//           <div key={idx} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">{spec.group}</h3>
//             <div className="space-y-4">
//               {spec.items.map((item, i) => (
//                 <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
//                   <span className="font-medium text-gray-700">{item.name}</span>
//                   <span className="text-gray-900 font-semibold">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   )
// );

const CustomerReviews = ({ reviews }) => (
  reviews?.length > 0 && (
    <section className="max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
      <div className="text-center mb-16">
        <span className="text-green-600 font-semibold mb-2 block">গ্রাহক মতামত</span>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">কাস্টমার রিভিউ</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">আমাদের গ্রাহকদের মতামত দেখুন</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-2xl">{review.user.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900">{review.user}</h4>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
              </div>
              <span className="ml-auto text-sm text-gray-500">{new Date(review.date).toLocaleDateString("bn-BD")}</span>
            </div>
            <p className="text-gray-700 leading-relaxed italic">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
);

// const FloatingCTA = ({ currentPrice, quantity, scrollToCheckout }) => (
//   <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4">
//     <div className="w-full max-w-7xl flex justify-center">
//       <button
//         onClick={scrollToCheckout}
//         className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
//       >
//         <span>🛒 অর্ডার করুন</span>
//         <span className="text-2xl font-bold">৳{(currentPrice * quantity).toLocaleString("bn-BD")}</span>
//       </button>
//     </div>
//   </div>
// );

const LandingPageProductDetails = ({
  product,
  //   currentPrice,
  //   quantity,
  //   scrollToCheckout
}) => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      {/* পণ্যের বিস্তারিত */}
      <section className="mx-auto">
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold mb-2 block">পণ্যের বিস্তারিত</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">পণ্যের বর্ণনা, স্পেসিফিকেশন, শিপিং এখানে দেখুন।</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <ProductDescription description={product.basicInfo.description} />
          <PolicyAndShipping shippingDetails={product.shippingDetails} additionalInfo={product.additionalInfo} />
        </div>
      </section>
      
      {/* Show the variant image gallery here */}
      <div className="mb-12">
        {/* <VariantImageGallery product={product} /> */}
      </div>
      
      {/* মূল বৈশিষ্ট্য, স্পেসিফিকেশন এবং কাস্টমার রিভিউ */}
      <section className="mx-auto">         
        <KeyFeatures features={product.basicInfo.keyFeatures} />
        <Specifications specifications={product.specifications} />
        <CustomerReviews reviews={product.reviews} />
      </section>
      {/* <FloatingCTA currentPrice={currentPrice} quantity={quantity} scrollToCheckout={scrollToCheckout} /> */}
    </div>
  )
}

export default LandingPageProductDetails
