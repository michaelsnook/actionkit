// In a NextJS project you would just put this in /pages/api;
// this file only runs on the server (so API keys don't leak)
// and it caches res.json at the end of the 'handler' function

import { akPost } from '../../lib/actionkit' // write this
const actionkit_api_key = process.env.SECRET_AK_API_KEY

export default function handler(req, res) {
  const data = await akPost(`/report/run/custom_targets?target_set=bad_banks`)
  res.status(200).json(data)
}
