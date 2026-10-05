import { PlanShell, planMetadata } from "@/components/social/plan-shell";
import { PostBuilder } from "@/components/social/post-builder";
import { blankPost, storyPost, type ArtPost } from "@/lib/social-art";
import { STORIES } from "@/lib/social-plan";

export const metadata = planMetadata("Post builder", "/post-builder", "Build Blessed Moon social post drafts from the researched plan, edit slides and save local assets.");

export default async function PostBuilderPage({ searchParams }: { searchParams: Promise<{ story?: string; channel?: string }> }) {
  const query = await searchParams;
  const channel = query.channel === "linkedin" ? "linkedin" : "instagram";
  const story = STORIES.find((item) => item.id === query.story);
  const post: ArtPost = story ? storyPost(story, channel) : { ...blankPost(), channel, format: channel === "linkedin" ? "landscape" : "portrait" };
  return <PlanShell title="Turn the plan into a post." active="/post-builder" description="Start with a researched draft or an empty slide. Edit the words, add an approved project screenshot and save assets for review. Everything is generated locally in your browser."><PostBuilder key={`${post.id}-${channel}`} stories={STORIES} initialPost={post} /></PlanShell>;
}
