// A friendly second name for the same feed, so /community/feed.xml works for
// anyone who guesses that instead of .xml on the directory. `dynamic` has to be
// declared here rather than re-exported — Next rejects a re-exported config.
import { GET } from "../rss.xml/route";

export const dynamic = "force-dynamic";
export { GET };
