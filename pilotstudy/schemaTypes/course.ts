const course = {
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    { name: 'title', title: 'Course Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'duration', title: 'Duration', type: 'string' },
    { name: 'students', title: 'Students', type: 'number' },
    { name: 'price', title: 'Price', type: 'string' },
    { name: 'level', title: 'Level', type: 'string' },
    {
      name: 'quizzes',
      title: 'Quizzes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'quiz' }] }]
    }
  ]
}
export default course 