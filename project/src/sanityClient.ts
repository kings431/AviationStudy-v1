import { createClient } from '@sanity/client'

export default createClient({
  projectId: '8tobtm2z', // your Sanity project ID
  dataset: 'production', // or your dataset name
  useCdn: true, // `false` if you want fresh data
  apiVersion: '2023-01-01', // use today's date or the latest
})
