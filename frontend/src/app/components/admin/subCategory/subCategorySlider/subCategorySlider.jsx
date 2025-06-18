import { useRef } from "react";
import SubcategoryCard from "../SubCateogryCard/SubCateogryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARD_WIDTH = 220;
const VISIBLE_CARDS = 6;

const SubcategorySlider = ({ subcategories = [], onEdit, onDeleted }) => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = CARD_WIDTH * VISIBLE_CARDS;
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full py-6">
      {/* Scrollable Card Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar "
      >
        {subcategories.map((sub) => (
          <div
            key={sub.id}
            style={{
              minWidth: `${CARD_WIDTH}px`,
              flexShrink: 0,
            }}
          >
            <SubcategoryCard
              subcategory={sub}
              onEdit={onEdit}
              onDeleted={onDeleted}
            />
          </div>
        ))}
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-pink-500 text-white shadow-md rounded-full p-2 hover:bg-pink-600"
      >
        <ChevronRight size={24} />
      </button>

      {/* Hide Scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SubcategorySlider;
