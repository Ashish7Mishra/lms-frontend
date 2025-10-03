import { Link } from 'react-router-dom';
const CourseCard = ({ id, title, description, category }) => {

    return (
        <Link to={`/course/${id}`} className="course-card-link">
            <div className="course-card">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="category-badge">Category: {category}</div>
            </div>
        </Link>
    )

}

export default CourseCard;