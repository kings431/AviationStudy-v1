const quiz = {
  name: 'quiz',
  title: 'Quiz',
  type: 'document',
  fields: [
    { name: 'title', title: 'Quiz Title', type: 'string' },
    {
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'question' }] }]
    }
  ]
}
export default quiz 