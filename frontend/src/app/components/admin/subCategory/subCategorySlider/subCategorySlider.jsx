import { useRef } from "react";
import SubcategoryCard from "../SubCateogryCard/SubCateogryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARD_WIDTH = 220;
const CARD_GAP = 16; // gap-4 = 16px

const SubcategorySlider = ({ subcategories = [], onEdit, onDeleted }) => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    // Calculate how many cards fit in the container
    const visibleCards = Math.floor(
      container.clientWidth / (CARD_WIDTH + CARD_GAP)
    );
    // Scroll by 1 less than visible cards for better UX
    const scrollCards = Math.max(1, visibleCards - 1);
    const scrollAmount = scrollCards * (CARD_WIDTH + CARD_GAP);

    // Calculate maximum scroll position
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newPosition =
      direction === "right"
        ? Math.min(container.scrollLeft + scrollAmount, maxScroll)
        : Math.max(container.scrollLeft - scrollAmount, 0);

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative  py-6 bg-green-700 w-full">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-4"
      >
        {subcategories.map((sub) => (
          <div
            key={sub.id}
            className="flex-shrink-0"
            style={{ width: `${CARD_WIDTH}px` }}
          >
            <SubcategoryCard
              subcategory={sub}
              onEdit={onEdit}
              onDeleted={onDeleted}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 border border-gray-200"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 border border-gray-200"
      >
        <ChevronRight size={24} />
      </button>

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
