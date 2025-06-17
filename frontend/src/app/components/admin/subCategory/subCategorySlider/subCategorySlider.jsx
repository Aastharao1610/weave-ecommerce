import { useRef } from "react";
import SubcategoryCard from "../SubCateogryCard/SubCateogryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
const SubcategorySlider = ({ subcategories = [], onEdit, onDeleted }) => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "right" ? 300 : -300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto  p-2 scroll-smooth"
        >
          {subcategories.map((sub) => (
            <SubcategoryCard
              key={sub.id}
              subcategory={sub}
              onEdit={onEdit}
              onDeleted={onDeleted}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <button onClick={() => scroll("left")}>
            <ChevronLeft />
          </button>
          <button onClick={() => scroll("right")}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
export default SubcategorySlider;
