import React, { useState, useEffect, useRef } from "react";

export function useCenterSnap(ref: React.RefObject<HTMLDivElement>) {
  const [centerIndex, setCenterIndex] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      // Assuming all children have the same width
      const container = ref.current;
      if (container) {
        const children = Array.from(container.children) as HTMLDivElement[];
        const containerCenter =
          container.scrollLeft + container.offsetWidth / 2;

        let closestChildIdx = 0;
        let smallestDistance = Infinity;

        children.forEach((child, index) => {
          const childCenter = child.offsetLeft + child.offsetWidth / 2;
          const distance = Math.abs(containerCenter - childCenter);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestChildIdx = index;
          }
        });

        setCenterIndex(closestChildIdx);
      }
    };

    const container = ref.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [ref]);

  return [centerIndex];
}
