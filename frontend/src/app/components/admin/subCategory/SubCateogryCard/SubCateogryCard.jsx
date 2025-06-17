const SubcategoryCard = ({ subcategory }) => {
  return (
    <div className="bg-gray-100 px-4 py-2 rounded text-gray-700 hover:bg-gray-200 transition cursor-pointer">
      {subcategory.name}
    </div>
  );
};

export default SubcategoryCard;
