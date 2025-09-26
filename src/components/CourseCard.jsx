
const CourseCard = ({ title, description, category }) => {

    return (
        <div className="course-card">

            <h3>{title}</h3>
            <p>{description}</p>
            <div className="category-badge">Category: {category}</div>
            <button className="view-course-btn">View Course</button>


        </div>
    )

}

export default CourseCard;