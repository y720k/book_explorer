import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import BookCard from "./BookCard";
import { useRef } from "react";


const BookCardSlider = ({ books }) => {
  	
	const scrollContainer = useRef(null);
	const scrollLeft = () => scrollContainer.current.scrollBy({ left: -300, behavior: "smooth" });
	const scrollRight = () => scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });

	return (
		<div className="slider-container">
			<button className="arrow left-arrow" onClick={scrollLeft}>
				<MdArrowBackIos />
			</button>

			<div className="reading-list-container" ref={scrollContainer}>
				{books.map((b) => (
					<BookCard key={b.key} book={b} /> 
				))}   
			</div>
			
			<button className="arrow right-arrow" onClick={scrollRight}>
				<MdArrowForwardIos />
			</button>
		</div>
	);
};

export default BookCardSlider;
