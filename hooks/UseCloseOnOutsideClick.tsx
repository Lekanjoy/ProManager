'use client'

// Custom Hook to remove visibiliity of a component based on clicks outside its container
import {useEffect} from 'react'

const UseCloseOnOutsideClick = ({children, Ref, isOpen, setIsOpen, excludeRef }: {
    children:React.ReactNode;
    Ref: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    excludeRef?: React.RefObject<HTMLDivElement | SVGSVGElement>;
}) => {

  const handleClickOutside = (event: MouseEvent) => {
    if (
    Ref.current &&
      event.target instanceof Node &&
      !Ref.current.contains(event.target) &&
      event.target !== excludeRef?.current
    ) {
        setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={Ref}>{children}</div>
  )
}

export default UseCloseOnOutsideClick