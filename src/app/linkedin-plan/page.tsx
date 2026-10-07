import { PlanShell, PlanSection, PLAN_TEXT, planMetadata } from "@/components/social/plan-shell";
import { PostCard } from "@/components/social/post-card";
import { LINKEDIN_ASSETS, LINKEDIN_INTRO, LINKEDIN_SETUP, LINKEDIN_STORIES, profileFor } from "@/lib/social-plan";
import { SetupChecklist } from "@/components/social/setup-checklist";
import { ProfilePreview } from "@/components/social/post-preview";
import { ProfileSetup } from "@/components/social/profile-setup";

export const metadata = planMetadata("LinkedIn content plan", "/linkedin-plan", "Seven weeks of decision stories for founders and product leaders: LinkedIn text posts with square PDF carousels, the setup checklist, profile and company page texts, profile images, and campaign links.");

export default function LinkedInPlanPage() {
  return <PlanShell title="Show the thinking behind the build." active="/linkedin-plan" description="The same fourteen English stories as the Instagram account, written as LinkedIn posts: the problem, the constraint, the choice and its limits, in Benito's own voice, each with its carousel as a document.">
    <PlanSection number="01" title="Let the evidence carry the claim."><p className={PLAN_TEXT}>Two posts a week for seven weeks, in step with the English Instagram account: each is a text post written for LinkedIn, with the same carousel attached as a square PDF document. The work leads: UniMeet, Renewable Pulse, Flora, Markado and Prumo carry most of the series; the delivered scope of each project stays visible, and UniMeet&apos;s screens are labelled as the proposed v2 design.</p><p className={`mt-4 ${PLAN_TEXT}`}>Post from Benito&apos;s profile, which carries the founder&apos;s voice, and reshare to the company page as supporting proof. No follower count or historical performance is assumed. Every draft links its sampled content patterns separately from its own evidence.</p></PlanSection>
    <PlanSection number="02" title="Set it up, in this order."><p className={`mb-8 ${PLAN_TEXT}`}>LinkedIn has no profile grid and no Stories, so the Instagram launch trio and teaser don&apos;t carry over. One introduction post comes before week 1 instead. Everything below happens once; the texts it refers to are in section 03.</p><SetupChecklist phases={LINKEDIN_SETUP} intro={LINKEDIN_INTRO} assets={LINKEDIN_ASSETS} assetBase="/linkedin-plan" /></PlanSection>
    <PlanSection number="03" title="Paste these texts."><ProfileSetup profile={profileFor("linkedin")} /></PlanSection>
    <PlanSection number="04" title="Review the visual series."><ProfilePreview stories={LINKEDIN_STORIES} channel="linkedin" /></PlanSection>
    <section aria-label="LinkedIn post drafts" className="space-y-4">{LINKEDIN_STORIES.map((story) => <PostCard key={story.id} story={story} channel="linkedin" />)}</section>
    <PlanSection number="05" title="Review relevance, then distribution."><p className={PLAN_TEXT}>Look at conversations with people who have a relevant business problem. Use native impressions and reached-member metrics for context; tagged website visits and confirmed enquiries describe different steps. Keep those signals separate when deciding which story to repeat.</p></PlanSection>
  </PlanShell>;
}
