import { getMember } from "./loaders";

export const loader = getMember;

export default function Member({ loaderData: { member } }) {
  return <div>{member.id}</div>;
}
