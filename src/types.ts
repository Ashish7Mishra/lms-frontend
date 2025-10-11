
export interface Instructor {
  _id: string;
  name: string;
  email: string;
}
export interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string; 
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  instructor: Instructor;
  isActive: boolean;
  enrollment: boolean; 
  progress: number;   
}

export interface PaginatedCoursesResponse {
  data: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}


export interface Lesson {
  _id: string;
  title: string;
  content: string;
  order: number;
  videoUrl: string; 
  isCompleted?: boolean; 
}