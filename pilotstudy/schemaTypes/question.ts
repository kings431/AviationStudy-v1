const question = {
  name: 'question',
  title: 'Question',
  type: 'document',
  fields: [
    { name: 'text', title: 'Question Text', type: 'string' },
    {
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule: any) => Rule.min(2).max(6)
    },
    { name: 'correctAnswer', title: 'Correct Answer (index)', type: 'number' },
    { name: 'explanation', title: 'Explanation', type: 'text' }
  ]
}
export default question 