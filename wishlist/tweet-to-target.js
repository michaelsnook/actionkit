// This is a pseudo-code-y TweetToDropDownTarget component
// which will fetch page content from Contentful, a custom
// set of targets from Airtable, and then use ActionKit's
// generic actions API as a sort of headless back-end for
// recording actions. (You'd want to make sure Contentful
// tells the AK CMS API to create a new page of type "sign"
// and page.custom_fields.page_type='tweet-to-target'.)

import router from 'next/router'
import useMember from './lib/members'
import OneColumn from './layouts/OneColumn'
import { fetchCustomTargets } from './lib/airtable-wrapper'
import { fetchPageContent } from './lib/contentful-wrapper'
import { virtualPageSubmit } from './lib/actionkit-wrapper'
import { AKUserFormWrapper, MemberForm, TargetPicker } from './components/Forms'
import TweetToTarget from './components/TweetToTarget'

export default function TweetToDropDownTarget({ pageContent, targetSet }) {
  // write useMember a hook that uses params to fetch a recognized user
  // from AK (or could be your own member prefill service).
  const { member, error, isLoading } = useMember(router.params)
  // once the member is loaded, see if they have a custom field like `banks_targets=BofA`
  const targetInfo = targetSet[member?.custom_fields[`${pageContent.target_set}_targets`]] ?? null
  const { tweetVariations, targetType, ak_page_name } = pageContent

  /* 
    If there's no recognized user, present user inputs; if the're no custom
    field assigning a target (like a specific bank), ask for it; wrap both sets
    of inputs in a single AK form. Display the tweet action using the target
    loaded from Airtable, the Tweet text loaded from Contentful, and record
    the Tweet (intent) as an Action on a headless ActionKit page with a custom
    field indicating that its page type is actually 'tweet_to_target'.
  */
  return (
    <OneColumn meta={pageContent.metaData}>
      <div class="container centered">
        <AKUserFormWrapper>
          {!member && !isLoading ? <MemberForm /> : null}
          {!targetInfo ? <TargetPicker set={targetSet} type={targetType} /> : null}
        </AKUserFormWrapper>
        {targetInfo && // means everything is loaded and ready
          <TweetToTarget 
            targetType='bank'
            tweetVariations={tweetVariations} 
            username={targetInfo.username}
            recordAction={() => virtualPageSubmit(ak_page_name, member, router.params)}
          />
        }
      </div>
    </OneColumn>
  )
}

export async function getStaticProps({ params }) {
  const { data: pageContent } = await fetchPageContent(params.slug)
  const { data: targetSet } = 
    await fetchCustomTargets(pageContent.target_set) // e.g. 'banks'
  
  return { props: { pageContent, targetSet } }

}