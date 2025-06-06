const userStat = {
  name: 'userStat',
  title: 'User Statistic',
  type: 'document',
  fields: [
    { name: 'userId', title: 'User ID', type: 'string' },
    { name: 'stage', title: 'Stage', type: 'string' }, // e.g., PPL, CPL
    { name: 'subject', title: 'Subject', type: 'string' }, // e.g., Air Law
    { name: 'date', title: 'Date', type: 'datetime' },
    { name: 'score', title: 'Score (%)', type: 'number' }
  ]
}
export default userStat 