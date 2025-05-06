import { api } from "@/configs/fc";
import { auth } from "@/lib/auth";

export const loader = auth(async function ({ params: { memberId }, session }) {
  api.session(session)
  const { member } = await api.get(`/members/${memberId}`);
  return { member };
});

export default function Member({ loaderData: { member, error } }) {
  return <div>{member.id}</div>;
}
